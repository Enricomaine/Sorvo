class PriceTablesController < ApplicationController
  before_action :set_price_table, only: %i[ show update destroy ]
  
  before_action -> { require_role(:seller) }
  
  # GET /price_tables
  def index
    @price_tables = PriceTable.where(seller_id: get_seller_id)

    render json: @price_tables
  end

  # GET /price_tables/1
  def show
    if @price_table.seller_id != get_seller_id
      return render json: { error: "Unavailable price table" }, status: :forbidden
    end

    render json: @price_table.as_json(include: :price_table_items)
  end

  # POST /price_tables
  def create
    @price_table = PriceTable.new(price_table_params)
    @price_table.seller_id = get_seller_id
    @price_table.active = true

    items_attrs = price_table_params[:price_table_items_attributes]

    if items_attrs.blank? || items_attrs.empty?
      return render json: { error: "Price tables must have at least one item" }, status: :unprocessable_entity
    end

    item_ids = items_attrs.map{ |item| item[:item_id] }
    valid_item_ids = Item.where(id: item_ids, seller_id: get_seller_id).pluck(:id)
    invalid_items = item_ids - valid_item_ids

    if invalid_items.any?
      return render json: { error: "Invalid items: #{invalid_items.join(', ')}" }, status: :forbidden
    end


    ActiveRecord::Base.transaction do 
      if @price_table.save 
        render json: @price_table.as_json(include: :price_table_items), status: :created 
      else
        render json: @price_table.errors, status: :unprocessable_entity
        raise ActiveRecord::Rollback
      end
    end
  end

  # PATCH/PUT /price_tables/1
  def update
    if @price_table.seller_id != get_seller_id
      return render json: { error: "Unavailable price table" }, status: :forbidden
    end

    if @price_table.update(price_table_params)
      render json: @price_table.as_json(include: :price_table_items)
    else
      render json: @price_table.errors, status: :unprocessable_entity
    end
  end

  # DELETE /price_tables/1
  def destroy
    if @price_table.seller_id != get_seller_id
      return render json: { error: "Unavailable price table" }, status: :forbidden
    end

    @price_table.destroy!
  end

  private
  def set_price_table
    @price_table = PriceTable.includes(:price_table_items).find(params.expect(:id))
  end

  def price_table_params
    params.expect(
      price_table: [ 
        :description, 
        :observation,
        price_table_items_attributes: [
          [
            :item_id,
            :base_price,
            :percentage,
            :final_price
          ]
        ]
      ]
    )
  end
end
