require 'rails_helper'

RSpec.describe 'Login API', type: :request do
  describe 'POST /login' do
    it 'returns token for valid credentials' do
      user = User.create!(email: 'email@email.com', password_digest: BCrypt::Password.create('secret'), role: :seller)

      post '/login', params: { login: { email: 'email@email.com', password: 'secret' } }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['token']).to be_present
    end

    it 'rejects invalid credentials' do
      post '/login', params: { login: { email: 'ghost@email.com', password: 'nope' } }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
require 'rails_helper'

RSpec.describe "Logins", type: :request do
  describe "GET /index" do
    pending "add some examples (or delete) #{__FILE__}"
  end
end
