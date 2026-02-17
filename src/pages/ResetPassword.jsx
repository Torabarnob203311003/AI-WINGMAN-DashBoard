import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import NewPassIcon from '../assets/newpass.svg'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Password validation states
  const [passwordErrors, setPasswordErrors] = useState([])
  const [passwordStrength, setPasswordStrength] = useState(0)

  const navigate = useNavigate()

  // Get email and OTP from session storage
  const email = sessionStorage.getItem('reset_email')
  const otp = sessionStorage.getItem('reset_otp')

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  // Common passwords list
  const commonPasswords = [
    'password', '123456', '12345678', '123456789', '12345', '1234567',
    'password1', '1234567890', '123123', '0', '1234', '111111', '12345678910',
    'qwerty', 'abc123', 'password123', 'admin', 'letmein', 'welcome',
    'monkey', 'dragon', 'baseball', 'football', 'master', 'login',
    'princess', 'solo', 'starwars', 'hello', 'world', 'admin123'
  ]

  // Redirect if no email or OTP
  useEffect(() => {
    if (!email || !otp) {
      navigate('/forgot-password')
    }
  }, [email, otp, navigate])

  // Validate password function
  const validatePassword = (password) => {
    const errors = []

    if (!password) {
      setPasswordStrength(0)
      return errors
    }

    // Check length
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    // Check for uppercase
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    // Check for lowercase
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    // Check for numbers
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    // Check for special characters
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    // Check if entirely numeric
    if (/^\d+$/.test(password)) {
      errors.push('This password is entirely numeric')
    }

    // Check if too common
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('This password is too common')
    }

    // Check for sequential characters
    if (/(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
      errors.push('Password contains sequential characters')
    }

    // Check for repeated characters
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password contains repeated characters')
    }

    // Calculate password strength
    calculatePasswordStrength(password, errors.length)

    return errors
  }

  // Calculate password strength
  const calculatePasswordStrength = (password, errorCount) => {
    let strength = 100
    strength -= errorCount * 15

    if (password.length >= 12) strength += 10
    if (password.length >= 16) strength += 10

    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)

    const varietyCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length
    strength += varietyCount * 5

    strength = Math.max(0, Math.min(100, strength))
    setPasswordStrength(strength)
  }

  // Handle password change
  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    setError('')

    if (value) {
      const errors = validatePassword(value)
      setPasswordErrors(errors)
    } else {
      setPasswordErrors([])
      setPasswordStrength(0)
    }
  }

  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 80) return 'bg-green-500'
    if (passwordStrength >= 60) return 'bg-yellow-500'
    if (passwordStrength >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  // Get password strength text
  const getPasswordStrengthText = () => {
    if (passwordStrength >= 80) return 'Strong'
    if (passwordStrength >= 60) return 'Good'
    if (passwordStrength >= 40) return 'Fair'
    return 'Weak'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Check if passwords match
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    const errors = validatePassword(password)
    if (errors.length > 0) {
      setPasswordErrors(errors)
      setError('Please fix password validation errors')
      return
    }

    setLoading(true)

    try {
      // Prepare request body exactly as shown in the image
      const requestBody = {
        email: email,
        otp: otp,
        new_password: password,
        confirm_password: confirm
      }

      console.log('Sending request:', requestBody) // For debugging

      const response = await fetch(`${API_BASE_URL}/auth/password-reset-confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      console.log('Response:', data) // For debugging

      if (!response.ok) {
        // Handle error response format
        if (data.errors) {
          // Handle nested errors object
          if (typeof data.errors === 'object') {
            const errorMessages = Object.values(data.errors).flat().join(', ')
            throw new Error(errorMessages || data.message || 'Failed to reset password')
          } else {
            throw new Error(data.errors || data.message || 'Failed to reset password')
          }
        } else {
          throw new Error(data.message || 'Failed to reset password')
        }
      }

      // Password reset successful
      setSuccess(true)

      // Clear session storage
      sessionStorage.removeItem('reset_email')
      sessionStorage.removeItem('reset_otp')

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      console.error('Password reset error:', err)
      setError(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!email || !otp) {
    return null
  }

  // If success, show success message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#6A026A] to-[#FF00FF] p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your password has been reset successfully. Redirecting to login...
          </p>
          <div className="w-12 h-12 rounded-full border-3 border-purple-200 border-t-purple-500 animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <img src={NewPassIcon} alt="New Password Icon" className="w-16 h-16" />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Set New Password</h2>
        <p className="text-sm text-gray-500 text-center mb-2">
          Enter your new password for
        </p>
        <p className="text-sm font-semibold text-purple-600 text-center mb-6 break-all">
          {email}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* New Password Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New password
          </label>
          <div className="relative">
            <input
              value={password}
              onChange={handlePasswordChange}
              type={showPassword ? "text" : "password"}
              required
              disabled={loading}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        {/* Password Strength Meter */}
        {password && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">
                Password Strength: {getPasswordStrengthText()}
              </span>
              <span className="text-xs font-medium text-gray-600">
                {Math.round(passwordStrength)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          </div>
        )}

        {/* Password Validation Errors */}
        {passwordErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-semibold text-red-700 mb-2">Password requirements:</p>
            <ul className="space-y-1">
              {passwordErrors.map((error, index) => (
                <li key={index} className="text-xs text-red-600 flex items-start gap-1">
                  <span className="mt-0.5">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm password
          </label>
          <div className="relative">
            <input
              value={confirm}
              onChange={e => {
                setConfirm(e.target.value)
                setError('')
              }}
              type={showConfirmPassword ? "text" : "password"}
              required
              disabled={loading}
              className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${confirm && password !== confirm
                  ? 'border-red-300 bg-red-50'
                  : confirm && password === confirm
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
                }`}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
              disabled={loading}
            >
              {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        {/* Password Match Indicator */}
        {password && confirm && (
          <div className="mb-6 text-sm">
            {password === confirm ? (
              <p className="text-green-600 flex items-center gap-1">
                <CheckCircle size={16} />
                Passwords match
              </p>
            ) : (
              <p className="text-red-600 flex items-center gap-1">
                <AlertCircle size={16} />
                Passwords do not match
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || passwordErrors.length > 0 || (password && confirm && password !== confirm)}
          className="w-full bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Resetting...
            </div>
          ) : (
            'Reset Password'
          )}
        </button>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition"
          >
            <ArrowLeft size={16} />
            <span>Back to login</span>
          </button>
        </div>
      </form>
    </div>
  )
}