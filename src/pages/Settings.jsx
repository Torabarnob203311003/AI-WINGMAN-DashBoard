/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, User, Key, Shield, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const { tokens } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation states
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // OTP Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { user } = useAuth();

  // Get signed-in user email from auth context
  const signedInEmail = user?.email || 'Not available';

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // Common passwords list
  const commonPasswords = [
    'password', '123456', '12345678', '123456789', '12345', '1234567',
    'password1', '1234567890', '123123', '0', '1234', '111111', '12345678910',
    'qwerty', 'abc123', 'password123', 'admin', 'letmein', 'welcome',
    'monkey', 'dragon', 'baseball', 'football', 'master', 'login',
    'princess', 'solo', 'starwars', 'hello', 'world', 'admin123'
  ];

  // Validate password function
  const validatePassword = (password) => {
    const errors = [];

    if (!password) {
      setPasswordStrength(0);
      return errors;
    }

    // Check length
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Check for uppercase
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Check for lowercase
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    // Check for numbers
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Check for special characters
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check if entirely numeric
    if (/^\d+$/.test(password)) {
      errors.push('This password is entirely numeric');
    }

    // Check if too common
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('This password is too common');
    }

    // Check for sequential characters (123456, abcdef)
    if (/(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
      errors.push('Password contains sequential characters');
    }

    // Check for repeated characters (aaa, 111)
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password contains repeated characters');
    }

    // Calculate password strength
    calculatePasswordStrength(password, errors.length);

    return errors;
  };

  // Calculate password strength
  const calculatePasswordStrength = (password, errorCount) => {
    let strength = 100;

    // Deduct points based on errors
    strength -= errorCount * 15;

    // Bonus for length
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;

    // Bonus for variety
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    const varietyCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    strength += varietyCount * 5;

    // Ensure strength is between 0 and 100
    strength = Math.max(0, Math.min(100, strength));

    setPasswordStrength(strength);
  };

  // Handle password change
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    if (value) {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
      setPasswordStrength(0);
    }
  };

  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 80) return 'bg-green-500';
    if (passwordStrength >= 60) return 'bg-yellow-500';
    if (passwordStrength >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get password strength text
  const getPasswordStrengthText = () => {
    if (passwordStrength >= 80) return 'Strong';
    if (passwordStrength >= 60) return 'Good';
    if (passwordStrength >= 40) return 'Fair';
    return 'Weak';
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (showOtpModal && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [showOtpModal, countdown]);

  // Fetch user profile
  const fetchUserProfile = useCallback(async (isInitialLoad = true) => {
    try {
      const token = localStorage.getItem('auth_tokens');

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const parsedToken = JSON.parse(token);
      if (!parsedToken.access_token) {
        throw new Error('Access token is missing. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/settings/profile/`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${parsedToken.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.success && responseData.data) {
        const profileData = responseData.data;

        const extractedName = profileData.name || '';
        const extractedEmail = profileData.email || '';

        setName(extractedName);
        setEmail(extractedEmail);
        setOriginalName(extractedName);
        setOriginalEmail(extractedEmail);

        if (isInitialLoad) {
          setMessage('Profile loaded successfully');
          setMessageType('success');

          setTimeout(() => {
            setMessage('');
            setMessageType('');
          }, 3000);
        }
      } else {
        throw new Error('Could not extract profile data from response');
      }
    } catch (err) {
      console.error('Error fetching profile:', err.message);

      if (isInitialLoad) {
        setName('');
        setEmail('');
      }
    } finally {
      if (isInitialLoad) {
        setPageLoading(false);
      }
    }
  }, [API_BASE_URL]);

  // Fetch profile on component mount
  useEffect(() => {
    fetchUserProfile(true);
  }, [fetchUserProfile]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle OTP keydown (backspace)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Check if any changes were made
  const hasChanges = () => {
    return name !== originalName || email !== originalEmail;
  };

  // Check if email was changed
  const isEmailChanged = () => {
    return email !== originalEmail;
  };

  // Get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('auth_tokens');
    if (!token) return null;
    const parsedToken = JSON.parse(token);
    return parsedToken.access_token;
  };

  // Handle update profile
  const handleUpdateProfile = async () => {
    // Check if there are any changes
    if (!hasChanges()) {
      showMessage('No changes to update', 'error');
      return;
    }

    // Validate fields (only check if they have values when they are being updated)
    if (name.trim() === '' && name !== originalName) {
      showMessage('Name cannot be empty', 'error');
      return;
    }

    if (email.trim() === '' && email !== originalEmail) {
      showMessage('Email cannot be empty', 'error');
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();

      // Only append fields that have changed
      if (name !== originalName) {
        formData.append('name', name);
      }

      if (email !== originalEmail) {
        formData.append('email', email);
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/settings/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const responseData = await response.json();

      // Check if email verification is required (only when email was changed)
      if (isEmailChanged() && responseData.data?.email_verification_required) {
        // Store pending data and show OTP modal
        setPendingData({ name, email });
        setShowOtpModal(true);
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '']);
        setOtpError('');

        showMessage('Verification code sent to your new email', 'success');
      } else {
        // No verification needed (only name changed or email change didn't require verification)
        let successMessage = '';
        if (name !== originalName && email !== originalEmail) {
          successMessage = 'Profile updated successfully!';
        } else if (name !== originalName) {
          successMessage = 'Name updated successfully!';
        } else if (email !== originalEmail) {
          successMessage = 'Email updated successfully!';
        }

        showMessage(successMessage, 'success');
        setOriginalName(name);
        setOriginalEmail(email);
        await fetchUserProfile(false);
      }
    } catch (err) {
      console.error('Update profile error:', err);
      showMessage(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      setOtpError('Please enter a valid 4-digit OTP');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/settings/profile/verify-email/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otpValue
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.success) {
        setShowOtpModal(false);
        showMessage('Email verified and updated successfully!', 'success');
        setOriginalEmail(email);
        await fetchUserProfile(false);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setOtpError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || !pendingData) return;

    setOtpLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('email', pendingData.email);

      const response = await fetch(`${API_BASE_URL}/dashboard/settings/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '']);
      setOtpError('');

      showMessage('New verification code sent', 'success');
    } catch (err) {
      console.error('Resend OTP error:', err);
      setOtpError('Failed to resend OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle change password with validation
  const handleChangePassword = async () => {
    // Check if all fields are filled
    if (currentPassword.trim() === '' || newPassword.trim() === '' || confirmPassword.trim() === '') {
      showMessage('Please fill in all password fields', 'error');
      return;
    }

    // Validate new password
    const errors = validatePassword(newPassword);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      showMessage('Please fix password validation errors', 'error');
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      showMessage('New password and confirm password do not match', 'error');
      return;
    }

    // Check if new password is same as current
    if (newPassword === currentPassword) {
      showMessage('New password must be different from current password', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/settings/password/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API returned status ${response.status}`);
      }

      const responseData = await response.json();

      showMessage(responseData.message || 'Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors([]);
      setPasswordStrength(0);
    } catch (err) {
      console.error('Change password error:', err);
      showMessage(err.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show message helper
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Loading State */}
      {pageLoading ? (
        <div className="flex justify-center items-center min-h-[400px] text-gray-500 text-lg">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-3 border-purple-200 border-t-purple-500 animate-spin mx-auto mb-4" />
            <p>Loading profile...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${messageType === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
              }`}>
              <div className="flex items-center gap-2">
                {messageType === 'success' ? (
                  <CheckCircle size={18} className="text-green-500" />
                ) : (
                  <AlertCircle size={18} className="text-red-500" />
                )}
                <span className="text-sm font-medium">{message}</span>
              </div>
            </div>
          )}

          {/* Admin User Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Admin User
            </h1>

            {/* Signed In Email Display */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Mail size={16} className="text-blue-600" />
                <label className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  Signed In Email
                </label>
              </div>
              <div className="text-base font-semibold text-gray-900 break-all pl-6">
                {signedInEmail}
              </div>
            </div>

            {/* Name Field */}
            <div className="mb-5 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-gray-500" />
                <label className="text-sm font-semibold text-gray-700">
                  Name
                </label>
              </div>
              <input
                type="text"
                placeholder="e.g., admin name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${name !== originalName ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'
                  }`}
              />
              {name !== originalName && (
                <p className="mt-1 text-xs text-yellow-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Name has been changed
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-6 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} className="text-gray-500" />
                <label className="text-sm font-semibold text-gray-700">
                  Email
                </label>
              </div>
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${email !== originalEmail ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'
                  }`}
              />
              {email !== originalEmail && (
                <p className="mt-1 text-xs text-yellow-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Email has been changed and will require verification
                </p>
              )}
            </div>

            {/* Update Profile Button */}
            <button
              onClick={handleUpdateProfile}
              disabled={loading || !hasChanges()}
              className={`px-8 py-3 bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 ${loading || !hasChanges() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <User size={18} />
                  {!hasChanges() ? 'No Changes' : 'Update Profile'}
                </>
              )}
            </button>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Change Password
            </h2>

            {/* Current Password Field */}
            <div className="mb-5 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Key size={16} className="text-gray-500" />
                <label className="text-sm font-semibold text-gray-700">
                  Current Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="mb-3 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-gray-500" />
                <label className="text-sm font-semibold text-gray-700">
                  New Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Strength Meter */}
            {newPassword && (
              <div className="max-w-2xl mb-4">
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
              <div className="max-w-2xl mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
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
            <div className="mb-6 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-gray-500" />
                <label className="text-sm font-semibold text-gray-700">
                  Confirm New Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 pr-10 ${confirmPassword && newPassword !== confirmPassword
                      ? 'border-red-300 bg-red-50'
                      : confirmPassword && newPassword === confirmPassword
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Passwords do not match
                </p>
              )}
              {confirmPassword && newPassword === confirmPassword && newPassword.length > 0 && (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle size={12} />
                  Passwords match
                </p>
              )}
            </div>

            {/* Change Password Button */}
            <button
              onClick={handleChangePassword}
              disabled={loading || passwordErrors.length > 0 || (newPassword && newPassword !== confirmPassword)}
              className="px-8 py-3 bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Key size={18} />
                  Change Password
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowOtpModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-md w-full relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Verify Email Change
              </h2>
              <p className="text-sm text-gray-600">
                We've sent a verification code to
              </p>
              <p className="text-sm font-semibold text-purple-600 mt-1 break-all">
                {email}
              </p>
            </div>

            {/* OTP Input Fields */}
            <div className="flex justify-center gap-3 mb-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-14 h-14 text-center text-xl font-semibold border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus={index === 0}
                  disabled={otpLoading}
                />
              ))}
            </div>

            {/* Error Message */}
            {otpError && (
              <p className="text-sm text-red-600 text-center mb-4">
                {otpError}
              </p>
            )}

            {/* Resend Code */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                {canResend ? (
                  <button
                    onClick={handleResendOtp}
                    disabled={otpLoading}
                    className="text-purple-600 font-semibold hover:text-purple-700 disabled:opacity-50"
                  >
                    Resend
                  </button>
                ) : (
                  <span className="text-gray-400">
                    Resend in {countdown}s
                  </span>
                )}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleVerifyOtp}
                disabled={otpLoading}
                className="flex-1 py-3 bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>
              <button
                onClick={() => setShowOtpModal(false)}
                disabled={otpLoading}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;