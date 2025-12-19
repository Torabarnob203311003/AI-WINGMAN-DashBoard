import React, { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, signout } = useAuth()

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col">
        <Header onToggle={() => setCollapsed(s => !s)} />
        <main className="p-6">
          <h2 className="text-2xl">Dashboard</h2>
          <p className="mt-4">Welcome {user?.email}</p>
          <button onClick={signout} className="mt-4 bg-red-500 text-white p-2 rounded">Sign out</button>
        </main>
      </div>
    </div>
  )
}
