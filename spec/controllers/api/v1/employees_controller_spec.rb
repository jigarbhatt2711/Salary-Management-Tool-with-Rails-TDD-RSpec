# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::EmployeesController, type: :controller do
  describe 'GET #index' do
    it 'returns all employees' do
      create_list(:employee, 3)
      get :index
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data['data'].length).to eq(3)
      expect(data['pagination']['total']).to eq(3)
    end

    it 'returns employees with pagination' do
      create_list(:employee, 60) # Create more than 50
      get :index, params: { page: 1 }
      data = JSON.parse(response.body)

      expect(data['data'].length).to eq(50)
      expect(data['pagination']['page']).to eq(1)
      expect(data['pagination']['per_page']).to eq(50)
      expect(data['pagination']['total']).to eq(60)
      expect(data['pagination']['total_pages']).to eq(2)
    end

    it 'filters employees by search' do
      create(:employee, full_name: 'John Doe')
      create(:employee, full_name: 'Jane Smith')
      create(:employee, full_name: 'Bob Johnson')

      get :index, params: { search: 'John' }
      data = JSON.parse(response.body)

      expect(data['data'].length).to eq(2) # John Doe and Bob Johnson
      expect(data['pagination']['total']).to eq(2)
    end

    it 'filters employees by country' do
      create(:employee, country: 'US')
      create(:employee, country: 'UK')
      create(:employee, country: 'CA')

      get :index, params: { country: 'US' }
      data = JSON.parse(response.body)

      expect(data['data'].length).to eq(1)
      expect(data['data'][0]['country']).to eq('US')
    end

    it 'filters by search and country combined' do
      create(:employee, full_name: 'John Doe', country: 'US')
      create(:employee, full_name: 'John Smith', country: 'UK')
      create(:employee, full_name: 'Jane Doe', country: 'US')

      get :index, params: { search: 'John', country: 'US' }
      data = JSON.parse(response.body)

      expect(data['data'].length).to eq(1)
      expect(data['data'][0]['full_name']).to eq('John Doe')
      expect(data['data'][0]['country']).to eq('US')
    end

    it 'returns correct pagination structure' do
      create(:employee)
      get :index
      data = JSON.parse(response.body)

      expect(data).to have_key('data')
      expect(data).to have_key('pagination')
      expect(data['pagination']).to have_key('page')
      expect(data['pagination']).to have_key('per_page')
      expect(data['pagination']).to have_key('total')
      expect(data['pagination']).to have_key('total_pages')
    end
  end

  describe 'GET #show' do
    it 'returns the employee' do
      employee = create(:employee)
      get :show, params: { id: employee.id }
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data['id']).to eq(employee.id)
      expect(data['full_name']).to eq(employee.full_name)
    end

    it 'returns 404 for non-existent employee' do
      get :show, params: { id: 99_999 }
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST #create' do
    let(:valid_params) do
      {
        employee: {
          full_name: 'John Doe',
          job_title: 'Engineer',
          country: 'US',
          salary: 100_000,
          job_level: 'Senior',
          department: 'Engineering',
          start_date: '2026-05-01',
          employee_id: SecureRandom.uuid
        }
      }
    end

    it 'creates a new employee' do
      expect do
        post :create, params: valid_params
      end.to change(Employee, :count).by(1)
      expect(response).to have_http_status(:created)
    end

    it 'returns the created employee' do
      post :create, params: valid_params
      data = JSON.parse(response.body)
      expect(data['full_name']).to eq('John Doe')
      expect(data['country']).to eq('US')
      # Salary is returned as string "100000.0" due to JSON serialization
      expect(data['salary'].to_f).to eq(100_000.0)
    end

    it 'returns validation errors for missing required fields' do
      invalid_params = {
        employee: {
          full_name: 'John Doe'
          # Missing job_title, country, salary, employee_id
        }
      }
      post :create, params: invalid_params
      expect(response).to have_http_status(:unprocessable_content)
      data = JSON.parse(response.body)
      expect(data).to have_key('errors')
      expect(data['errors']).not_to be_empty
    end

    it 'returns validation errors for duplicate employee_id' do
      existing = create(:employee)
      duplicate_params = {
        employee: {
          full_name: 'Jane Doe',
          job_title: 'Manager',
          country: 'UK',
          salary: 120_000,
          employee_id: existing.employee_id
        }
      }
      post :create, params: duplicate_params
      expect(response).to have_http_status(:unprocessable_content)
    end

    it 'returns validation errors for negative salary' do
      invalid_params = {
        employee: {
          full_name: 'Jane Doe',
          job_title: 'Manager',
          country: 'UK',
          salary: -1000,
          employee_id: SecureRandom.uuid
        }
      }
      post :create, params: invalid_params
      expect(response).to have_http_status(:unprocessable_content)
    end
  end

  describe 'PUT #update' do
    it 'updates the employee' do
      employee = create(:employee)
      put :update, params: {
        id: employee.id,
        employee: { salary: 150_000 }
      }
      expect(response).to have_http_status(:ok)
      expect(employee.reload.salary).to eq(150_000)
    end

    it 'returns the updated employee' do
      employee = create(:employee)
      put :update, params: {
        id: employee.id,
        employee: { full_name: 'Updated Name', salary: 150_000 }
      }
      data = JSON.parse(response.body)
      expect(data['full_name']).to eq('Updated Name')
      # Salary is returned as string "150000.0" due to JSON serialization
      expect(data['salary'].to_f).to eq(150_000.0)
    end

    it 'returns validation errors for invalid data' do
      employee = create(:employee)
      put :update, params: {
        id: employee.id,
        employee: { salary: -1000 }
      }
      expect(response).to have_http_status(:unprocessable_content)
    end

    it 'returns 404 for non-existent employee' do
      put :update, params: {
        id: 99_999,
        employee: { salary: 150_000 }
      }
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE #destroy' do
    it 'deletes the employee' do
      employee = create(:employee)
      expect do
        delete :destroy, params: { id: employee.id }
      end.to change(Employee, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end

    it 'returns 404 for non-existent employee' do
      delete :destroy, params: { id: 99_999 }
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'GET #salary_insights' do
    it 'returns global salary insights' do
      create(:employee, salary: 50_000)
      create(:employee, salary: 100_000)
      create(:employee, salary: 150_000)

      get :salary_insights
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)

      expect(data).to have_key('total_employees')
      expect(data).to have_key('min_salary')
      expect(data).to have_key('max_salary')
      expect(data).to have_key('avg_salary')
      expect(data['total_employees']).to eq(3)
      expect(data['min_salary']).to eq(50_000)
      expect(data['max_salary']).to eq(150_000)
    end
  end

  describe 'GET #country_insights' do
    it 'returns country-specific salary insights' do
      create(:employee, country: 'US', salary: 100_000)
      create(:employee, country: 'US', salary: 120_000)
      create(:employee, country: 'UK', salary: 80_000)

      get :country_insights, params: { country: 'US' }
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)

      expect(data['country']).to eq('US')
      expect(data['total_employees']).to eq(2)
      expect(data['min_salary'].to_f).to eq(100_000.0)

      # Max salary is returned as string due to JSON serialization
      expect(data['max_salary'].to_f).to eq(120_000.0)
    end
  end

  describe 'GET #job_title_insights' do
    it 'returns job title and country-specific salary insights' do
      create(:employee, job_title: 'Engineer', country: 'US', salary: 100_000)
      create(:employee, job_title: 'Engineer', country: 'US', salary: 120_000)
      create(:employee, job_title: 'Manager', country: 'US', salary: 150_000)

      get :job_title_insights, params: { job_title: 'Engineer', country: 'US' }
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)

      expect(data['job_title']).to eq('Engineer')
      expect(data['country']).to eq('US')
      expect(data['total_employees']).to eq(2)
    end
  end
end
