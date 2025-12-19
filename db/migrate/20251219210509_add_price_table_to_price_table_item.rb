class AddPriceTableToPriceTableItem < ActiveRecord::Migration[8.0]
  def change
    add_reference :price_table_items, :price_table, null: false, foreign_key: true
  end
end
