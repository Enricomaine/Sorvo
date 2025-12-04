admin_password = ENV.fetch('ADMIN_PASSWORD', 'default_admin_password')

User.find_or_create_by!(username: 'admin') do |user|
  user.password = admin_password
  user.role = 'admin'
end
