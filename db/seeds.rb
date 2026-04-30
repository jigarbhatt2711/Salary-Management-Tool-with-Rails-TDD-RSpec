require 'csv'

Employee.delete_all

puts "Seeding 10,000 employees..."
start_time = Time.now

# Predefined lists for consistent seeding
first_names = %w[John Jane Michael Sarah Robert Emily David Jessica James Jennifer]
last_names = %w[Smith Johnson Brown Davis Wilson Martinez Rodriguez Taylor Anderson Taylor]

job_titles = ['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst', 'DevOps Engineer', 'Manager', 'Director', 'Consultant']
countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN']
departments = ['Engineering', 'Product', 'Design', 'Data', 'HR', 'Finance', 'Sales', 'Operations']
job_levels = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal']

employees_data = (1..10000).map do |i|
  {
    full_name: "#{first_names.sample} #{last_names.sample}",
    job_title: job_titles.sample,
    country: countries.sample,
    salary: rand(50000..250000),
    job_level: job_levels.sample,
    department: departments.sample,
    start_date: Date.today - rand(1..365).days,
    employee_id: SecureRandom.uuid,
    created_at: Time.current,
    updated_at: Time.current
  }
end

# Use batch insert for performance
Employee.insert_all(employees_data)

elapsed_time = Time.now - start_time
puts "✓ Seeded 10,000 employees in #{elapsed_time.round(2)}s"
puts "Average: #{(10000 / elapsed_time).round(0)} employees/second"
