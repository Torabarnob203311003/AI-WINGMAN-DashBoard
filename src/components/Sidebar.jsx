import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DashIcon from '../assets/icons/daash.svg'
import UsersIcon from '../assets/icons/user.svg'
import ToneIcon from '../assets/icons/Tone.svg'
import AnalyticsIcon from '../assets/icons/Analytics.svg'
import SettingsIcon from '../assets/icons/settings.svg'
import { FiLogOut } from 'react-icons/fi'
import Logo from '../assets/Logo.svg'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { signout } = useAuth()

  function handleLogout() {
    signout()
    navigate('/login')
  }

  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: DashIcon, to: '/dashboard' },
    { id: 'users', label: 'Users', icon: UsersIcon, to: '/users' },
    { id: 'tones', label: 'Tones & Limits', icon: ToneIcon, to: '/tones-limits' },
    { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon, to: '/analytics' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, to: '/settings' }
  ]

  return (
    <aside className={`ms-7 bg-white border-r rounded-lg flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-80'} h-screen overflow-hidden`}>
      {/* Header */}
      <div className="p-6 flex justify-center">
        <img 
          src={Logo} 
          alt="AI Wingman Logo" 
          style={{ width: '440px', height: '80px', objectFit: 'contain' }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-4">
        {items.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.id}
              to={item.to}
              className={`w-full flex items-center gap-3 px-3 py-4 rounded-lg transition-all duration-200 ${
                isActive ? 'text-white' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
              }`}
              style={
                isActive
                  ? { background: 'linear-gradient(90deg, #6A026A 0%, #FF00FF 129%)' }
                  : undefined
              }
            >
              <img src={item.icon} alt={`${item.label} icon`} className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-all duration-200"
          >
            <FiLogOut className="w-5 h-5 text-red-500 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Log Out</span>}
          </button>
        </div>

      {/* Toggle Button */}
      {/* <div className="p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full p-2 rounded-lg hover:bg-gray-100 text-gray-600 text-center text-xs"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div> */}
    </aside>
  )
}