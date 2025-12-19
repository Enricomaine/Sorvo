class AddSellerToOrder < ActiveRecord::Migration[8.0]
  def change
    add_reference :orders, :seller, null: false, foreign_key: true
  end
end
