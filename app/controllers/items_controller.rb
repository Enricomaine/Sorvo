class ItemsController < ApplicationController
  include Rails.application.routes.url_helpers
  before_action :set_item, only: %i[ show update destroy remove_image set_main_image ]

  before_action -> { require_role(:customer, :seller) }, only: %i[ show index ]
  before_action -> { require_role(:seller) }, only: %i[ create update destroy remove_image set_main_image ]

  # GET /items
  def index
    if get_customer_id.present?
      item_ids = Item.where(seller_id: get_seller_id).pluck(:id)
      prices_map = ItemPriceService.new(
        customer_id: get_customer_id,
        seller_id: get_seller_id
      ).prices_for(item_ids)

      @items = prices_map.values.map do |row|
        item = Item.find_by(id: row["id"])
        next unless item
        row.merge(item_with_main_image(item))
      end
    else
      @items = Item.where(seller_id: get_seller_id).map { |item| item_with_main_image(item) }
    end

    render json: @items
  end

  # GET /items/1
  def show
    json = item_with_images(@item)

    if get_customer_id.present?
      prices_map = ItemPriceService.new(
        customer_id: get_customer_id,
        seller_id: get_seller_id
      ).prices_for([ @item.id ])
      price_row = prices_map[@item.id]
      json = json.merge(price: price_row.present? ? price_row["price"] : @item.base_price)
    else
      json = json.merge(price: @item.base_price)
    end

    render json: json
  end

  # POST /items
  def create
    @item = Item.new(item_params)
    @item.seller_id = get_seller_id
    @item.active = true

    main_image_param = params.dig(:item, :main_image)
    @item.main_image.attach(main_image_param) if main_image_param.present?

    images_param = params.dig(:item, :images)
    @item.images.attach(images_param) if images_param.present?

    if @item.save
      render json: item_with_images(@item), status: :created, location: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /items/1
  def update
    ActiveRecord::Base.transaction do
      images_param = params.dig(:item, :images)
      @item.images.attach(images_param) if images_param.present?

      main_image_param = params.dig(:item, :main_image)
      if main_image_param.present?
        # keep previous main as secondary image
        if @item.main_image.attached?
          old_blob = @item.main_image.blob
          unless old_blob.nil?
            already_attached = @item.images.attachments.any? { |att| att.blob_id == old_blob.id }
            @item.images.attach(old_blob) unless already_attached
          end
          @item.main_image.purge
        end
        # replace main image with the uploaded file
        @item.main_image.attach(main_image_param)
      elsif params.dig(:item, :main_image).is_a?(String) && params.dig(:item, :main_image) == ""
        # explicit clear main image if client sends empty string
        @item.main_image.purge if @item.main_image.attached?
      end

      if @item.update(item_params)
        render json: item_with_images(@item)
      else
        render json: @item.errors, status: :unprocessable_entity
        raise ActiveRecord::Rollback
      end
    end
  end


  # DELETE /items/1
  def destroy
    @item.destroy!
  end

  # DELETE /items/:id/images/:image_id
  def remove_image
    image = @item.images.find(params[:image_id])
    image.purge

    render json: item_with_images(@item)
  rescue ActiveRecord::RecordNotFound
    render json: { error: "image not found" }, status: :not_found
  end

  # PATCH /items/:id/main_image/:image_id
  def set_main_image
    image = @item.images.find(params[:image_id])

    ActiveRecord::Base.transaction do
      # demote current main to secondary (if different from the new one)
      if @item.main_image.attached?
        old_blob = @item.main_image.blob
        if old_blob && old_blob.id != image.blob.id
          already_attached = @item.images.attachments.any? { |att| att.blob_id == old_blob.id }
          @item.images.attach(old_blob) unless already_attached
        end
        @item.main_image.purge
      end
      # set new main image from existing secondary
      @item.main_image.attach(image.blob)
    end

    render json: item_with_images(@item)
  rescue ActiveRecord::RecordNotFound
    render json: { error: "image not found" }, status: :not_found
  end

  private
  def set_item
    @item = Item.find(params.expect(:id))

    if @item.seller.id != get_seller_id
      render json: { error: "unavailable item" }, status: :forbidden
    end
  end

  def item_params
    params.expect(
      item: [
        :code,
        :description,
        :observation,
        :base_price,
        :active
      ]
    )
  end

  def item_with_main_image(item)
    item.as_json.merge(
      main_image_url: item.main_image.attached? ? url_for(item.main_image) : nil
    )
  end

  def item_with_images(item)
  images = item.images.attached? ? item.images.map { |img| { id: img.id, url: url_for(img) } } : []
  main_image_url = item.main_image.attached? ? url_for(item.main_image) : nil

  images = images.reject { |img| img[:url] == main_image_url }

    item.as_json.merge(
      main_image: {
        url: main_image_url
      },
      images: images
    )
  end
end
