class AddSmtpToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :smtp_address, :string
    add_column :users, :smtp_port, :integer
    add_column :users, :smtp_user_name, :string
    add_column :users, :smtp_password, :string
    add_column :users, :smtp_authentication, :string
    add_column :users, :smtp_enable_starttls_auto, :boolean
  end
end
