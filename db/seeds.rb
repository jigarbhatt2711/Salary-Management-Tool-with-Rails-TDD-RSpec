# frozen_string_literal: true

require 'csv'

Employee.delete_all

puts 'Seeding 10,000 employees...'
start_time = Time.zone.now

# Load names from external files
first_names_file = Rails.root.join('db/seeds/first_names.txt')
last_names_file  = Rails.root.join('db/seeds/last_names.txt')

first_names = File.readlines(first_names_file).map(&:strip).reject(&:empty?)
last_names = File.readlines(last_names_file).map(&:strip).reject(&:empty?)

puts "Loaded #{first_names.count} first names and #{last_names.count} last names"

job_titles = ['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst', 'DevOps Engineer', 'Manager',
              'Director', 'Consultant']
countries = %w[US UK CA AU DE FR JP IN]
departments = %w[Engineering Product Design Data HR Finance Sales Operations]
job_levels = %w[Junior Mid Senior Lead Principal]

employees_data = (1..10_000).map do |_i|
  {
    full_name: "#{first_names.sample} #{last_names.sample}",
    job_title: job_titles.sample,
    country: countries.sample,
    salary: rand(50_000..250_000),
    job_level: job_levels.sample,
    department: departments.sample,
    start_date: Time.zone.today - rand(1..365).days,
    employee_id: SecureRandom.uuid,
    created_at: Time.current,
    updated_at: Time.current
  }
end

# Use batch insert for performance
Employee.insert_all(employees_data)

elapsed_time = Time.zone.now - start_time
puts "✓ Seeded 10,000 employees in #{elapsed_time.round(2)}s"
puts "Average: #{(10_000 / elapsed_time).round(0)} employees/second"
