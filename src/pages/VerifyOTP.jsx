import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VerifyOTP() {
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  function handleVerify(e) {
    e.preventDefault()
    // In real app: verify OTP
    navigate('/reset-password')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleVerify} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Verify OTP</h2>
        <label className="block mb-2">Enter OTP sent to your email</label>
        <input value={otp} onChange={e => setOtp(e.target.value)} required className="w-full mb-3 p-2 border rounded" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Verify OTP</button>
      </form>
    </div>
  )
}
