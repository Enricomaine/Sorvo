require 'rails_helper'
require 'support/api_auth_helper'

RSpec.describe 'Items API', type: :request do
  include ApiAuthHelper

  let!(:seller_user) { User.create!(username: 'seller1', password_digest: BCrypt::Password.create('secret'), role: :seller) }
  let!(:seller) { Seller.create!(name: 'Loja A', document: '52998224725', person_type: :person, user: seller_user) }
  let!(:user) { seller_user }

  it 'creates, lists, shows, updates, and deletes an item' do
    headers = auth_headers_for(user)

  # create
  file = fixture_file_upload(Rails.root.join('spec/fixtures/files/sample.png'), 'image/png')
  form_headers = headers.except('Content-Type', 'CONTENT_TYPE')

  post '/items',
    params: {
      item: {
        code: 'ITM-1',
        description: 'Item 1',
        observation: 'Obs',
        base_price: 10.5,
        active: true,
        main_image: file
      }
    },
    headers: form_headers,
    as: :multipart

    expect(response).to have_http_status(:created)
    item_json = JSON.parse(response.body)
    id = item_json['id']

    # index
    get '/items', headers: headers
    expect(response).to have_http_status(:ok)
    list_json = JSON.parse(response.body)
    expect(list_json.map { |i| i['id'] }).to include(id)

    # show
    get "/items/#{id}", headers: headers
    expect(response).to have_http_status(:ok)

    # update
    patch "/items/#{id}", params: { item: { description: 'Item 1 Edit' } }.to_json, headers: headers
    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)['description']).to eq('Item 1 Edit')

    # delete
    delete "/items/#{id}", headers: headers
    expect(response).to have_http_status(:no_content).or have_http_status(:ok)
  end
end
