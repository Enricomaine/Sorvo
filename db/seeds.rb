admin_password = ENV.fetch('ADMIN_PASSWORD', 'default_admin_password')

User.find_or_create_by!(email: 'admin@admin.com') do |user|
  user.password = admin_password
  user.role = 'admin'
end

User.find_or_create_by!(email: 'seller@seller.com') do |user|
  user.password = admin_password
  user.role = 'seller'
end

User.find_or_create_by!(email: 'customer@customer.com') do |user|
  user.password = admin_password
  user.role = 'customer'
end
