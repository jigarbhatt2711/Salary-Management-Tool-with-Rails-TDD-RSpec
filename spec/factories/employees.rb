# frozen_string_literal: true

FactoryBot.define do
  factory :employee do
    full_name { Faker::Name.name }
    job_title { %w[Engineer Manager Designer Analyst].sample }
    country { %w[US UK CA AU].sample }
    salary { Faker::Number.between(from: 50_000, to: 200_000) }
    job_level { %w[Junior Mid Senior Lead].sample }
    department { %w[Engineering HR Finance Sales].sample }
    start_date { Faker::Date.backward(days: 365) }
    employee_id { SecureRandom.uuid }
  end
end
