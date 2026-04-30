require 'rails_helper'

RSpec.describe Employee, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence_of(:full_name) }
    it { is_expected.to validate_presence_of(:job_title) }
    it { is_expected.to validate_presence_of(:country) }
    it { is_expected.to validate_presence_of(:salary) }
    it { is_expected.to validate_presence_of(:employee_id) }
    it { is_expected.to validate_uniqueness_of(:employee_id) }
    it { is_expected.to validate_numericality_of(:salary).is_greater_than_or_equal_to(0) }
  end

  describe 'scopes' do
    let!(:employee_us) { create(:employee, country: 'US', job_title: 'Engineer') }
    let!(:employee_uk) { create(:employee, country: 'UK', job_title: 'Manager') }

    context 'by_country' do
      it 'filters employees by country' do
        expect(Employee.by_country('US')).to include(employee_us)
        expect(Employee.by_country('US')).not_to include(employee_uk)
      end
    end

    context 'by_job_title' do
      it 'filters employees by job title' do
        expect(Employee.by_job_title('Engineer')).to include(employee_us)
        expect(Employee.by_job_title('Engineer')).not_to include(employee_uk)
      end
    end
  end

  describe '.stats' do
    before do
      create(:employee, salary: 50000)
      create(:employee, salary: 100000)
      create(:employee, salary: 150000)
    end

    it 'calculates correct salary statistics' do
      stats = Employee.stats
      expect(stats[:min_salary]).to eq(50000)
      expect(stats[:max_salary]).to eq(150000)
      expect(stats[:avg_salary]).to eq(100000.0)
      expect(stats[:count]).to eq(3)
    end
  end
end
