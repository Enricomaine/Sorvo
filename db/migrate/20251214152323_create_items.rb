class CreateItems < ActiveRecord::Migration[8.0]
  def change
    create_table :items do |t|
      t.string :code
      t.string :description
      t.string :observation
      t.float :base_price
      t.boolean :active

      t.timestamps
    end
  end
end
