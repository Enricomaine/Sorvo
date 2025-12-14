class UsersController < ApplicationController
  before_action :set_user, only: %i[ show ]

  # GET /users
  # def index
  #   @users = User.all

  #   render json: @users
  # end

  # GET /users/1
  def show
    render json: @user
  end

  # POST /users
  # def create
  #   user_role = @current_user.role.to_i
  #   if user_role = 1
  #     if params[:user][:role].to_i != 2
  #       render json: { error: "Sellers can only register customers" }
  #     end
  #   end

  #   verify_seller_id
  #   @user = User.new(user_params)
  #   if @user.save
  #     render json: @user, status: :created, location: @user
  #   else
  #     render json: @user.errors, status: :unprocessable_content
  #   end
  # end

  # PATCH/PUT /users/1
  # def update
  #   verify_seller_id
  #   if @user.update(user_params)
  #     render json: @user
  #   else
  #     render json: @user.errors, status: :unprocessable_content
  #   end
  # end

  # # DELETE /users/1
  # def destroy
  #   @user.destroy!
  # end

  private
  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.expect(user: [
      :username,
      :password,
      :role
    ])
  end
end
