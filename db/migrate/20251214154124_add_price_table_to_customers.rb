class AddPriceTableToCustomers < ActiveRecord::Migration[8.0]
  def change
    add_reference :customers, :price_table, null: false, foreign_key: true
  end
end
