import React, { useState } from 'react'

export default function EmployeeForm({ onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [formData, setFormData] = useState({
    full_name: '',
    job_title: '',
    country: '',
    salary: '',
    job_level: '',
    department: '',
    start_date: '',
    employee_id: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)

    try {
      const response = await fetch('/api/v1/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee: formData })
      })

      if (!response.ok) {
        const data = await response.json()
        setErrors(data.errors || ['Error creating employee'])
        return
      }

      setFormData({
        full_name: '',
        job_title: '',
        country: '',
        salary: '',
        job_level: '',
        department: '',
        start_date: '',
        employee_id: ''
      })
      onSuccess()
    } catch (error) {
      setErrors(['Network error'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded mb-6">
          {errors.map((err, idx) => (
            <p key={idx} className="text-red-600 text-sm">{err}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID"
            value={formData.employee_id}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="job_title"
            placeholder="Job Title"
            value={formData.job_title}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="job_level"
            placeholder="Job Level"
            value={formData.job_level}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Adding...' : 'Add Employee'}
        </button>
      </form>
    </div>
  )
}