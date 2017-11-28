Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  
  root to: 'dashboard#index'
  get 'fetch_tweets', to: 'dashboard#fetch_tweets'
  get 'fetch_search_history', to: 'dashboard#fetch_search_history'
end
