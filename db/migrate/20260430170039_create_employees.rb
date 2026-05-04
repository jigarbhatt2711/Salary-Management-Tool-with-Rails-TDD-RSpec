# frozen_string_literal: true

class CreateEmployees < ActiveRecord::Migration[7.2]
  def change
    create_table :employees do |t|
      t.string :full_name
      t.string :job_title
      t.string :country
      t.decimal :salary
      t.string :job_level
      t.string :department
      t.date :start_date
      t.string :employee_id

      t.timestamps
    end
  end
end
