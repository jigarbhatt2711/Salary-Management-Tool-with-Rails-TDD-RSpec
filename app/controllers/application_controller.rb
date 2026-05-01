class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  
  def render_json(data, status = :ok)
    render json: data, status: status
  end

  private

  def record_not_found
    render json: { error: 'Not found' }, status: :not_found
  end
end