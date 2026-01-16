import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('auth_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const [tokens, setTokens] = useState(() => {
    try {
      const raw = localStorage.getItem('auth_tokens')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    else localStorage.removeItem('auth_user')
  }, [user])

  useEffect(() => {
    if (tokens) localStorage.setItem('auth_tokens', JSON.stringify(tokens))
    else localStorage.removeItem('auth_tokens')
  }, [tokens])

  const signin = (data) => {
    // data contains: user_id, email, token (access_token), refresh_token
    const userData = {
      user_id: data.user_id,
      email: data.email
    }
    const tokensData = {
      access_token: data.token,
      refresh_token: data.refresh_token,
      user_id: data.user_id
    }
    setUser(userData)
    setTokens(tokensData)
  }

  const signout = () => {
    setUser(null)
    setTokens(null)
    // Clear localStorage on logout
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_tokens')
  }

  const getAccessToken = () => tokens?.access_token || null

  const isTokenValid = () => {
    return tokens && tokens.access_token ? true : false
  }

  return (
    <AuthContext.Provider value={{ user, tokens, signin, signout, getAccessToken, isTokenValid }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
