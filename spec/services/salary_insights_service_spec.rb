# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SalaryInsightsService, type: :service do
  let(:service) { described_class.new }

  describe '#global_insights' do
    before do
      create(:employee, country: 'US', salary: 50_000)
      create(:employee, country: 'UK', salary: 60_000)
      create(:employee, country: 'US', salary: 100_000)
    end

    it 'returns global salary insights' do
      insights = service.global_insights
      expect(insights[:total_employees]).to eq(3)
      expect(insights[:min_salary]).to eq(50_000)
      expect(insights[:max_salary]).to eq(100_000)
      expect(insights[:avg_salary]).to eq(70_000.0)
      expect(insights[:countries]).to eq(2)
    end
  end

  describe '#country_insights' do
    before do
      create(:employee, country: 'US', salary: 50_000, job_title: 'Engineer')
      create(:employee, country: 'US', salary: 100_000, job_title: 'Manager')
      create(:employee, country: 'UK', salary: 60_000)
    end

    it 'returns insights for a specific country' do
      insights = service.country_insights('US')
      expect(insights[:country]).to eq('US')
      expect(insights[:total_employees]).to eq(2)
      expect(insights[:min_salary]).to eq(50_000)
      expect(insights[:max_salary]).to eq(100_000)
      expect(insights[:avg_salary]).to eq(75_000.0)
    end
  end

  describe '#job_title_insights' do
    before do
      create(:employee, country: 'US', job_title: 'Engineer', salary: 80_000)
      create(:employee, country: 'US', job_title: 'Engineer', salary: 100_000)
      create(:employee, country: 'US', job_title: 'Manager', salary: 120_000)
    end

    it 'returns insights for a specific job title and country' do
      insights = service.job_title_insights('Engineer', 'US')
      expect(insights[:job_title]).to eq('Engineer')
      expect(insights[:country]).to eq('US')
      expect(insights[:total_employees]).to eq(2)
      expect(insights[:min_salary]).to eq(80_000)
      expect(insights[:avg_salary]).to eq(90_000.0)
    end
  end
end
