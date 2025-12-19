import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NewPassIcon from '../assets/newpass.svg'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signin } = useAuth()

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    if (password !== confirm) {
      alert('Passwords do not match')
      setLoading(false)
      return
    }
    
    // Demo: Simulate password reset and auto-login
    const email = sessionStorage.getItem('reset_email')
    if (email) {
      setTimeout(() => {
        signin({ email }, false)
        navigate('/dashboard')
      }, 500)
    } else {
      setLoading(false)
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <img src={NewPassIcon} alt="New Password Icon" className="w-12 h-12" />
        </div>
        <h2 className="text-2xl mb-4 text-center">Set New Password</h2>
        <label className="block mb-2">New password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required disabled={loading} className="w-full mb-3 p-2 border rounded" />
        <label className="block mb-2">Confirm password</label>
        <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" required disabled={loading} className="w-full mb-3 p-2 border rounded" />
        <button disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">{loading ? 'Resetting...' : 'Set Password'}</button>
      </form>
    </div>
  )
}
