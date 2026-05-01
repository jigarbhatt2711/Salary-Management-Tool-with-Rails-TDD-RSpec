module Api
  module V1
    class EmployeesController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_employee, only: [:show, :update, :destroy]

      def index
        @employees = Employee.order("created_at DESC").page(params[:page]).per(50)
        render json: @employees, status: :ok
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
        @employee.destroy
        render json: { message: 'Employee deleted successfully' }, status: :no_content
      end

      def salary_insights
        service = SalaryInsightsService.new
        insights = service.global_insights
        render json: insights, status: :ok
      end

      def country_insights
        service = SalaryInsightsService.new
        insights = service.country_insights(params[:country])
        render json: insights, status: :ok
      end

      def job_title_insights
        service = SalaryInsightsService.new
        insights = service.job_title_insights(params[:job_title], params[:country])
        render json: insights, status: :ok
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