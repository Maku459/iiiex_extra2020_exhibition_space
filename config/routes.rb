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

  # works
  get 'works/list'
  get 'works/:name', to: 'works#pages'

  # Slack
  post 'slack_notifications/submit'
  post 'slack_notifications/entered_page', format: 'json'
  post 'slack_notifications/daily_co_start', format: 'json'

  root 'space#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
