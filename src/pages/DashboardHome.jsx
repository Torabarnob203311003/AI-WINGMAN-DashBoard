import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function DashboardHome() {
  const { user, signout } = useAuth()

  return (
    <div>
      <h2 className="text-2xl">Dashboard</h2>
      <p className="mt-4">Welcome {user?.email}</p>
      <button onClick={signout} className="mt-4 bg-red-500 text-white p-2 rounded">Sign out</button>
    </div>
  )
}
