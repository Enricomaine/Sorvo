class CustomersController < ApplicationController
  before_action :set_customer, only: %i[ show update destroy ]
  before_action -> { require_role(:seller) }

  # GET /customers
  def index
    @customers = Customer
                  .includes(:user).all
                  .includes(:price_table).all
                  .where(seller_id: get_seller_id, active: true)

    render json: @customers.as_json(
      include: { 
        user: { only: [:username] },
        price_table: { only: [:description] } 
      })
  end

  # GET /customers/1
  def show
    render json: @customer.as_json(include: { user: { only: [ :username ] } })
  end

  # POST /customers
  def create
    @customer = Customer.new(customer_params)
    @customer.seller_id = get_seller_id
    @customer.active = true

    if @customer.save
      render json: @customer.as_json(include: :user), status: :created, location: @customer
    else
      render json: @customer.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /customers/1
  def update
    if params[:customer] && params[:customer][:user_attributes]
      params[:customer][:user_attributes][:id] = @customer.user.id

      if params[:customer][:user_attributes][:password].blank?
        params[:customer][:user_attributes].delete(:password)
      end
    end

    if @customer.update(customer_params)
      render json: @customer.as_json(include: { user: { only: [:username] } })
    else
      render json: @customer.errors, status: :unprocessable_entity
    end
  end

  # DELETE /customers/1
  def destroy
    @customer.destroy!
  end

  private
    def set_customer
      @customer = Customer.find(params.expect(:id))

      if @customer.seller.id != get_seller_id
        return render json: { error: "Unavailable customer" }, status: :forbidden
      end
    end

    def customer_params
      params.expect(customer: [ 
        :name, 
        :document,
        :phone, 
        :email,
        :person_type, 
        :price_table_id,
        :active,
         user_attributes: [
          :id,
          :username,
          :password
         ]
      ])
    end
end
