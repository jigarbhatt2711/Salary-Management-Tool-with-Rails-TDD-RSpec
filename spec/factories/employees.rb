FactoryBot.define do
  factory :employee do
    full_name { Faker::Name.name }
    job_title { ['Engineer', 'Manager', 'Designer', 'Analyst'].sample }
    country { ['US', 'UK', 'CA', 'AU'].sample }
    salary { Faker::Number.between(from: 50000, to: 200000) }
    job_level { ['Junior', 'Mid', 'Senior', 'Lead'].sample }
    department { ['Engineering', 'HR', 'Finance', 'Sales'].sample }
    start_date { Faker::Date.backward(days: 365) }
    employee_id { SecureRandom.uuid }
  end
end