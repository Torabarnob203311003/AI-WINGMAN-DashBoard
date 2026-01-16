import React, { useState } from 'react';
import apiClient from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const [name, setName] = useState('Admin name');
  const [email, setEmail] = useState('mostafar@gmail.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const { user } = useAuth();

  const handleUpdateProfile = async () => {
    if (name.trim() === '' || email.trim() === '') {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.put('/auth/profile/', {
        name: name,
        email: email,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      setMessage('Profile updated successfully!');
      setMessageType('success');
    } catch (err) {
      setMessage(err.message || 'Failed to update profile');
      setMessageType('error');
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
      setMessage('Please fill in all password fields');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match');
      setMessageType('error');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      setMessage('Password changed successfully!');
      setMessageType('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err.message || 'Failed to change password');
      setMessageType('error');
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
            placeholder="mostafar@gmail.com"
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
    </div>
  );
};

export default Settings;