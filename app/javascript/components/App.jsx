import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import EmployeeList from './EmployeeList'
import EmployeeDetail from './EmployeeDetail'
import SalaryDashboard from './SalaryDashboard'
import EmployeeForm from './EmployeeForm'

function AppContent() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [refresh, setRefresh] = useState(0)

  const handleRefresh = () => setRefresh(r => r + 1)

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">💰 Salary Management System</h1>
          <p className="text-gray-600 mt-1">Manage 10,000+ employees with ease</p>
        </div>
      </header>

      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => handleTabClick('employees')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'employees'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            👥 Employees
          </button>
          <button
            onClick={() => handleTabClick('add')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'add'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            ➕ Add Employee
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={
              activeTab === 'dashboard' ? (
                <SalaryDashboard refresh={refresh} />
              ) : activeTab === 'employees' ? (
                <EmployeeList refresh={refresh} />
              ) : (
                <EmployeeForm onSuccess={() => { setActiveTab('employees'); handleRefresh() }} />
              )
            }
          />
          <Route path="/employees" element={<EmployeeList refresh={refresh} />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route
            path="/"
            element={
              activeTab === 'add' ? (
                <EmployeeForm onSuccess={() => { setActiveTab('employees'); handleRefresh() }} />
              ) : null
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}