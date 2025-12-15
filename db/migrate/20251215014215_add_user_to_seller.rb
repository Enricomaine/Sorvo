class AddUserToSeller < ActiveRecord::Migration[8.0]
  def change
    add_reference :sellers, :user, null: false, foreign_key: true
  end
end
