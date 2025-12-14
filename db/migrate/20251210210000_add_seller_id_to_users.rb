class AddSellerIdToUsers < ActiveRecord::Migration[7.1]
  def change
    add_reference :users, :seller, foreign_key: { to_table: :users }, index: true, null: true
  end
end
