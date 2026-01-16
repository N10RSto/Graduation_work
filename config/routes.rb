Rails.application.routes.draw do
  get "users/new"
  get "users/create"
  get "sessions/new"
  get "sessions/create"
  get "sessions/destroy"
  get "main/index"
  root "main#index"
  get "/image/download", to: "images#download"
  get "/signup", to: "users#new"
  post "/signup", to: "users#create"
  get "/mypage", to: "users#mypage"
  get "/login", to: "sessions#new"
  post "/login", to: "sessions#create"
  delete "/logout", to: "sessions#destroy"

  get "up" => "rails/health#show", as: :rails_health_check

  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  resources :icons, only: [:create, :destroy, :show]
end
