class AddUuidToSellers < ActiveRecord::Migration[8.0]
  def up
    # Enable pgcrypto to use gen_random_uuid() for default UUIDs
    enable_extension "pgcrypto" unless extension_enabled?("pgcrypto")

    # Add uuid column with default generator and unique index
    add_column :sellers, :uuid, :uuid, default: "gen_random_uuid()", null: false
    add_index :sellers, :uuid, unique: true
  end

  def down
    remove_index :sellers, :uuid
    remove_column :sellers, :uuid
    # Do not disable pgcrypto; it may be used elsewhere
  end
end
