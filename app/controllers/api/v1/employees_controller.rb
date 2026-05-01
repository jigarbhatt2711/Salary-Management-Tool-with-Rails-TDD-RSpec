# frozen_string_literal: true

module Api
  module V1
    # Handles employee-related API actions
    class EmployeesController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_employee, only: %i[show update destroy]

      def index
        @employees = Employee.order('created_at DESC')

        # Search by full_name (case-insensitive)
        if params[:search].present?
          search_term = params[:search].strip
          # SQLite LIKE is case-insensitive by default
          @employees = @employees.where('full_name LIKE ?', "%#{search_term}%")
        end

        # Filter by country
        @employees = @employees.where(country: params[:country]) if params[:country].present?

        # Paginate
        @employees = @employees.page(params[:page]).per(50)

        render json: {
          data: @employees,
          pagination: {
            page: @employees.current_page,
            per_page: 50,
            total: @employees.total_count,
            total_pages: @employees.total_pages
          }
        }
      end

      def show
        render json: @employee, status: :ok
      end

      def create
        @employee = Employee.new(employee_params)
        if @employee.save
          render json: @employee, status: :created
        else
          render json: { errors: @employee.errors.full_messages }, status: :unprocessable_content
        end
      end

      def update
        if @employee.update(employee_params)
          render json: @employee, status: :ok
        else
          render json: { errors: @employee.errors.full_messages }, status: :unprocessable_content
        end
      end

      def destroy
        if @employee.destroy
          head :no_content
        else
          render json: { errors: 'Failed to delete' }, status: :unprocessable_content
        end
      end

      def salary_insights
        service = SalaryInsightsService.new
        render json: service.global_insights
      end

      def country_insights
        service = SalaryInsightsService.new
        render json: service.country_insights(params[:country])
      end

      def job_title_insights
        service = SalaryInsightsService.new
        render json: service.job_title_insights(params[:job_title], params[:country])
      end

      private

      def set_employee
        @employee = Employee.find_by(id: params[:id])
        render json: { error: 'Employee not found' }, status: :not_found unless @employee
      end

      def employee_params
        params.require(:employee).permit(
          :full_name, :job_title, :country, :salary,
          :job_level, :department, :start_date, :employee_id
        )
      end
    end
  end
end
