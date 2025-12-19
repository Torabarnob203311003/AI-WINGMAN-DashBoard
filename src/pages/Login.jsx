import React, { useState } from 'react'
import Logo from '../assets/Logo.svg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // API Integration Point - Replace with your actual API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe: remember,
        }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      
      // Store token/session
      if (data.token) {
        localStorage.setItem('authToken', data.token)
      }

      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
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