import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchEmployee()
  }, [id])

  const fetchEmployee = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/v1/employees/${id}`)
      if (!response.ok) throw new Error('Failed to load employee')
      const data = await response.json()
      setEmployee(data)
      setFormData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/v1/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee: formData })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.errors?.join(', ') || 'Failed to update')
      }

      const updatedData = await response.json()
      setEmployee(updatedData)
      setFormData(updatedData)
      setIsEditing(false)
      alert('Employee updated successfully!')
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = () => {
    setFormData(employee)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/v1/employees/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete employee')

      alert('Employee deleted successfully!')
      navigate('/employees')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employee details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h3 className="text-red-800 font-bold mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/employees')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Back to Employees
          </button>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-700">Employee not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{employee.full_name}</h1>
          <p className="text-gray-600 mt-1">{employee.job_title}</p>
        </div>
        <button
          onClick={() => navigate('/employees')}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-medium"
        >
          ← Back
        </button>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* View Mode */}
      {!isEditing ? (
        <div className="space-y-6">
          {/* Employee Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{employee.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Employee ID</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{employee.employee_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Job Title</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{employee.job_title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Job Level</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {employee.job_level || 'N/A'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Work Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Country</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {employee.country}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Department</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{employee.department || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Start Date</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {new Date(employee.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Salary</label>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    ${parseInt(employee.salary).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              ✏️ Edit Employee
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
            >
              🗑️ Delete Employee
            </button>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Employee</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id || ''}
                onChange={handleChange}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Level</label>
              <select
                name="job_level"
                value={formData.job_level || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Level</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Principal">Principal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={updating}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition"
            >
              {updating ? 'Saving...' : '✓ Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={updating}
              className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50 font-medium transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}