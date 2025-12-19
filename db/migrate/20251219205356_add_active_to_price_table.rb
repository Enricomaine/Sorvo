class AddActiveToPriceTable < ActiveRecord::Migration[8.0]
  def change
    add_column :price_tables, :active, :boolean
  end
end
