class EmailSenderService
  # Dispatch email via app or user's SMTP, enqueued to Sidekiq via deliver_later
  # params:
  #   account: :app or :user
  #   user: optional User when account == :user
  #   to:, subject:, html_body:, text_body:
  def self.send_email(account:, to:, subject:, html_body: nil, text_body: nil, user: nil)
    case account.to_sym
    when :app
      UserMailer.from_app(to: to, subject: subject, html_body: html_body, text_body: text_body).deliver_later(queue: :mailers)
    when :user
      raise ArgumentError, "user is required for :user account" unless user&.id
      UserMailer.from_user(user_id: user.id, to: to, subject: subject, html_body: html_body, text_body: text_body).deliver_later(queue: :mailers)
    else
      raise ArgumentError, "unknown account: #{account}"
    end
  end
end
