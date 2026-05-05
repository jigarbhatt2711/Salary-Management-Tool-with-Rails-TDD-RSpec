# Salary Management Tool

## 🎯 Project Overview

A comprehensive salary management system built to demonstrate:

- **Full-stack development** with a Rails backend and React frontend
- **Test-Driven Development (TDD)** with RSpec
- **Production-quality code** with security best practices (Brakeman-compliant)
- **Performance optimization** for datasets of 10,000+ employees
- **Modern development practices** using esbuild, Tailwind CSS, and proper asset management

## 🌐 Live Application

**[http://13.233.184.60/](http://13.233.184.60/)**

**Target User:** HR managers overseeing large organizations

---

## ✨ Features

### Employee Management

- ✅ Add, view, update, and delete employees
- ✅ Search employees by name
- ✅ Filter employees by country
- ✅ Paginated employee list (50 per page)
- ✅ Rich employee data — name, job title, country, salary, department, job level, and start date

### Salary Insights Dashboard

- ✅ Global salary statistics (min, max, average)
- ✅ Employee count by location
- ✅ Salary distribution visualization
- ✅ Country-wise salary analytics
- ✅ Job title salary comparison
- ✅ Multi-country insights

### Performance

- ✅ Optimized batch insert for 10,000 employees (~2–3 seconds)
- ✅ Efficient database queries with proper indexing
- ✅ Paginated API responses
- ✅ Compiled assets for fast page loads

### Security & Quality

- ✅ Brakeman security scanning (zero warnings)
- ✅ CSRF protection with proper API configuration
- ✅ CORS enabled for safe cross-origin requests
- ✅ Input validation and error handling
- ✅ RSpec test coverage for core functionality

---

## 🛠 Tech Stack

### Backend

- **Rails 7.1.6** — Web framework
- **SQLite** — Primary database
- **Sprockets** — Asset pipeline
- **Kaminari** — Pagination
- **Rack CORS** — Cross-origin resource sharing

### Frontend

- **React 18.2** — UI library
- **esbuild** — JavaScript bundler
- **Tailwind CSS 3.3** — Utility-first CSS framework
- **React Hooks** — State management

### Development & Testing

- **RSpec** — BDD testing framework
- **FactoryBot** — Test data generation
- **Faker** — Realistic fake data generation
- **Shoulda-Matchers** — Concise model specs
- **WebMock** — HTTP request mocking

### DevOps & Security

- **Brakeman** — Rails security scanner
- **Bundler Audit** — Dependency vulnerability checker
- **RuboCop** — Ruby static code analyzer and formatter

---

## 📦 Prerequisites

Ensure the following are installed before you begin:

| Tool | Required Version |
|------|-----------------|
| Ruby | 3.2.2 |
| Node.js | 16+ |
| npm | 8+ |
| Rails | 7.2.3.1 |

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/jigarbhatt2711/Salary-Management-Tool-with-Rails-TDD-RSpec.git
cd Salary-Management-Tool-with-Rails-TDD-RSpec
```

### Step 2: Install Ruby Dependencies

```bash
bundle install
```

### Step 3: Install Node Dependencies

```bash
npm install
```

### Step 4: Set Up the Database

```bash
rails db:create
rails db:migrate
rails db:seed
```

### Step 5: Build Assets

```bash
npm run build:css
npm run build
```

---

## 🏃 Running the Application

### Quick Start (Recommended)

```bash
./bin/dev
```

This starts:

- Rails server on `http://localhost:3000`
- esbuild watcher
- Tailwind CSS watcher

### Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

---

## 📊 Database Seeding

### Seed 10,000 Employees

```bash
rails seed:employees
```

**Expected output:**

```
Seeding 10,000 employees...
✓ Seeded 10,000 employees in 2.45s
Average: 4081 employees/second
```

---

## 🧪 Running Tests

```bash
bundle exec rspec
```

---

## 📡 API Endpoints

**Base URL:** `http://13.233.184.60/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | List all employees (paginated) |
| GET | `/employees/:id` | Get a specific employee |
| POST | `/employees` | Create a new employee |
| PUT | `/employees/:id` | Update an employee |
| DELETE | `/employees/:id` | Delete an employee |
| GET | `/employees/salary_insights` | Global salary statistics |
| GET | `/employees/country_insights?country=US` | Country-specific statistics |
| GET | `/employees/job_title_insights?job_title=Engineer&country=US` | Job title statistics |

---

## 🚀 Deployment

This application is deployed on AWS EC2 and configured for production use.

### 🌐 Live Application

[http://13.233.184.60/](http://13.233.184.60/)

### ⚙️ Production Stack

| Layer | Technology |
|-------|-----------|
| Web server | Nginx |
| Application server | Puma |
| Hosting | AWS EC2 (Ubuntu) |
| Architecture | Reverse proxy (Nginx → Puma → Rails) |