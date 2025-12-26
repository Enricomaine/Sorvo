class AddEmailToUsers < ActiveRecord::Migration[8.0]
  def change
    unless column_exists?(:users, :email)
      add_column :users, :email, :string, null: false
    end

    unless index_exists?(:users, :email, unique: true)
      add_index :users, :email, unique: true
    end
  end
end
