class PriceTable < ApplicationRecord
  belongs_to :seller
  has_many :price_table_items, dependent: :destroy
  has_many :customers, dependent: :destroy

  has_many :price_table_items, dependent: :destroy
  accepts_nested_attributes_for :price_table_items, reject_if: :all_blank

  validates :description, presence: true
end
