class CreateSellers < ActiveRecord::Migration[8.0]
  def change
    create_table :sellers do |t|
      t.string :name
      t.string :document
      t.string :phone
      t.integer :person_type
      t.boolean :active

      t.timestamps
    end
  end
end
