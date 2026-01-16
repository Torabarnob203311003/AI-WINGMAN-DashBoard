import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import apiClient from '../utils/apiClient'
import Logo from '../assets/Logo.svg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const { signin } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        throw new Error('Please enter email and password')
      }
      
      // Call the login API using apiClient
      const response = await apiClient.post('/auth/login/', {
        email: email,
        password: password
      })

      if (!response.ok) {
        const errorData = await response.json()
        const message = errorData.message || 'Invalid email or password. Please use the right one'
        setErrorMessage(message)
        setShowErrorPopup(true)
        setLoading(false)
        return
      }

      const data = await response.json()

      // Show success popup
      setShowSuccessPopup(true)

      // Sign in user with API response data
      signin({
        user_id: data.data.user_id,
        email: email,
        token: data.data.token,
        refresh_token: data.data.refresh_token
      })

      // Verify token was stored
      const storedTokens = localStorage.getItem('auth_tokens');
      console.log('✅ Login successful - Tokens stored:', storedTokens ? 'YES' : 'NO');
      if (storedTokens) {
        const parsed = JSON.parse(storedTokens);
        console.log('✅ Access Token exists:', !!parsed.access_token);
        console.log('✅ Refresh Token exists:', !!parsed.refresh_token);
      }
      
      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password. Please use the right one')
      setShowErrorPopup(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Success Pop-up Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <style>
            {`
              @keyframes scaleIn {
                from {
                  transform: scale(0);
                  opacity: 0;
                }
                to {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              @keyframes checkmark {
                0% {
                  stroke-dashoffset: 50;
                }
                100% {
                  stroke-dashoffset: 0;
                }
              }
              .modal-success {
                animation: scaleIn 0.5s ease-out;
              }
              .checkmark-icon {
                animation: checkmark 0.8s ease-out;
              }
            `}
          </style>
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4 modal-success">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <svg 
                  className="w-12 h-12 text-green-600 checkmark-icon" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  strokeDasharray="50"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              Login Successful!
            </h3>
            <p className="text-center text-gray-600 mb-6">
              Welcome back! Redirecting to dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Error Pop-up Modal */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <style>
            {`
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
              }
              .modal-error {
                animation: shake 0.5s ease-in-out;
              }
            `}
          </style>
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4 modal-error">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6H9m6 0h-3m0 0H9m6 0h3" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              Invalid Credentials
            </h3>
            <p className="text-center text-gray-600 mb-6">
              {errorMessage}
            </p>
            <button
              onClick={() => setShowErrorPopup(false)}
              style={{ background: 'linear-gradient(90deg, #6A026A 0%, #FF00FF 129%)' }}
              className="w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200 hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex ps-4  items-center justify-center gap-3 mb-8">
          <img src={Logo} alt="AI Wingman Logo" className="w-42 h-42" />
          {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Wingman</h1> */}
        </div>

       <div className='bg-white p-12 rounded-2xl '>

             {/* Heading */}
        <h2 className="text-center text-xl sm:text-3xl font-bold text-gray-900 mb-8">
          Sign in Your Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
                ✉️
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold
             text-black mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Remember Me */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-sm font-bold text-black">Remember me</span>
          </label>

          {/* Sign In Button */}
        <button
  type="submit"
  disabled={loading}
  style={{ background: 'linear-gradient(90deg, #6A026A 0%, #FF00FF 129%)' }}
  className="w-full text-white font-semibold py-3 px-4 rounded-lg transition duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-center"
>
  {loading ? 'Signing in...' : 'Sign in'}
</button>
        </form>

        {/* Forgot Password */}
        <div className="mt-6 text-center">
          <a
            href="/forgot"
            className="text-l font-semibold text-black hover:text-purple-600 transition"
          >
            Forgot the password?
          </a>

       </div>
        </div>
      </div>
    </div>
  )
}