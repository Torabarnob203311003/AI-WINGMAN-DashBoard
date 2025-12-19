import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ collapsed }) {
  const { signout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    signout()
    navigate('/login')
  }

  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/users', label: 'Users', icon: '👥' },
    { to: '/tones-limits', label: 'Tones & Limits', icon: '🎚️' },
    { to: '/analytics', label: 'Analytics', icon: '📊' },
    { to: '/settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <aside className={`bg-gray-800 text-white flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">AI</div>
          {!collapsed && <div className="text-lg font-bold">ai wingman</div>}
        </div>

        <nav className="space-y-1">
          {items.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 rounded hover:bg-red-600 bg-transparent">
          <span className="text-xl">🔒</span>
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  )
}
