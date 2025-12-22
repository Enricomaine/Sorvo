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
      # Enqueue password reset email
      begin
        base_url = Rails.configuration.x.base_url
        reset_link = "#{base_url}/password/reset?token=#{token}"
        subject = "Redefinição de senha"
        text_body = <<~TEXT
          Olá,

          Recebemos uma solicitação para redefinir sua senha.
          Seu token de redefinição é: #{token}

          Se você estiver usando um cliente/SPA, utilize este token para chamar o endpoint de redefinição.

          Link sugerido (se houver página web para reset):
          #{reset_link}

          Caso não tenha feito esta solicitação, ignore este email.
        TEXT

        EmailSenderService.send_email(
          account: :app,
          to: user.email,
          subject: subject,
          text_body: text_body
        )
        Rails.logger.info("Password reset email enqueued for user ##{user.id}")
      rescue => e
        Rails.logger.error("Failed to enqueue password reset email for user ##{user.id}: #{e.message}")
      end
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
