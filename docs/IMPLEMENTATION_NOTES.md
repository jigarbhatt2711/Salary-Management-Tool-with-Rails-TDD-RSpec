# Implementation Notes for Salary Management Tool

## Overview
This document outlines the detailed implementation notes and key decisions made during the development of the Salary Management Tool using Rails, TDD, and RSpec.

## Key Decisions
1. **Technology Stack**:
   - Chose Rails for rapid development and flexibility in implementing features.
   - Utilized TDD to ensure code reliability and reduce future bugs.
   - Selected RSpec as the testing framework for its readability and community support.

2. **Database Design**:
   - Used SQLite for the database due to its support for advanced features.
   - Chose a normalized database schema to minimize redundancy and improve data integrity.

3. **Feature Implementations**:

	#### Employee Management
	- Features to add, update, and delete employee records.
	- Employee details include name, role, department, and salary information.

	#### Salary Insights
	- Calculations for average salary.
	- Reports generated for salary distribution and trends over time.

	#### API Endpoints
    | Method | Endpoint | Description |
    |--------|----------|-------------|
    | GET | `/employees` | List all employees (paginated) |
    | GET | `/employees/:id` | Get a specific employee |
    | POST | `/employees` | Create a new employee |
    | PUT | `/employees/:id` | Update an employee |
    | DELETE | `/employees/:id` | Delete an employee |
    | GET | `/employees/salary_insights` | Global salary statistics |
    | GET | `/employees/country_insights?country=US` | Country-specific stats |
    | GET | `/employees/job_title_insights?job_title=Engineer&country=US` | Job title stats |


	#### Database Structure
	- Employees table with columns: `id`, `full_name`, `job_title`, `department`, `salary`, `country`, `job_level`, `start_date`, `employee_id`, `created_at`, `updated_at`.

	#### Architectural Decisions
	- Implemented using Rails with TDD approach, ensuring that features work as intended before development.
	- Utilized RSpec for testing, promoting code reliability and maintainability.

4. **Testing Strategy**:
   - Developed unit tests for models to ensure business logic correctness.
   - Created feature tests to validate user interactions with the web application.

5. **Deployment**:
   - Decided to deploy using AWS for simplicity and quick scaling as the user base grows.
   - Utilized GitHub Actions for CI/CD to automate testing and deployment processes.
