import React, { useState } from 'react';

const Settings = () => {
  const [name, setName] = useState('Admin name');
  const [email, setEmail] = useState('mostafar@gmail.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = () => {
    if (name.trim() === '' || email.trim() === '') {
      alert('Please fill in all fields');
      return;
    }
    console.log({
      name,
      email,
    });
    alert('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (
      currentPassword.trim() === '' ||
      newPassword.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      alert('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    console.log({
      currentPassword,
      newPassword,
    });
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
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
          style={{
            background: 'linear-gradient(90deg, #a21caf 0%, #e91e63 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          type="button"
        >
          Update profile
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
          style={{
            background: 'linear-gradient(90deg, #a21caf 0%, #e91e63 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          type="button"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Settings;