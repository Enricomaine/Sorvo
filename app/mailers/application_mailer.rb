class ApplicationMailer < ActionMailer::Base
  default from: (Rails.application.credentials.dig(:smtp, :from) || ENV.fetch("SMTP_FROM", "no-reply@example.com"))
  layout "mailer"
end
