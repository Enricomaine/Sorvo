class AddSellerToCustomers < ActiveRecord::Migration[8.0]
  def change
    add_reference :customers, :seller, null: false, foreign_key: true
  end
end
