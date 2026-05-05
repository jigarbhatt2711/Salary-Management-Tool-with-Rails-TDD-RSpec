import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import EmployeeList from './EmployeeList'
import EmployeeDetail from './EmployeeDetail'
import SalaryDashboard from './SalaryDashboard'
import EmployeeForm from './EmployeeForm'
import Header from './Header'
import NavTabs from './NavTabs'

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
      <Header
        title="💰 Salary Management System"
        subtitle="Manage 10,000+ employees with ease"
      />

      <NavTabs activeTab={activeTab} onTabClick={handleTabClick} />

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