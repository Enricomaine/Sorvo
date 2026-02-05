class PriceTableItem < ApplicationRecord
  belongs_to :item
  belongs_to :price_table

  validates :final_price, presence: true
  validates :base_price, numericality: { greater_than: 0 }, allow_nil: true
end
