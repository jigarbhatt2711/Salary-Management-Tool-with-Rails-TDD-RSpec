# frozen_string_literal: true

class PagesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:index]
  before_action :set_format

  def index
    render :index
  end

  private

  def set_format
    request.format = :html
  end
end
