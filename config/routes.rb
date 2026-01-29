Rails.application.routes.draw do
  scope :api do 
    scope :v1 do
      resources :customers
      resources :items
      resources :orders
      resources :sellers
      resources :price_tables

      post "login", to: "login#login"
      delete "logout", to: "login#logout"

      post "password/forgot", to: "password#forgot"
      post "password/reset", to: "password#reset"

      delete "/items/:id/images/:image_id", to: "items#remove_image"

      # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

      post 'whatsapp/send_batch', to: 'whatsapp#send_batch'
      
      # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
      # Can be used by load balancers and uptime monitors to verify that the app is live.
      get "up" => "rails/health#show", as: :rails_health_check
      
      # Defines the root path route ("/")
      # root "posts#index"
    end
  end
end
