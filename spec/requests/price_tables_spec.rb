require 'rails_helper'
require 'support/api_auth_helper'

RSpec.describe 'PriceTables API', type: :request do
  include ApiAuthHelper

  let!(:seller_user) { User.create!(email: 'email@email.com', password_digest: BCrypt::Password.create('secret'), role: :seller) }
  let!(:seller) { Seller.create!(name: 'Loja A', document: '52998224725', person_type: :person, user: seller_user) }
  let!(:user) { seller_user }

  it 'creates, lists, shows, updates, and deletes a price table' do
    headers = auth_headers_for(user)

    # create
    post '/price_tables', params: { price_table: { description: 'Tabela 1', price_table_items_attributes: [ { code: "code", description: "description" } ] } }.to_json, headers: headers
    expect(response).to have_http_status(:created)
    pt_json = JSON.parse(response.body)
    id = pt_json['id']

    # index
    get '/price_tables', headers: headers
    expect(response).to have_http_status(:ok)

    # show
    get "/price_tables/#{id}", headers: headers
    expect(response).to have_http_status(:ok)

    # update
    patch "/price_tables/#{id}", params: { price_table: { description: 'Tabela 1 Edit' } }.to_json, headers: headers
    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)['description']).to eq('Tabela 1 Edit')

    # delete
    delete "/price_tables/#{id}", headers: headers
    expect(response).to have_http_status(:no_content).or have_http_status(:ok)
  end
end
