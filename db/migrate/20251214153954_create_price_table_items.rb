class CreatePriceTableItems < ActiveRecord::Migration[8.0]
  def change
    create_table :price_table_items do |t|
      t.float :percentage
      t.float :final_price
      t.float :base_price
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
