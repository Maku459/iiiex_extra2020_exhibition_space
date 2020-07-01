Rails.application.routes.draw do

  # dailyco
  get 'admins/dailyco'

  # database
  resources :souvenirs
  resources :logins
  resources :userpositions
  resources :users

  # space
  get 'space/index'

  # works
  get 'works/list'
  get 'works/:name', to: 'works#pages'

  root 'space#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
