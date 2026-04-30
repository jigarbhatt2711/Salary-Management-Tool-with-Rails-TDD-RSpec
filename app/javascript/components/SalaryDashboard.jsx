import React, { useState, useEffect } from 'react';

export default function SalaryDashboard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('US');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/v1/employees/salary_insights');
      const data = await response.json();
      setInsights(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  if (!insights) return <div className="p-4">No data available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-lg mb-2">Total Employees</h3>
        <p className="text-3xl font-bold text-blue-600">{insights.total_employees.toLocaleString()}</p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-bold text-lg mb-2">Average Salary</h3>
        <p className="text-3xl font-bold text-green-600">${(insights.avg_salary || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="font-bold text-lg mb-2">Min Salary</h3>
        <p className="text-3xl font-bold text-purple-600">${(insights.min_salary || 0).toLocaleString()}</p>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h3 className="font-bold text-lg mb-2">Max Salary</h3>
        <p className="text-3xl font-bold text-orange-600">${(insights.max_salary || 0).toLocaleString()}</p>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
        <h3 className="font-bold text-lg mb-2">Countries</h3>
        <p className="text-3xl font-bold text-indigo-600">{insights.countries}</p>
      </div>

      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
        <h3 className="font-bold text-lg mb-2">Job Titles</h3>
        <p className="text-3xl font-bold text-pink-600">{insights.job_titles}</p>
      </div>
    </div>
  );
}