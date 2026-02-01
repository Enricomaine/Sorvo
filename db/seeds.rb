admin_password = ENV.fetch('ADMIN_PASSWORD', 'default_admin_password')

admin = User.find_or_create_by!(email: 'admin@admin.com') do |user|
  user.password = admin_password
  user.role = 'admin'
  user.active = true
end

seller_user = User.find_or_create_by!(email: 'seller@seller.com') do |user|
  user.password = admin_password
  user.role = 'seller'
  user.active = true
end

customer_user = User.find_or_create_by!(email: 'customer@customer.com') do |user|
  user.password = admin_password
  user.role = 'customer'
  user.active = true
end

seller = Seller.find_or_create_by!(user: seller_user) do |s|
  s.name = 'Loja Exemplo'
  s.person_type = :business
  s.document = '11444777000161'
  s.active = true
end

price_table = PriceTable.find_or_create_by!(seller: seller, description: 'Tabela Padrão', active: true)

require 'stringio'
item = Item.find_or_create_by!(seller: seller, code: 'ITEM-001') do |it|
  it.description = 'Produto de Exemplo'
  
  png_min = StringIO.new("\x89PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1F\x15\xC4\x89\x00\x00\x00\x0AIDAT\x78\x9C\x63\x60\x00\x00\x00\x02\x00\x01\xE2\x26\x05\x9B\x00\x00\x00\x00IEND\xAEB\x60\x82")
  it.main_image.attach(io: png_min, filename: 'pixel.png', content_type: 'image/png')
  it.active = true
end

PriceTableItem.find_or_create_by!(price_table: price_table, item: item) do |pti|
  pti.final_price = 9.99
end

customer = Customer.find_or_create_by!(user: customer_user, seller: seller) do |c|
  c.name = 'Cliente Exemplo'
  c.person_type = :person
  c.document = '52998224725'
  c.price_table = price_table
  c.active = true
end

order = Order.find_or_create_by!(seller: seller, customer: customer, status: :pending)

OrderItem.find_or_create_by!(order: order, item: item) do |oi|
  oi.quantity = 2
end

puts 'Seed data created: admin, seller, customer, seller profile, price table, item, price table item, order and order item.'
