Rails.application.routes.draw do
  # dailyco
  get 'admins/dailyco'

  # database
  resources :souvenirs
  resources :logins
  resources :userpositions do
    collection do 
      get 'regularly_delete'
    end
  end
  resources :users

  # space
  get 'space/index'
  get 'works/:name', to: 'space#works'

  root 'space#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
