import React, { useState, useEffect } from 'react'

const TABS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'employees', label: '👥 Employees' },
  { id: 'add', label: '➕ Add Employee' },
]

export default function NavTabs({ activeTab, onTabClick }) {
  return (
    <nav className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 flex gap-8">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}