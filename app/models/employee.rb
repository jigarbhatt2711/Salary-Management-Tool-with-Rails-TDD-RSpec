# frozen_string_literal: true

class Employee < ApplicationRecord
  validates :full_name, :job_title, :country, :salary, presence: true
  validates :salary, numericality: { greater_than_or_equal_to: 0 }
  validates :employee_id, uniqueness: true, presence: true

  scope :by_country, ->(country) { where(country: country) }
  scope :by_job_title, ->(job_title) { where(job_title: job_title) }

  def self.salary_stats_by_country(country)
    by_country(country).stats
  end

  def self.salary_stats_by_job_title(job_title, country)
    by_country(country).by_job_title(job_title).stats
  end

  def self.stats
    {
      min_salary: minimum(:salary) || 0,
      max_salary: maximum(:salary) || 0,
      avg_salary: average(:salary)&.round(2) || 0,
      count: count
    }
  end
end
