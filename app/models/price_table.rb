class PriceTable < ApplicationRecord
  belongs_to :seller
  has_many :price_table_items, dependent: :destroy
  has_many :customers, dependent: :destroy

  accepts_nested_attributes_for :price_table_items,
    allow_destroy: true,
    reject_if: ->(attrs) {
      # Reject entries missing required associations or price
      attrs["item_id"].blank? || attrs["final_price"].blank?
    }

  validates :description, presence: true
end
