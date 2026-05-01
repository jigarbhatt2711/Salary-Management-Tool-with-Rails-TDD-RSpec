# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::EmployeesController, type: :controller do
  describe 'GET #index' do
    before { create_list(:employee, 3) }

    it 'returns all employees' do
      get :index
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).length).to eq(3)
    end
  end

  describe 'GET #show' do
    let(:employee) { create(:employee) }

    it 'returns the employee' do
      get :show, params: { id: employee.id }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(employee.id)
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

    it 'returns validation errors' do
      post :create, params: { employee: { full_name: 'John' } }
      expect(response).to have_http_status(:unprocessable_content)
    end
  end

  describe 'PUT #update' do
    let(:employee) { create(:employee) }
    let(:update_params) do
      {
        id: employee.id,
        employee: { salary: 150_000 }
      }
    end

    it 'updates the employee' do
      put :update, params: update_params
      expect(response).to have_http_status(:ok)
      expect(employee.reload.salary).to eq(150_000)
    end
  end

  describe 'DELETE #destroy' do
    let!(:employee) { create(:employee) }

    it 'deletes the employee' do
      expect do
        delete :destroy, params: { id: employee.id }
      end.to change(Employee, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end

  describe 'GET #salary_insights' do
    before do
      create(:employee, salary: 50_000)
      create(:employee, salary: 100_000)
    end

    it 'returns global salary insights' do
      get :salary_insights
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data['total_employees']).to eq(2)
      expect(data['min_salary']).to eq(50_000)
    end
  end
end
