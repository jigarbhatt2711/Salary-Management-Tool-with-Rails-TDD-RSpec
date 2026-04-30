class PagesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:index]

  def index
    render :index
  end
end
