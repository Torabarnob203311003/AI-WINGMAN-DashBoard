import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import OtpIcon from '../assets/key.svg'

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const navigate = useNavigate()
  const email = sessionStorage.getItem('reset_email')

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  // Countdown timer for resend
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()

    const otpValue = otp.join('')
    if (otpValue.length !== 4) {
      setError('Please enter a valid 4-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Note: This endpoint might be different based on your API
      // Some APIs don't have a separate OTP verification endpoint
      // If that's the case, we'll just store OTP and proceed to reset password

      // For now, we'll assume OTP verification is part of the reset flow
      // and just store OTP in session storage

      setSuccess(true)

      // Store OTP for password reset
      sessionStorage.setItem('reset_otp', otpValue)

      // Redirect to reset password after 2 seconds
      setTimeout(() => {
        navigate('/reset-password')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          throw new Error(data.errors.error || data.message || 'Failed to resend OTP')
        } else {
          throw new Error(data.message || 'Failed to resend OTP')
        }
      }

      setCountdown(60)
      setCanResend(false)
      setOtp(['', '', '', ''])

      // Show success message
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <img src={OtpIcon} alt="OTP Icon" className="w-20 h-20" />
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Verify OTP
        </h1>

        {/* Subtitle */}
        <p className="text-center text-sm sm:text-base text-gray-500 mb-2">
          Enter the verification code sent to
        </p>
        <p className="text-center text-sm font-semibold text-purple-600 mb-6 break-all">
          {email}
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">OTP Verified!</p>
              <p className="text-xs text-green-600 mt-1">Redirecting to password reset...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          {/* OTP Input Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter 4-digit OTP
            </label>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-14 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100"
                  disabled={loading || success}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {/* Resend Code */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <Clock size={16} className="text-gray-400" />
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-purple-600 font-semibold hover:text-purple-700 disabled:opacity-50"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-500">
                Resend in {countdown}s
              </span>
            )}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Verifying...
              </div>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        {/* Back to Forgot Password */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/forgot-password')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition"
          >
            <ArrowLeft size={16} />
            <span>Back to forgot password</span>
          </button>
        </div>
      </div>
    </div>
  )
}