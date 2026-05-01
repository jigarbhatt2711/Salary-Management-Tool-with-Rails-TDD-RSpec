Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :employees do
        collection do
          get 'salary_insights'
          get 'country_insights/:country', to: 'employees#country_insights', as: 'country_insights'
          get 'job_title_insights/:job_title/:country', to: 'employees#job_title_insights', as: 'job_title_insights'
        end
      end
    end
  end

  root 'pages#index'
  get '*path', to: 'pages#index'
end
