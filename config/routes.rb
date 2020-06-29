Rails.application.routes.draw do
  resources :souvenirs
  # dailyco
  get 'admins/dailyco'

  # database
  resources :logins
  resources :userpositions
  resources :users

  # space
  get 'space/index'
  get 'works/:name', to: 'space#works'

  root 'space#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
