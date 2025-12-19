import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const { signin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  function handleSubmit(e) {
    e.preventDefault()
    // NOTE: Replace with real auth call
    signin({ email }, remember)
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Sign In</h2>

        <label className="block mb-2">Email address</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full mb-3 p-2 border rounded" />

        <label className="block mb-2">Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full mb-3 p-2 border rounded" />

        <label className="flex items-center gap-2 mb-4">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
          Remember me
        </label>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mb-3">Sign In</button>

        <div className="text-center">
          <Link to="/forgot" className="text-sm text-blue-600">Forgot password?</Link>
        </div>
      </form>
    </div>
  )
}
