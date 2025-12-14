class CreatePriceTables < ActiveRecord::Migration[8.0]
  def change
    create_table :price_tables do |t|
      t.string :description
      t.string :observation
      t.references :seller, null: false, foreign_key: true

      t.timestamps
    end
  end
end
