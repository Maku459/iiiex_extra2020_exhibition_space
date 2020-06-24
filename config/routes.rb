Rails.application.routes.draw do
  resources :users
  resources :userpositions
  get 'space/index'
  get 'space/feedback1'

  root 'space#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
