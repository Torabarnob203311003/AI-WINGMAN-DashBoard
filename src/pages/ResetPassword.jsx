import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) return alert('Passwords do not match')
    // In real app: update password for sessionStorage.getItem('reset_email')
    alert('Password reset successful — please sign in')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Set New Password</h2>
        <label className="block mb-2">New password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full mb-3 p-2 border rounded" />
        <label className="block mb-2">Confirm password</label>
        <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" required className="w-full mb-3 p-2 border rounded" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Set Password</button>
      </form>
    </div>
  )
}
