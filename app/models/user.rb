class User < ApplicationRecord
  has_secure_password

  has_one :seller 
  has_one :customer

  validates :username, presence: true, uniqueness: true
  validates :role, presence: true

  enum :role, { admin: 0, seller: 1, customer: 2 }
end
