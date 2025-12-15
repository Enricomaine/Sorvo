class AddSellerToItem < ActiveRecord::Migration[8.0]
  def change
    add_reference :items, :seller, null: false, foreign_key: true
  end
end
