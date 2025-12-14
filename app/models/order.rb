class Order < ApplicationRecord
  belongs_to :seller
  belongs_to :customer

  has_many :order_items, dependent: :destroy
  accepts_nested_attributes_for :order_items, reject_if: :all_blank

  enum :status, { pending: 0, cancelled: 1, delivered: 2 }

  validates :status, presence: true
end
