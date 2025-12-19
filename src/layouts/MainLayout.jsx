import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen flex bg-gray-200">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col">
        <Header onToggle={() => setCollapsed(s => !s)} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
