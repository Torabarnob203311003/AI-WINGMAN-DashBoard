import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../utils/apiClient'
import KeyIcon from '../assets/key.svg'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  async function handleGetOtp(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email) {
        throw new Error('Please enter your email')
      }

      // Call the send OTP API
      const response = await apiClient.post('/auth/send-otp/', { email })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to send OTP')
      }

      // Store email for verification
      sessionStorage.setItem('reset_email', email)
      setSuccess(true)
      setEmail('')

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/verify-otp')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <img src={KeyIcon} alt="Key Icon" className="w-22 h-22" />
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Forgot password?
        </h1>

        {/* Subtitle */}
        <p className="text-center text-sm sm:text-base text-gray-500 mb-8">
          No worries, we'll send you reset instructions.
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              ✓ OTP sent to your email! Redirecting...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <div onSubmit={handleGetOtp} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                ✉️
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={loading || success}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Get OTP Button */}
        <button
  onClick={handleGetOtp}
  disabled={loading || success}
  style={{ background: 'linear-gradient(90deg, #6A026A 0%, #FF00FF 129%)' }}
  className="w-full text-white font-semibold py-3 px-4 rounded-lg transition duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? 'Sending OTP...' : 'Get OTP'}
</button>
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition"
          >
            <span>←</span>
            <span>Back to log in</span>
          </a>
        </div>
      </div>
    </div>
  )
}