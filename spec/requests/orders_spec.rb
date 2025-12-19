require 'rails_helper'
require 'support/api_auth_helper'

RSpec.describe 'Orders API', type: :request do
  include ApiAuthHelper

  let!(:seller_user) { User.create!(username: 'seller1', password_digest: BCrypt::Password.create('secret'), role: :seller) }
  let!(:seller) { Seller.create!(name: 'Loja A', document: '52998224725', person_type: :person, user: seller_user) }
  let!(:user) { seller_user }
  let!(:item) do
    it = Item.new(code: 'ITM-1', description: 'Item 1', base_price: 10.0, observation: 'Obs', active: true, seller: seller)
    it.main_image.attach(io: StringIO.new("fake"), filename: 'sample.png', content_type: 'image/png')
    it.save!
    it
  end
  let!(:customer_user) { User.create!(username: 'cliente1', password_digest: BCrypt::Password.create('pass123'), role: :customer) }
  let!(:customer) { Customer.create!(name: 'Cliente 1', document: '12345678901', phone: '11999999999', email: 'c1@example.com', person_type: 'individual', active: true, user: customer_user, seller: seller) }

  it 'creates, lists, shows, updates, and deletes an order' do
    headers = auth_headers_for(user)

    # create
    post '/orders', params: {
      order: {
        observation: 'Pedido inicial',
        status: 'pending',
        customer_id: customer.id,
        order_items_attributes: [ { item_id: item.id, quantity: 2 } ]
      }
    }.to_json, headers: headers

    expect(response).to have_http_status(:created)
    order_json = JSON.parse(response.body)
    id = order_json['id']

    # index
    get '/orders', headers: headers
    expect(response).to have_http_status(:ok)
    list_json = JSON.parse(response.body)
    expect(list_json.map { |o| o['id'] }).to include(id)

    # show
    get "/orders/#{id}", headers: headers
    expect(response).to have_http_status(:ok)

    # update
    patch "/orders/#{id}", params: { order: { observation: 'Pedido editado' } }.to_json, headers: headers
    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)['observation']).to eq('Pedido editado')

    # delete
    delete "/orders/#{id}", headers: headers
    expect(response).to have_http_status(:no_content).or have_http_status(:ok)
  end
end
