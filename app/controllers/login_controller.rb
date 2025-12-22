class LoginController < ApplicationController
  skip_before_action :authenticate_request!
  SECRET_KEY = Rails.application.secret_key_base

  def login
    user = User.find_by(email: login_params[:email])

    unless user
      return render json: { error: "User not found" }, status: :unauthorized
    end

    unless BCrypt::Password.new(user.password_digest) == login_params[:password]
      return render json: { error: "Invalid password" }, status: :unauthorized
    end

    token = jwt_encode(user_id: user.id, role: user.role)
    render json: { token: token }, status: :ok
  end

  def logout
    render json: { message: "Logged out successfully" }, status: :ok
  end

  private

  def jwt_encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  def login_params
    params.expect(
      login: [
        :email,
        :password
      ])
  end
end
