# frozen_string_literal: true

class AddIndexToEmployeesEmployeeId < ActiveRecord::Migration[7.2]
  def change
    add_index :employees, :employee_id, unique: true
  end
end
