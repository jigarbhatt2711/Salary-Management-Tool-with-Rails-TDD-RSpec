import React, { useState, useEffect } from 'react'

export default function SalaryDashboard({ refresh }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('US')

  useEffect(() => {
    fetchInsights()
  }, [refresh])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/employees/salary_insights')
      const data = await response.json()
      setInsights(data)
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (!insights) return <div className="text-center py-8">No data available</div>

  const cards = [
    {
      title: 'Total Employees',
      value: (insights.total_employees && insights.total_employees.toLocaleString()) || '0',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-600',
      icon: '👥'
    },
    {
      title: 'Average Salary',
      value: `$${(insights.avg_salary || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-600',
      icon: '💵'
    },
    {
      title: 'Min Salary',
      value: `$${(insights.min_salary || 0).toLocaleString()}`,
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-600',
      icon: '📉'
    },
    {
      title: 'Max Salary',
      value: `$${(insights.max_salary || 0).toLocaleString()}`,
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-600',
      icon: '📈'
    },
    {
      title: 'Countries',
      value: insights.countries || '0',
      color: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-600',
      icon: '🌍'
    },
    {
      title: 'Job Titles',
      value: insights.job_titles || '0',
      color: 'bg-pink-50 border-pink-200',
      textColor: 'text-pink-600',
      icon: '💼'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className={`${card.color} p-6 rounded-lg border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className={`text-3xl font-bold ${card.textColor} mt-2`}>{card.value}</p>
              </div>
              <span className="text-4xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {insights.salary_distribution && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4">Salary Distribution</h3>
          <div className="space-y-4">
            {insights.salary_distribution.map((dist, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{dist.range}</span>
                  <span className="text-sm text-gray-600">{dist.count} employees</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(dist.count / insights.total_employees) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}