require 'rails_helper'
require 'support/api_auth_helper'

RSpec.describe 'Customers API', type: :request do
  include ApiAuthHelper

  let!(:seller_user) { User.create!(email: 'email3@email.com', password_digest: BCrypt::Password.create('secret'), role: :seller) }
  let!(:seller) { Seller.create!(name: 'Loja A', document: '52998224725', person_type: :person, user: seller_user) }
  let!(:user) { seller_user }

  describe 'CRUD' do
    it 'creates, lists, shows, updates, and deletes a customer' do
      headers = auth_headers_for(user)

      # create
      post '/customers', params: {
        customer: {
          name: 'Cliente 1',
          document: '77338697060',
          phone: '11999999999',
          person_type: 'person',
          active: true,
          user_attributes: {
            email: 'email@email.com',
            password: 'pass123'
          }
        }
      }.to_json, headers: headers

      expect(response).to have_http_status(:created)
      customer_json = JSON.parse(response.body)
      id = customer_json['id']

      # index
      get '/customers', headers: headers
      expect(response).to have_http_status(:ok)
      list_json = JSON.parse(response.body)
      expect(list_json).to be_an(Array)
      expect(list_json.map { |c| c['id'] }).to include(id)

      # show
      get "/customers/#{id}", headers: headers
      expect(response).to have_http_status(:ok)

      # update
      patch "/customers/#{id}", params: { customer: { name: 'Cliente 1 Edit' } }.to_json, headers: headers
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['name']).to eq('Cliente 1 Edit')

      # delete
      delete "/customers/#{id}", headers: headers
      expect(response).to have_http_status(:no_content).or have_http_status(:ok)
    end
  end
end
