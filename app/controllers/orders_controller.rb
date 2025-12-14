class OrdersController < ApplicationController
  before_action :set_order, only: %i[ show update destroy ]

  before_action -> { require_role(:customer, :seller) }

  # GET /orders
  def index
    if get_customer_id.present?
      @orders = Order.includes(:order_items).where(customer_id: get_customer_id)
    else 
      @orders = Order.includes(:customer, :order_items).where(seller_id: get_seller_id)
    end

    orders_json = @orders.map do |order|
      total_value = order.order_items.sum { |item| item.quantity.to_f * item.unit_price.to_f }

      order.as_json(
        only: [:id, :customer_id, :seller_id, :status, :created_at],
        include: {
          customer: { only: :trade_name }
        }
      ).merge(total_value: total_value)
    end

    render json: orders_json
  end

  # GET /orders/1
  def show
    # if @order.seller_id != get_seller_id
    #   return render json: { error: "Unavailable order" }, status: :forbidden0
    # end

    render json: @order.as_json(
      include: {
        customer: { only: :trade_name },
        order_items: {
          include: {
            item: {}
          }
        }
      })
  end

  # POST /orders
  def create
    @order = Order.new(order_params)
    @order.seller_id = get_seller_id
    @order.status = :pending

    if get_customer_id.present?
      @order.customer_id = get_customer_id
    end

    items_attrs = order_params[:order_items_attributes]

    if items_attrs.blank? || items_attrs.empty?
      return render json: { error: "Order must have at least one item" }, status: :unprocessable_entity
    end

    item_ids = items_attrs.map{ |item| item[:item_id] }
    valid_items_ids = Item.where(id: item_ids, seller_id: get_seller_id).pluck(:id)
    invalid_items = item_ids - valid_items_ids

    if invalid_items.any?
      return render json: { error: "Invalid items: #{invalid_items.join(', ')}" }, stauts: :forbidden
    end

    prices_map = ItemPriceService.new(
      customer_id: get_customer_id,
      seller_id: get_seller_id
    ).prices_for(item_ids)

    items_attrs.each do |item_attr|
      unit_price = prices_map[item_attr[:item_id]]["price"]
      @order.order_items.build(
        item_id: item_attr[:item_id],
        quantity: item_attr[:quantity],
        unit_price: unit_price
      )
    end

    ActiveRecord::Base.transaction do 
      if @order.save 
        render json: @order.as_json(include: :order_items), status: :created
      else
        render json: @order.errors, status: :unprocessable_entity
        raise ActiveRecord::Rollback
      end
    end
  end

  # PATCH/PUT /orders/1
  def update
    # if @order.seller_id != get_seller_id 
    #   return render json: { error: "Unavailable order" }, status: :forbidden
    # end

    if @order.update(order_params)
      render json: @order.as_json(include: :order_items)
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  # DELETE /orders/1
  def destroy
    # if @order.seller_id != get_seller_id
    #   return render json: { error: "Unavailable order" }, status: :forbidden
    # end

    @order.destroy!
  end

  private
  def set_order
    @order = Order.includes(:order_items, :customer).find(params.expect(:id))

    if @order.seller.id != get_seller_id
      return render json: { error: "Unavailable order" }, status: :forbidden
    end
  end

  def order_params
    params.expect(
      order: [ 
        :observation,
        :status,
        :customer_id,
        order_items_attributes: [
          [
            :item_id,
            :quantity
          ]
        ]
      ]
    )
  end
end
