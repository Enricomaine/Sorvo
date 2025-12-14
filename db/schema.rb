# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_12_14_154124) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "customers", force: :cascade do |t|
    t.string "name"
    t.string "document"
    t.string "phone"
    t.integer "person_type"
    t.boolean "active"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email"
    t.bigint "seller_id", null: false
    t.bigint "price_table_id", null: false
    t.index ["price_table_id"], name: "index_customers_on_price_table_id"
    t.index ["seller_id"], name: "index_customers_on_seller_id"
    t.index ["user_id"], name: "index_customers_on_user_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "code"
    t.string "description"
    t.string "observation"
    t.float "base_price"
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "order_items", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.bigint "item_id", null: false
    t.float "quantity"
    t.float "unit_price"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_order_items_on_item_id"
    t.index ["order_id"], name: "index_order_items_on_order_id"
  end

  create_table "orders", force: :cascade do |t|
    t.string "observation"
    t.integer "status"
    t.bigint "customer_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_orders_on_customer_id"
  end

  create_table "price_table_items", force: :cascade do |t|
    t.float "percentage"
    t.float "final_price"
    t.float "base_price"
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_price_table_items_on_item_id"
  end

  create_table "price_tables", force: :cascade do |t|
    t.string "description"
    t.string "observation"
    t.bigint "seller_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["seller_id"], name: "index_price_tables_on_seller_id"
  end

  create_table "sellers", force: :cascade do |t|
    t.string "name"
    t.string "document"
    t.string "phone"
    t.integer "person_type"
    t.string "email"
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "password_digest"
    t.integer "role"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.string "email"
    t.bigint "seller_id"
    t.index ["seller_id"], name: "index_users_on_seller_id"
  end

  add_foreign_key "customers", "price_tables"
  add_foreign_key "customers", "sellers"
  add_foreign_key "customers", "users"
  add_foreign_key "order_items", "items"
  add_foreign_key "order_items", "orders"
  add_foreign_key "orders", "customers"
  add_foreign_key "price_table_items", "items"
  add_foreign_key "price_tables", "sellers"
  add_foreign_key "users", "users", column: "seller_id"
end
