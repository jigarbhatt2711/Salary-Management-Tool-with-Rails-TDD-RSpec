import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EmployeeList({ refresh }) {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [countries, setCountries] = useState([])
  const [error, setError] = useState(null)
  const searchTimeoutRef = useRef(null)

  // Fetch employees whenever page, search, or filter changes
  useEffect(() => {
    fetchEmployees()
  }, [page, search, filterCountry, refresh])

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('page', page)
      if (search.trim()) params.append('search', search.trim())
      if (filterCountry) params.append('country', filterCountry)

      const url = `/api/v1/employees?${params}`
      console.log('Fetching:', url)

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response:', data)

      setEmployees(data.data || [])

      if (data.pagination) {
        setTotalCount(data.pagination.total || 0)
        setTotalPages(data.pagination.total_pages || 1)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      setError('Failed to load employees. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/v1/employees')
      if (!response.ok) throw new Error('Failed to fetch countries')

      const data = await response.json()
      const uniqueCountries = [...new Set((data.data || []).map(e => e.country))].sort()
      setCountries(uniqueCountries)
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }

  // Handle search input with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)
    setPage(1) // Reset to page 1 when searching

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
  }

  // Handle country filter change
  const handleCountryChange = (e) => {
    setFilterCountry(e.target.value)
    setPage(1) // Reset to page 1 when filtering
  }

  const deleteEmployee = async (id, e) => {
    e.stopPropagation() // Prevent navigation when clicking delete
    
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`/api/v1/employees/${id}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete')

        // Refresh the list
        fetchEmployees()
      } catch (error) {
        console.error('Error deleting:', error)
        alert('Failed to delete employee')
      }
    }
  }

  const handleRowClick = (employeeId) => {
    navigate(`/employees/${employeeId}`)
  }

  if (loading && employees.length === 0) {
    return <div className="text-center py-8 text-lg">Loading employees...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchEmployees()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex gap-4 flex-wrap bg-white p-4 rounded-lg border">
        <div className="flex-1 min-w-60">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by Name
          </label>
          <input
            type="text"
            placeholder="e.g., John Doe..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Country
          </label>
          <select
            value={filterCountry}
            onChange={handleCountryChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Countries</option>
            {countries.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Count Info */}
      <div className="bg-gray-50 p-3 rounded-lg border text-sm text-gray-600">
        Found <span className="font-bold text-gray-900">{totalCount.toLocaleString()}</span> employees
        {(search || filterCountry) && (
          <span>
            {' '}(filtered
            {search && ` by name "${search}"`}
            {search && filterCountry && ' and '}
            {filterCountry && ` by country "${filterCountry}"`})
          </span>
        )}
      </div>

      {/* Table */}
      {employees.length > 0 ? (
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
                <tr
                  key={emp.id}
                  onClick={() => handleRowClick(emp.id)}
                  className="border-b hover:bg-blue-50 cursor-pointer transition"
                >
                  <td className="px-4 py-3 text-sm font-medium">{emp.full_name}</td>
                  <td className="px-4 py-3 text-sm">{emp.job_title}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {emp.country}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">
                    ${emp.salary.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">{emp.department}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={(e) => deleteEmployee(emp.id, e)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
          <p className="text-yellow-700 font-medium">No employees found</p>
          {(search || filterCountry) && (
            <p className="text-yellow-600 text-sm mt-1">
              Try adjusting your search or filter criteria
            </p>
          )}
        </div>
      )}

      {/* Pagination Info */}
      {employees.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold">50 employees per page</span>
              </p>
              <p className="text-lg font-bold text-blue-600 mt-1">
                Page <span className="text-2xl">{page}</span> of{' '}
                <span className="text-2xl">{totalPages}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Total Employees: <span className="font-bold">{totalCount.toLocaleString()}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-6 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 font-medium transition"
              >
                ← Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-6 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 font-medium transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation */}
      {totalPages > 1 && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-700 mb-3">Jump to Page:</p>
          <div className="flex gap-2 flex-wrap">
            {[1, 25, 50, 100, 150, 200].map(pageNum => (
              pageNum <= totalPages && (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  )
}