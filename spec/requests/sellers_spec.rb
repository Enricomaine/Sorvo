require 'rails_helper'
require 'support/api_auth_helper'

RSpec.describe 'Sellers API', type: :request do
  include ApiAuthHelper

  let!(:seller_user) { User.create!(username: 'seller1', password_digest: BCrypt::Password.create('secret'), role: :seller) }
  let!(:seller) { Seller.create!(name: 'Loja A', document: '52998224725', person_type: :person, user: seller_user) }
  let!(:user) { seller_user }

  it 'lists and shows sellers (basic smoke)' do
    headers = auth_headers_for(user)

    get '/sellers', headers: headers
    expect(response).to have_http_status(:ok)

    get "/sellers/#{seller.id}", headers: headers
    expect(response).to have_http_status(:ok)
  end
end
