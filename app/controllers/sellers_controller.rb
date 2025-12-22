class SellersController < ApplicationController
  before_action :set_seller, only: %i[ show update destroy ]
  before_action -> { require_role(:admin) }

  # GET /sellers
  def index
    @sellers = Seller.includes(:user).all
    render json: @sellers.as_json(include: { user: { only: [ :username ] } })
  end

  # GET /sellers/1
  def show
    render json: @seller.as_json(include: { user: { only: [ :username ] } })
  end

  # POST /sellers
  def create
    @seller = Seller.new(seller_params)
    @seller.active = true

    if @seller.save
      render json: @seller.as_json(include: :user), status: :created, location: @seller
    else
      render json: @seller.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sellers/1
  def update
    if params[:seller] && params[:seller][:user_attributes]
      params[:seller][:user_attributes][:id] = @seller.user.id

      if params[:seller][:user_attributes][:password].blank?
        params[:seller][:user_attributes].delete(:password)
      end
    end

    if @seller.update(seller_params)
      render json: @seller.as_json(include: { user: { only: [ :username ] } })
    else
      render json: @seller.errors, status: :unprocessable_entity
    end
  end

  # DELETE /sellers/1
  def destroy
    @seller.destroy!
  end

  private
  def set_seller
    @seller = Seller.find(params[:id])
  end

  def seller_params
    params.expect(seller: [
      :name,
      :document,
      :phone,
      :active,
      :person_type,
      user_attributes: [
        :id,
        :email,
        :password
      ]
    ])
  end
end
