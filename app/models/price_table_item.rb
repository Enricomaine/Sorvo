class PriceTableItem < ApplicationRecord
  belongs_to :item
  belongs_to :price_table

  validates :final_price, presence: true
end
