/**
 * API Client with automatic Authorization header injection
 * Handles token refresh and request/response intercepting
 * 
 * Environment Configuration:
 * - Development: Uses VITE_API_BASE_URL from .env or defaults to http://localhost:8000
 * - Production: Uses VITE_API_BASE_URL from .env.production
 */

// Determine API Base URL based on environment
const getApiBaseUrl = () => {
  // Priority 1: Environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }

  // Priority 2: Auto-detect based on environment
  if (import.meta.env.PROD) {
    // Production: Use domain-relative URL
    return import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com'
  }

  // Development: Use localhost
  return 'http://localhost:8000'
}

const API_BASE_URL = getApiBaseUrl()

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
    this.tokenRefreshInProgress = false
    this.tokenRefreshPromise = null
    
    // Log the API URL for debugging (development only)
    if (import.meta.env.DEV) {
      console.log('🔧 API Client initialized')
      console.log('📍 API Base URL:', this.baseURL)
      console.log('🌍 Environment:', import.meta.env.MODE)
    }
  }

  /**
   * Get the stored access token
   */
  getAccessToken() {
    try {
      const tokens = localStorage.getItem('auth_tokens')
      return tokens ? JSON.parse(tokens).access_token : null
    } catch {
      return null
    }
  }

  /**
   * Get the stored refresh token
   */
  getRefreshToken() {
    try {
      const tokens = localStorage.getItem('auth_tokens')
      return tokens ? JSON.parse(tokens).refresh_token : null
    } catch {
      return null
    }
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshAccessToken() {
    // Prevent multiple refresh requests
    if (this.tokenRefreshInProgress) {
      return this.tokenRefreshPromise
    }

    this.tokenRefreshInProgress = true

    this.tokenRefreshPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await fetch(`${this.baseURL}/auth/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refreshToken
          })
        })

        if (!response.ok) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem('auth_tokens')
          localStorage.removeItem('auth_user')
          window.location.href = '/login'
          throw new Error('Token refresh failed')
        }

        const data = await response.json()
        
        // Update tokens
        const tokens = JSON.parse(localStorage.getItem('auth_tokens') || '{}')
        tokens.access_token = data.data.token || data.data.access_token
        localStorage.setItem('auth_tokens', JSON.stringify(tokens))

        return data.data.token || data.data.access_token
      } catch (error) {
        console.error('Token refresh error:', error)
        throw error
      } finally {
        this.tokenRefreshInProgress = false
        this.tokenRefreshPromise = null
      }
    })()

    return this.tokenRefreshPromise
  }

  /**
   * Make an API request with automatic Authorization header
   */
  async request(endpoint, options = {}) {
    let accessToken = this.getAccessToken()

    // Add Authorization header if token exists
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      }
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      // If 401 Unauthorized and we have a refresh token, try to refresh
      if (response.status === 401 && this.getRefreshToken()) {
        try {
          const newAccessToken = await this.refreshAccessToken()
          
          // Retry the original request with new token
          options.headers.Authorization = `Bearer ${newAccessToken}`
          return fetch(`${this.baseURL}${endpoint}`, options)
        } catch (error) {
          console.error('Failed to refresh token:', error)
          throw error
        }
      }

      return response
    } catch (error) {
      console.error(`API Request Error [${endpoint}]:`, error.message)
      throw error
    }
  }

  /**
   * GET request
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  /**
   * POST request
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }
}

export default new ApiClient()
