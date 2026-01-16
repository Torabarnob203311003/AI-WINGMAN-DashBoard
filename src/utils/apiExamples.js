/**
 * API Usage Examples
 * This file shows how to use apiClient in your components
 */

import apiClient from './apiClient'

/**
 * Example 1: Fetch Users List
 */
export async function fetchUsers() {
  try {
    const response = await apiClient.get('/users/')
    if (!response.ok) throw new Error('Failed to fetch users')
    const data = await response.json()
    return data.data // Adjust based on your API response structure
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

/**
 * Example 2: Create a New User
 */
export async function createUser(userData) {
  try {
    const response = await apiClient.post('/users/', userData)
    if (!response.ok) throw new Error('Failed to create user')
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

/**
 * Example 3: Update User
 */
export async function updateUser(userId, userData) {
  try {
    const response = await apiClient.put(`/users/${userId}/`, userData)
    if (!response.ok) throw new Error('Failed to update user')
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

/**
 * Example 4: Delete User
 */
export async function deleteUser(userId) {
  try {
    const response = await apiClient.delete(`/users/${userId}/`)
    if (!response.ok) throw new Error('Failed to delete user')
    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

/**
 * Example 5: Get Current User Profile
 */
export async function getCurrentUser() {
  try {
    const response = await apiClient.get('/auth/me/')
    if (!response.ok) throw new Error('Failed to fetch user profile')
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

/**
 * Example 6: Send OTP for Password Reset
 */
export async function sendOTP(email) {
  try {
    const response = await apiClient.post('/auth/send-otp/', { email })
    if (!response.ok) throw new Error('Failed to send OTP')
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error sending OTP:', error)
    throw error
  }
}

/**
 * Example 7: Verify OTP
 */
export async function verifyOTP(email, otp) {
  try {
    const response = await apiClient.post('/auth/verify-otp/', { email, otp })
    if (!response.ok) throw new Error('Failed to verify OTP')
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw error
  }
}

/**
 * Example 8: Reset Password
 */
export async function resetPassword(email, token, newPassword) {
  try {
    const response = await apiClient.post('/auth/reset-password/', {
      email,
      token,
      new_password: newPassword
    })
    if (!response.ok) throw new Error('Failed to reset password')
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error resetting password:', error)
    throw error
  }
}

/**
 * Usage in React Component:
 * 
 * import { fetchUsers, createUser } from '../utils/apiExamples'
 * 
 * export function UsersComponent() {
 *   const [users, setUsers] = useState([])
 *   const [loading, setLoading] = useState(false)
 * 
 *   useEffect(() => {
 *     const loadUsers = async () => {
 *       setLoading(true)
 *       try {
 *         const data = await fetchUsers()
 *         setUsers(data)
 *       } catch (error) {
 *         console.error(error)
 *       } finally {
 *         setLoading(false)
 *       }
 *     }
 *     loadUsers()
 *   }, [])
 * 
 *   return <div>{users.map(user => <div key={user.id}>{user.name}</div>)}</div>
 * }
 */
