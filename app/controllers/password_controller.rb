class PasswordController < ApplicationController
  skip_before_action :authenticate_request!

  def forgot
    user = User.find_by(email: params[:email])
    if user
      token = SecureRandom.hex(10)
      user.update(
        reset_password_token: token,
        reset_password_sent_at: Time.current
      )
      render json: { message: "Recovery email sent" }, status: :ok
    else
      render json: { error: "Email not found" }, status: :not_found
    end
  end

  def reset
    user = User.find_by(reset_password_token: params[:token])
    if user && user.reset_password_sent_at > 2.hours.ago
      user.update(
        password: params[:password],
        reset_password_token: nil,
        reset_password_sent_at: nil
      )
      render json: { message: "Password updated" }, status: :ok
    else
      render json: { error: "Invalid or expired token" }, status: :unprocessable_entity
    end
  end
end
