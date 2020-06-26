Rails.application.routes.draw do
  get 'admins/dailyco'
  resources :userpositions
  resources :users
  get 'space/index'
  get 'works/:name', to: 'space#works'

  root 'space#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
