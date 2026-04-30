class SalaryInsightsService
  def initialize
    @employees = Employee.all
  end

  def global_insights
    {
      total_employees: @employees.count,
      min_salary: @employees.minimum(:salary).to_f,
      max_salary: @employees.maximum(:salary).to_f,
      avg_salary: (@employees.average(:salary).to_f || 0).round(2),
      countries: @employees.distinct.pluck(:country).count,
      job_titles: @employees.distinct.pluck(:job_title).count
    }
  end

  def country_insights(country)
    employees = @employees.where(country: country)
    {
      country: country,
      total_employees: employees.count,
      min_salary: employees.minimum(:salary),
      max_salary: employees.maximum(:salary),
      avg_salary: (employees.average(:salary) || 0).round(2),
      top_job_titles: top_job_titles(employees)
    }
  end

  def job_title_insights(job_title, country)
    employees = @employees.where(job_title: job_title, country: country)
    {
      job_title: job_title,
      country: country,
      total_employees: employees.count,
      min_salary: employees.minimum(:salary),
      max_salary: employees.maximum(:salary),
      avg_salary: (employees.average(:salary) || 0).round(2)
    }
  end

  private

  def top_job_titles(employees)
    employees.group(:job_title)
             .select('job_title, AVG(salary) as avg_salary, COUNT(*) as count')
             .order('avg_salary DESC')
             .limit(5)
             .map { |e| { job_title: e.job_title, avg_salary: e.avg_salary.round(2), count: e.count } }
  end
end