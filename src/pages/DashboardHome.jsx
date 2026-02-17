/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FiUsers, FiActivity, FiTrendingUp, FiRefreshCw,
  FiChevronDown, FiCalendar, FiEye, FiTrash2, FiPower,
  FiKey, FiUserCheck, FiUserX, FiX
} from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('Monthly');
  const [apiUrl] = useState(`${import.meta.env.VITE_API_BASE_URL}/dashboard/analytics/`);
  const { tokens } = useAuth();
  const [apiData, setApiData] = useState({
    totalUsers: 0,
    activeToday: 0,
    premiumUsers: 0,
    conversionRate: 0,
    freeUsers: 0,
    chartData: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Use ref to track component mounted state
  const isMounted = useRef(true);
  // Use ref to track fetch timeout
  const fetchTimeoutRef = useRef(null);

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [togglingUserId, setTogglingUserId] = useState(null);
  const [resettingUserId, setResettingUserId] = useState(null);

  // Message modal states
  const [messageModal, setMessageModal] = useState({
    show: false,
    type: 'success',
    title: '',
    message: '',
    userEmail: ''
  });

  // Stats cards configuration
  const stats = [
    {
      label: 'Total Users',
      value: apiData.totalUsers.toLocaleString(),
      icon: FiUsers,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-100',
    },
    {
      label: 'Active Today',
      value: apiData.activeToday.toLocaleString(),
      icon: FiActivity,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-100',
    },
    {
      label: 'Premium Users',
      value: apiData.premiumUsers.toLocaleString(),
      icon: FaCrown,
      iconColor: 'text-pink-500',
      iconBg: 'bg-pink-100',
    },
    {
      label: 'Conversion Rate',
      value: `${apiData.conversionRate.toFixed(1)}%`,
      icon: FiTrendingUp,
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-100',
    },
  ];

  const chartData = apiData.chartData.length > 0 ? apiData.chartData : [];
  const totalUsers = apiData.totalUsers || 0;
  const freeUsers = apiData.freeUsers || 0;
  const premiumUsers = apiData.premiumUsers || 0;

  const pieData = [
    { name: 'Free', value: freeUsers },
    { name: 'Premium', value: premiumUsers },
  ];

  const recentUsers = apiData.recentUsers.length > 0 ? apiData.recentUsers : [];
  const freePercentage = totalUsers > 0 ? Math.round((freeUsers / totalUsers) * 100) : 0;

  // Function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    // Remove any double slashes
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${baseUrl}/${cleanPath}`;
  };

  // Fetch data function with useCallback to prevent recreation
  const fetchAnalytics = useCallback(async (showRefreshingState = true) => {
    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    try {
      if (showRefreshingState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Authorization": `Bearer ${tokens?.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const response_data = await response.json();

      // Only update state if component is still mounted
      if (isMounted.current && response_data.success && response_data.data) {
        const apiPayload = response_data.data;

        let chartData = [];
        if (apiPayload.graph_data && Array.isArray(apiPayload.graph_data)) {
          chartData = apiPayload.graph_data.map(item => ({
            month: item.month || 'N/A',
            count: parseInt(item.count || 0) || 0
          }));
        }

        let processedUsers = [];
        if (apiPayload.recent_users && Array.isArray(apiPayload.recent_users)) {
          processedUsers = apiPayload.recent_users.map(user => ({
            id: user.id || 0,
            name: user.name || user.email?.split('@')[0] || 'User',
            email: user.email || 'N/A',
            profile_image: user.profile_image || null,
            full_image_url: getFullImageUrl(user.profile_image),
            subscription: user.subscription || 'Free',
            usage_count: user.usage_count || 0,
            status: user.status || 'Active',
            isActive: user.status === 'Active',
            initials: (user.name && user.name.length > 0)
              ? user.name.charAt(0).toUpperCase()
              : (user.email ? user.email.charAt(0).toUpperCase() : 'U')
          }));
        }

        setApiData({
          totalUsers: parseInt(apiPayload.total_users || 0) || 0,
          activeToday: parseInt(apiPayload.active_today || 0) || 0,
          premiumUsers: parseInt(apiPayload.premium_users || 0) || 0,
          conversionRate: parseFloat(apiPayload.conversion_rate || 0) || 0,
          freeUsers: parseInt(apiPayload.free_users || 0) || 0,
          chartData: chartData,
          recentUsers: processedUsers,
        });
        setLastFetch(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      if (isMounted.current) {
        setError(`Error: ${err.message}`);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [apiUrl, tokens?.access_token]);

  // Initial fetch and cleanup
  useEffect(() => {
    isMounted.current = true;

    fetchAnalytics(false);

    // Set up interval for auto-refresh (every 5 minutes instead of 30 seconds)
    const interval = setInterval(() => {
      if (isMounted.current) {
        fetchAnalytics(true);
      }
    }, 300000); // 5 minutes

    // Cleanup function
    return () => {
      isMounted.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      clearInterval(interval);
    };
  }, [fetchAnalytics]);

  // Fetch single user details
  const fetchUserDetails = async (userId) => {
    try {
      setLoadingDetails(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/users/${userId}/`,
        {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${tokens?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const responseData = await response.json();

      if (isMounted.current && responseData.success && responseData.data) {
        const user = responseData.data;
        const formattedUser = {
          id: user.id,
          name: user.name || user.email.split('@')[0],
          email: user.email,
          subscription: user.subscription || (user.is_premium ? 'Premium' : 'Free'),
          usage: user.usage_count || 0,
          status: user.status || (user.is_active ? 'Active' : 'Inactive'),
          isActive: user.is_active,
          joinDate: new Date(user.date_joined).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          }),
          profileImage: user.profile_image,
          fullImageUrl: getFullImageUrl(user.profile_image),
          isStaff: user.is_staff,
          lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : 'Never',
          dateJoined: new Date(user.date_joined).toLocaleString(),
          isPremium: user.is_premium,
        };

        setUserDetails(formattedUser);
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      if (isMounted.current) {
        showMessageModal('error', 'Error', 'Failed to load user details');
      }
    } finally {
      if (isMounted.current) {
        setLoadingDetails(false);
      }
    }
  };

  // Show message modal
  const showMessageModal = (type, title, message, userEmail = '') => {
    setMessageModal({
      show: true,
      type,
      title,
      message,
      userEmail
    });
  };

  // Close message modal
  const closeMessageModal = () => {
    setMessageModal({
      show: false,
      type: 'success',
      title: '',
      message: '',
      userEmail: ''
    });
  };

  // Toggle user status
  const handleToggleStatus = async (userId) => {
    try {
      setActionLoading(true);
      setTogglingUserId(userId);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/users/${userId}/toggle_status/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${tokens?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to toggle user status');
      }

      const responseData = await response.json();

      if (isMounted.current && responseData.success) {
        // Update in recent users list
        setApiData(prev => ({
          ...prev,
          recentUsers: prev.recentUsers.map(user =>
            user.id === userId
              ? {
                ...user,
                isActive: !user.isActive,
                status: !user.isActive ? 'Active' : 'Inactive'
              }
              : user
          )
        }));

        // Update in user details if modal is open
        if (userDetails && userDetails.id === userId) {
          setUserDetails(prev => ({
            ...prev,
            isActive: !prev.isActive,
            status: !prev.isActive ? 'Active' : 'Inactive'
          }));
        }

        showMessageModal(
          'success',
          'Status Updated',
          responseData.message || 'User status updated successfully',
          userDetails?.email || ''
        );
      }
    } catch (err) {
      console.error('Error toggling user status:', err);
      if (isMounted.current) {
        showMessageModal('error', 'Error', 'Failed to update user status');
      }
    } finally {
      if (isMounted.current) {
        setActionLoading(false);
        setTogglingUserId(null);
      }
    }
  };

  // Reset user password
  const handleResetPassword = async (userId, userEmail) => {
    try {
      setActionLoading(true);
      setResettingUserId(userId);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/users/${userId}/reset_user_password/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      const responseData = await response.json();

      if (isMounted.current && responseData.success) {
        showMessageModal(
          'success',
          'Password Reset',
          responseData.message || 'Password reset email sent successfully',
          userEmail
        );
      } else if (isMounted.current) {
        throw new Error(responseData.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      if (isMounted.current) {
        showMessageModal('error', 'Error', err.message || 'Failed to reset password');
      }
    } finally {
      if (isMounted.current) {
        setActionLoading(false);
        setResettingUserId(null);
      }
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setLoadingDetails(true);
    await fetchUserDetails(user.id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setUserDetails(null);
  };

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-md shadow-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-900 m-0">
            {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Handle image error with fallback
  const handleImageError = (e, user) => {
    e.target.onerror = null;
    e.target.style.display = 'none';
    const parent = e.target.parentElement;
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold text-sm';
    fallbackDiv.textContent = user.initials;
    parent.appendChild(fallbackDiv);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-3 border-purple-200 border-t-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 m-0">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-800 text-2xl font-semibold m-0">
          Dashboard
        </h1>

        <div className="flex items-center gap-3">
          {lastFetch && (
            <span className="text-gray-600 text-sm flex items-center gap-1">
              <FiCalendar size={13} />
              Last updated: {lastFetch}
            </span>
          )}
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FiRefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3.5 rounded-xl mb-5 border border-red-500 flex justify-between items-center text-sm">
          <span>{error}</span>
          <button
            onClick={() => fetchAnalytics(true)}
            className="bg-red-600 text-white border-none px-3.5 py-1.5 rounded-md cursor-pointer text-sm font-medium hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <Icon size={20} className={stat.iconColor} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">
                {stat.label}
              </p>
              <h3 className="text-[28px] font-bold text-gray-900 m-0">
                {stat.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-[1.5fr_1fr] gap-4 mb-6">
        {/* Users Overview - Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                Users Overview
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {totalUsers.toLocaleString()}
                </span>
                {totalUsers > 0 && (
                  <span className="text-sm text-green-600 font-medium">
                    +12.5%
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setTimeFilter(timeFilter === 'Monthly' ? 'Weekly' : 'Monthly')}
              className="bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white border-none px-4 py-2 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              {timeFilter}
              <FiChevronDown size={14} />
            </button>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6A026A', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6A026A', fontSize: 11 }}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f3e8ff', opacity: 0.3 }} />
                <Bar
                  dataKey="count"
                  fill="#6A026A"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-gray-400">
              No chart data available
            </div>
          )}
        </div>

        {/* User Distribution - Donut Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-semibold text-gray-900 m-0">
              User Distribution
            </h3>
          </div>

          {totalUsers > 0 ? (
            <>
              <div className="relative mb-5">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <defs>
                      <linearGradient id="freeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6A026A" />
                        <stop offset="100%" stopColor="#FF00FF" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? 'url(#freeGradient)' : '#eab308'}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <h2 className="text-4xl font-bold text-gray-900 m-0">
                    {freePercentage}%
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-[#6A026A] to-[#FF00FF]" />
                    <span className="text-sm text-gray-500 font-medium">
                      Free Users
                    </span>
                  </div>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {freeUsers.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500" />
                    <span className="text-sm text-gray-500 font-medium">
                      Premium Users
                    </span>
                  </div>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {premiumUsers.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-gray-400">
              No user data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_2.5fr_1.3fr_1.2fr_1fr_0.8fr] px-6 py-4 bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white text-sm font-semibold">
          <div>Profile</div>
          <div>Email</div>
          <div>Subscription</div>
          <div>Usage Count</div>
          <div>Status</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Table Rows */}
        {recentUsers.length > 0 ? (
          recentUsers.map((user, index) => (
            <div
              key={user.id || index}
              className={`grid grid-cols-[2fr_2.5fr_1.3fr_1.2fr_1fr_0.8fr] px-6 py-4 items-center text-sm ${index < recentUsers.length - 1 ? 'border-b border-gray-200' : ''
                }`}
            >
              <div className="flex items-center gap-3">
                {user.full_image_url ? (
                  <div className="relative w-9 h-9">
                    <img
                      src={user.full_image_url}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        // Show fallback div
                        const parent = e.target.parentElement;
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.className = 'w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold text-sm';
                        fallbackDiv.textContent = user.initials;
                        parent.appendChild(fallbackDiv);
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold text-sm">
                    {user.initials}
                  </div>
                )}
                <span className="text-gray-900 font-medium">
                  {user.name || 'User'}
                </span>
              </div>

              <div className="text-gray-500 truncate">
                {user.email}
              </div>

              <div>
                <span className={`${user.subscription === 'Premium'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white'
                  } px-3 py-1 rounded-md text-xs font-semibold inline-block`}>
                  {user.subscription}
                </span>
              </div>

              <div className="text-gray-900 font-medium">
                {user.usage_count}
              </div>

              <div>
                <span className={`${user.status === 'Active'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
                  } px-3 py-1 rounded-md text-xs font-semibold inline-block`}>
                  {user.status}
                </span>
              </div>

              <div className="flex gap-2 justify-center items-center">
                <button
                  onClick={() => handleViewUser(user)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-100 transition-all"
                  title="View Details"
                >
                  <FiEye size={16} />
                </button>
                <button
                  onClick={() => handleToggleStatus(user.id)}
                  disabled={actionLoading && togglingUserId === user.id}
                  className={`p-1.5 rounded-md transition-all ${user.status === 'Active'
                      ? 'text-red-400 hover:text-red-600 hover:bg-red-100'
                      : 'text-green-400 hover:text-green-600 hover:bg-green-100'
                    } ${actionLoading && togglingUserId === user.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                >
                  {actionLoading && togglingUserId === user.id ? (
                    <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  ) : (
                    <FiPower size={16} />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="m-0 text-sm">No recent users found</p>
          </div>
        )}

        {/* Footer */}
        {recentUsers.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right">
            <a
              href="/users"
              className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors"
            >
              View All Users →
            </a>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-2xl w-full relative shadow-xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading State */}
            {loadingDetails ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full border-3 border-purple-200 border-t-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading user details...</p>
              </div>
            ) : userDetails && (
              <>
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
                >
                  <FiX size={20} />
                </button>

                {/* Status Badges */}
                <div className="mb-6 flex justify-center gap-2 flex-wrap">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${userDetails.subscription === 'Premium'
                      ? 'bg-yellow-100 text-yellow-600 border border-yellow-200'
                      : 'bg-purple-100 text-purple-600 border border-purple-200'
                    }`}>
                    {userDetails.subscription}
                  </span>
                  {userDetails.isStaff && (
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-600 border border-blue-200">
                      Staff
                    </span>
                  )}
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${userDetails.isActive
                      ? 'bg-green-100 text-green-600 border border-green-200'
                      : 'bg-red-100 text-red-600 border border-red-200'
                    }`}>
                    {userDetails.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative w-32 h-32 mx-auto">
                      {userDetails.fullImageUrl ? (
                        <img
                          src={userDetails.fullImageUrl}
                          alt={userDetails.name}
                          className="w-full h-full rounded-full object-cover border-4 border-purple-100"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = 'w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-4xl font-bold border-4 border-purple-100';
                            fallbackDiv.textContent = userDetails.name.charAt(0).toUpperCase();
                            parent.appendChild(fallbackDiv);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-4xl font-bold border-4 border-purple-100">
                          {userDetails.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-3 border-white ${userDetails.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {userDetails.name}
                    </h2>
                    <p className="text-gray-500 mb-4">{userDetails.email}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-purple-600 mb-1 font-medium">Usage Count</p>
                        <p className="text-lg font-bold text-purple-700">{userDetails.usage}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600 mb-1 font-medium">Status</p>
                        <p className={`text-lg font-bold ${userDetails.isActive ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {userDetails.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-xs text-gray-500 mb-1 font-medium">User ID</p>
                      <p className="text-sm font-medium text-gray-900">{userDetails.id}</p>
                    </div>
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-xs text-gray-500 mb-1 font-medium">Date Joined</p>
                      <p className="text-sm font-medium text-gray-900">{userDetails.dateJoined}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-xs text-gray-500 mb-1 font-medium">Last Login</p>
                      <p className="text-sm font-medium text-gray-900">{userDetails.lastLogin}</p>
                    </div>
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-xs text-gray-500 mb-1 font-medium">Account Type</p>
                      <p className="text-sm font-medium text-gray-900">
                        {userDetails.isStaff ? 'Staff Account' : 'Regular User'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleToggleStatus(userDetails.id)}
                    disabled={actionLoading}
                    className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${userDetails.isActive
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                      } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {actionLoading && resettingUserId !== userDetails.id ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {userDetails.isActive ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                        {userDetails.isActive ? 'Deactivate User' : 'Activate User'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleResetPassword(userDetails.id, userDetails.email)}
                    disabled={actionLoading}
                    className={`py-3 px-4 bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${actionLoading && resettingUserId === userDetails.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {actionLoading && resettingUserId === userDetails.id ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiKey size={16} />
                        Reset Password
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Success/Error Message Modal */}
      {messageModal.show && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={closeMessageModal}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeMessageModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <FiX size={18} />
            </button>

            {/* Icon */}
            <div className="text-center mb-4">
              {messageModal.type === 'success' ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className={`text-xl font-bold text-center mb-2 ${messageModal.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
              {messageModal.title}
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center mb-4">
              {messageModal.message}
            </p>

            {/* User Email (if available) */}
            {messageModal.userEmail && (
              <p className="text-sm text-gray-500 text-center mb-6 bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">Email:</span> {messageModal.userEmail}
              </p>
            )}

            {/* OK Button */}
            <button
              onClick={closeMessageModal}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${messageModal.type === 'success'
                  ? 'bg-gradient-to-r from-[#6A026A] to-[#FF00FF] hover:opacity-90'
                  : 'bg-red-600 hover:bg-red-700'
                }`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;