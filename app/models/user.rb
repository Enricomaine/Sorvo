class User < ApplicationRecord
  has_secure_password

  has_one :seller
  has_one :customer

  validates :email, presence: true, uniqueness: true
  validates :role, presence: true

  enum :role, { admin: 0, seller: 1, customer: 2 }

  validate :email_must_be_valid

  private

  def email_must_be_valid
    Email.new(email)
  rescue ArgumentError => e
    errors.add(:email, e.message)
  end
end
