import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ForgotEmail() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  function handleGetOtp(e) {
    e.preventDefault()
    // In real app: send OTP to email
    sessionStorage.setItem('reset_email', email)
    navigate('/verify-otp')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleGetOtp} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Forgot Password</h2>
        <label className="block mb-2">Enter your email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full mb-3 p-2 border rounded" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Get OTP</button>
      </form>
    </div>
  )
}
