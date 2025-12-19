import React, { useState, useRef, useEffect } from 'react'

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  // Handle OTP input change
  function handleOtpChange(index, value) {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1)
    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  // Handle backspace
  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  // Verify OTP
  async function handleVerify(e) {
    e.preventDefault()
    
    const otpCode = otp.join('')
    if (otpCode.length !== 4) {
      setError('Please enter all 4 digits')
      return
    }

    setError('')
    setLoading(true)

    try {
      const email = sessionStorage.getItem('reset_email')
      if (!email) {
        throw new Error('Email not found. Please start over.')
      }

      // API Integration Point - Replace with your actual API endpoint
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otpCode,
        }),
      })

      if (!response.ok) {
        throw new Error('Invalid OTP. Please try again.')
      }

      const data = await response.json()

      // Store token for password reset
      if (data.token) {
        sessionStorage.setItem('reset_token', data.token)
      }

      // Redirect to reset password
      setTimeout(() => {
        window.location.href = '/reset-password'
      }, 500)
    } catch (err) {
      setError(err.message || 'Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  async function handleResend() {
    setError('')
    setLoading(true)

    try {
      const email = sessionStorage.getItem('reset_email')
      if (!email) {
        throw new Error('Email not found')
      }

      // API Integration Point
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to resend OTP')
      }

      setResendTimer(60)
      setOtp(['', '', '', ''])
      inputRefs[0].current?.focus()
    } catch (err) {
      setError(err.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">✉️</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Check your email
        </h1>

        {/* Subtitle */}
        <p className="text-center text-sm sm:text-base text-gray-500 mb-8">
          We've sent a 4-digit code to your email.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* OTP Input */}
        <div className="space-y-6">
          {/* OTP Digits */}
          <div className="flex justify-center gap-3 sm:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                inputMode="numeric"
                maxLength="1"
                disabled={loading}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 4}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-600">
              Resend code in <span className="font-semibold text-purple-600">{resendTimer}s</span>
            </p>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-2">Didn't get the code?</p>
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-sm font-semibold text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed transition"
              >
                Resend
              </button>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition"
          >
            <span>←</span>
            <span>Back</span>
          </a>
        </div>
      </div>
    </div>
  )
}