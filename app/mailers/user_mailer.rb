class UserMailer < ApplicationMailer
  # Send using app SMTP (default)
  def from_app(to:, subject:, html_body: nil, text_body: nil)
    mail(to: to, subject: subject) do |format|
      format.text { render plain: text_body } if text_body.present?
      format.html { render html: html_body.to_s.html_safe } if html_body.present?
    end
  end

  # Send using the user's SMTP account via per-mail delivery_method_options
  def from_user(user_id:, to:, subject:, html_body: nil, text_body: nil)
    user = User.find(user_id)

    smtp_opts = {
      address: user.smtp_address,
      port: user.smtp_port,
      user_name: user.smtp_user_name,
      password: user.smtp_password,
      authentication: (user.smtp_authentication || "plain").to_sym,
      enable_starttls_auto: user.smtp_enable_starttls_auto.nil? ? true : user.smtp_enable_starttls_auto
    }

    headers["Sender"] = user.email if user.email.present?

    mail(to: to, subject: subject, delivery_method_options: smtp_opts) do |format|
      format.text { render plain: text_body } if text_body.present?
      format.html { render html: html_body.to_s.html_safe } if html_body.present?
    end
  end
end
