import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [pageLoading, setPageLoading] = useState(true);
  const { user } = useAuth();

  // Get signed-in user email from auth context
  const signedInEmail = user?.email || 'Not available';

  // Setup axios instance with base URL and auth - memoized to prevent recreation on render
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
    });

    // Add authorization header to every request
    instance.interceptors.request.use(
      (config) => {
        const tokens = JSON.parse(localStorage.getItem('auth_tokens') || '{}');
        if (tokens.access_token) {
          config.headers.Authorization = `Bearer ${tokens.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    return instance;
  }, [API_BASE_URL]);

  // Reusable function to fetch and update profile data
  const fetchUserProfile = useCallback(async (isInitialLoad = true) => {
    try {
      // Check if token exists
      const token = localStorage.getItem('auth_tokens');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const parsedToken = JSON.parse(token);
      if (!parsedToken.access_token) {
        throw new Error('Access token is missing. Please log in again.');
      }

      console.log('📍 Fetching profile with token:', parsedToken.access_token.substring(0, 20) + '...');
      
      const response = await axiosInstance.get('/dashboard/settings/profile/');
      
      console.log('✅ Profile loaded, status:', response.status);
      
      let data = response.data;
      
      // If response is a string, try to parse it
      if (typeof data === 'string') {
        // Check if it's HTML (error page)
        if (data.includes('<!DOCTYPE') || data.includes('<html')) {
          console.error('❌ Response is HTML, not JSON:', data.substring(0, 200));
          throw new Error('Backend returned HTML error page instead of JSON');
        }
        
        console.log('📍 Parsing string response as JSON...');
        try {
          data = JSON.parse(data);
        } catch (parseErr) {
          console.error('❌ Failed to parse response:', parseErr);
          throw new Error('Invalid response format');
        }
      }
      
      // Extract profile data from response
      let profileData = data.data || data.user || data;
      
      if (typeof profileData === 'object' && profileData !== null) {
        const extractedName = profileData.name || profileData.username || '';
        const extractedEmail = profileData.email || '';
        
        setName(extractedName);
        setEmail(extractedEmail);
        
        if (isInitialLoad) {
          setMessage('Profile loaded successfully');
          setMessageType('success');
          
          setTimeout(() => {
            setMessage('');
            setMessageType('');
          }, 3000);
        }
        
        console.log('✅ Profile updated:', { extractedName, extractedEmail });
      } else {
        throw new Error('Could not extract profile data from response');
      }
    }
     catch (err) {
      console.error('❌ Error fetching profile:', err.message);
      
      if (err.response) {
        console.error('API Error:', err.response.status, err.response.data);
      }
      
      if (isInitialLoad) {
        setName('');
        setEmail('');
      }
    } finally {
      if (isInitialLoad) {
        setPageLoading(false);
      }
    }
  }, [axiosInstance]);

  // Fetch user profile data on component mount
  useEffect(() => {
    fetchUserProfile(true);
  }, [fetchUserProfile]);

  const handleUpdateProfile = async () => {
    console.log('🔵 Update button clicked');
    console.log('Current name:', name);
    console.log('Current email:', email);
    
    if (name.trim() === '' || email.trim() === '') {
      console.log('❌ Empty fields - name or email is empty');
      // setMessage('Please fill in all fields');
      // setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      console.log('📍 Sending update request with:', { name, email });
      console.log('📍 API Base URL:', API_BASE_URL);
      console.log('📍 Endpoint: PATCH /auth/profile/');
      
      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      
      const response = await axiosInstance.patch('/auth/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // axios automatically throws on non-2xx status
      const data = response.data;
      console.log('✅ Profile saved successfully, status:', response.status);
      
      setMessage('Profile updated successfully!');
      setMessageType('success');
      
      // Try to refetch profile, but don't fail if it doesn't work
      console.log('📍 Refetching profile to confirm update...');
      try {
        await fetchUserProfile(false);
        console.log('✅ Profile refetch complete');
      } catch (refetchErr) {
        console.warn('⚠️ Refetch failed, but update was successful:', refetchErr.message);
        // Profile update was successful, refetch is just for confirmation
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (err) {
      console.error('❌ Update profile error:', err.message);
      
      if (err.response) {
        console.error('API Error:', err.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      currentPassword.trim() === '' ||
      newPassword.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      // setMessage('Please fill in all password fields');
      // setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      // setMessage('New password and confirm password do not match');
      // setMessageType('error');
      return;
    }

    if (newPassword.length < 6) {
      // setMessage('Password must be at least 6 characters');
      // setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append('current_password', currentPassword);
      formData.append('new_password', newPassword);
      
      const response = await axiosInstance.post('/auth/change-password/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // axios automatically throws on non-2xx status
      const data = response.data;
      console.log('✅ Password changed successfully:', data);
      
      setMessage('Password changed successfully!');
      setMessageType('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (err) {
      console.error('❌ Change password error:', err.message);
      
      // Axios error handling
      if (err.response) {
        console.error('❌ API returned error status:', err.response.status);
        console.error('❌ Error data:', err.response.data);
      } else if (err.request) {
        console.error('❌ Request made but no response received');
      } else {
        console.error('❌ Error setting up request:', err.message);
      }
      
      // setMessage(err.message || 'Failed to change password');
      // setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: '#f9fafb',
        minHeight: '100vh',
        padding: '32px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      {/* Loading State */}
      {pageLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          fontSize: '18px',
          color: '#6b7280',
        }}>
          Loading profile...
        </div>
      ) : (
        <>
          {/* Message Alert */}
          {message && (
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: messageType === 'success' ? '#dcfce7' : '#fee2e2',
                border: `1px solid ${messageType === 'success' ? '#86efac' : '#fca5a5'}`,
                color: messageType === 'success' ? '#166534' : '#991b1b',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              {message}
            </div>
          )}

          {/* Admin User Section */}
          <div style={{  backgroundColor: 'white', padding: '24px', borderRadius: '8px' }}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 32px 0',
              }}
            >
              Admin User
            </h1>

            {/* Signed In Email Display */}
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#1e40af',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Signed In Email
              </label>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  wordBreak: 'break-all',
                }}
              >
                ✉️ {signedInEmail}
              </div>
            </div>

            {/* Name Field */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                }}
              >
                Name
              </label>
              <input
                type="text"
                placeholder="e.g., admin name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  maxWidth: '600px',
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1f2937',
                  boxSizing: 'border-box',
                  backgroundColor: '#f3f4f6',
                }}
              />
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  maxWidth: '600px',
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  maxWidth: '600px',
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1f2937',
                  boxSizing: 'border-box',
                  backgroundColor: '#f3f4f6',
                }}
              />
            </div>

            {/* Update Profile Button */}
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              style={{
                background: 'linear-gradient(90deg, #a21caf 0%, #e91e63 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.opacity = '1')}
              type="button"
            >
              {loading ? 'Updating...' : 'Update profile'}
            </button>
          </div>

          {/* Change Password Section */}
          <div style={{  backgroundColor: 'white', padding: '24px', borderRadius: '8px' }}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 24px 0',
              }}
            >
              Change password
            </h2>

            {/* Current Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  maxWidth: '600px',  
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                }}
              >
                Current Password
              </label>
              <input
                type="password"
                placeholder="enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  maxWidth: '600px',
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1f2937',
                  boxSizing: 'border-box',
                  backgroundColor: '#f3f4f6',
                }}
              />
            </div>

            {/* New Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  maxWidth: '600px',
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                }}
              >
                New Password
              </label>
              <input
                type="password"
                placeholder="enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  maxWidth: '600px',
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1f2937',
                  boxSizing: 'border-box',
                  backgroundColor: '#f3f4f6',
                }}
              />
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                }}
              >
                Confirm new password
              </label>
              <input
                type="password"
                placeholder="enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  maxWidth: '600px',
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1f2937',
                  boxSizing: 'border-box',
                  backgroundColor: '#f3f4f6',
                }}
              />
            </div>

            {/* Change Password Button */}
            <button
              onClick={handleChangePassword}
              disabled={loading}
              style={{
                background: 'linear-gradient(90deg, #a21caf 0%, #e91e63 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.opacity = '1')}
              type="button"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;