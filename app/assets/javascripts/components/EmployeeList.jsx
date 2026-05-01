import React, { useState, useEffect } from 'react'

export default function EmployeeList({ refresh }) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    fetchEmployees()
    fetchCountries()
  }, [page, search, filterCountry, refresh])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', page)
      if (search) params.append('search', search)
      if (filterCountry) params.append('country', filterCountry)

      const response = await fetch(`/api/v1/employees?${params}`)
      const data = await response.json()
      setEmployees(data.data || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/v1/employees')
      const data = await response.json()
      const uniqueCountries = [...new Set((data.data || []).map(e => e.country))]
      setCountries(uniqueCountries)
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }

  const deleteEmployee = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`/api/v1/employees/${id}`, { method: 'DELETE' })
        fetchEmployees()
      } catch (error) {
        console.error('Error deleting:', error)
      }
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="px-4 py-2 border rounded-lg flex-1 min-w-60"
        />
        <select
          value={filterCountry}
          onChange={(e) => { setFilterCountry(e.target.value); setPage(1) }}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Countries</option>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Job Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Country</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Salary</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Department</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{emp.full_name}</td>
                <td className="px-4 py-3 text-sm">{emp.job_title}</td>
                <td className="px-4 py-3 text-sm">{emp.country}</td>
                <td className="px-4 py-3 text-sm font-semibold">${emp.salary.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{emp.department}</td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  )
}