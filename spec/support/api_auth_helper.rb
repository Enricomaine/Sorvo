module ApiAuthHelper
  def auth_headers_for(user)
    payload = { user_id: user.id, role: user.role, exp: 24.hours.from_now.to_i }
    token = JWT.encode(payload, Rails.application.secret_key_base)
    {
      'Authorization' => "Bearer #{token}",
      'Content-Type' => 'application/json'
    }
  end
end
