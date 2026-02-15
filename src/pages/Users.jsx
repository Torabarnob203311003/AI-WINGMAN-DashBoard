/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Eye, Trash2, ChevronDown, Search, ChevronLeft, ChevronRight, X, Power, UserCheck, UserX, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const { tokens } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('most_active');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);

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
    type: 'success', // 'success' or 'error'
    title: '',
    message: '',
    userEmail: ''
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('page_size', pageSize);

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/users/?${params.toString()}`,
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

      if (responseData.success && responseData.data) {
        const formattedUsers = responseData.data.results.map(user => ({
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
          isStaff: user.is_staff,
          lastLogin: user.last_login,
        }));

        setUsers(formattedUsers);
        setTotalCount(responseData.data.count);
        setTotalPages(Math.ceil(responseData.data.count / pageSize));
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manual filtering and sorting
  useEffect(() => {
    let result = [...users];

    // Apply subscription filter
    if (subscriptionFilter !== 'all') {
      result = result.filter(user =>
        user.subscription.toLowerCase() === subscriptionFilter.toLowerCase()
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user =>
        user.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'most_active':
        result.sort((a, b) => b.usage - a.usage);
        break;
      case 'least_active':
        result.sort((a, b) => a.usage - b.usage);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredUsers(result);
    setTotalPages(Math.ceil(result.length / pageSize));
    setTotalCount(result.length);
  }, [users, subscriptionFilter, statusFilter, sortBy]);

  useEffect(() => {
    if (tokens?.access_token) {
      fetchUsers();
    }
  }, [tokens, currentPage, searchTerm]);

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

      if (responseData.success && responseData.data) {
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
          isStaff: user.is_staff,
          lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : 'Never',
          dateJoined: new Date(user.date_joined).toLocaleString(),
          isPremium: user.is_premium,
        };

        setUserDetails(formattedUser);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      showMessageModal('error', 'Error', 'Failed to load user details');
    } finally {
      setLoadingDetails(false);
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

  // Toggle user status with immediate UI update
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

      if (responseData.success) {
        // Immediate UI update for users list
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId
              ? {
                ...user,
                isActive: !user.isActive,
                status: !user.isActive ? 'Active' : 'Inactive'
              }
              : user
          )
        );

        // Immediate UI update for user details if modal is open
        if (userDetails && userDetails.id === userId) {
          setUserDetails(prev => ({
            ...prev,
            isActive: !prev.isActive,
            status: !prev.isActive ? 'Active' : 'Inactive'
          }));
        }

        // Show success message
        showMessageModal(
          'success',
          'Status Updated',
          responseData.message || 'User status updated successfully',
          userDetails?.email || ''
        );
      }
    } catch (err) {
      console.error('Error toggling user status:', err);
      showMessageModal('error', 'Error', 'Failed to update user status');
    } finally {
      setActionLoading(false);
      setTogglingUserId(null);
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

      if (responseData.success) {
        // Show success message with the email from response
        showMessageModal(
          'success',
          'Password Reset',
          responseData.message || 'Password reset email sent successfully',
          userEmail
        );
      } else {
        throw new Error(responseData.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      showMessageModal('error', 'Error', err.message || 'Failed to reset password');
    } finally {
      setActionLoading(false);
      setResettingUserId(null);
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

  // Get current page users
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  };

  // Filter options
  const subscriptionOptions = [
    { value: 'all', label: 'All Subscriptions' },
    { value: 'premium', label: 'Premium' },
    { value: 'free', label: 'Free' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const sortOptions = [
    { value: 'most_active', label: 'Most Active' },
    { value: 'least_active', label: 'Least Active' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name_asc', label: 'Name (A to Z)' },
    { value: 'name_desc', label: 'Name (Z to A)' },
  ];

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-3 border-purple-200 border-t-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Users</h1>
        {totalCount > 0 && (
          <p className="text-sm text-gray-600">Total Users: {totalCount}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 border border-red-500 flex justify-between items-center text-sm">
          <span>Error: {error}</span>
          <button
            onClick={fetchUsers}
            className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm">
        {/* Subscription Filter */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Subscription
          </label>
          <div className="relative">
            <select
              value={subscriptionFilter}
              onChange={(e) => {
                setSubscriptionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              {subscriptionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Status
          </label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Sort By
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_2.5fr_1.2fr_1fr_1fr_0.8fr] gap-4 px-6 py-4 bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white text-sm font-semibold">
          <div>Profile</div>
          <div>Email</div>
          <div>Subscription</div>
          <div>Usage Count</div>
          <div>Status</div>
          <div className="text-center">Action</div>
        </div>

        {/* Table Rows */}
        {getCurrentPageUsers().length > 0 ? (
          getCurrentPageUsers().map((user, index) => (
            <div
              key={user.id}
              className={`grid grid-cols-[2fr_2.5fr_1.2fr_1fr_1fr_0.8fr] gap-4 px-6 py-4 items-center text-sm ${index < getCurrentPageUsers().length - 1 ? 'border-b border-gray-100' : ''
                } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              {/* Profile */}
              <div className="flex items-center gap-3">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium text-gray-900">
                  {user.name}
                </span>
              </div>

              {/* Email */}
              <div className="text-gray-500 truncate">
                {user.email}
              </div>

              {/* Subscription */}
              <div>
                <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${user.subscription === 'Premium'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-purple-100 text-purple-600'
                  }`}>
                  {user.subscription}
                </span>
              </div>

              {/* Usage Count */}
              <div className="font-medium text-gray-900">
                {user.usage}
              </div>

              {/* Status */}
              <div>
                <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${user.status === 'Active'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                  }`}>
                  {user.status}
                </span>
              </div>

              {/* Action */}
              <div className="flex gap-2 justify-center items-center">
                <button
                  onClick={() => handleViewUser(user)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-100 transition-all"
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleToggleStatus(user.id)}
                  disabled={actionLoading && togglingUserId === user.id}
                  className={`p-1.5 rounded-md transition-all ${user.status === 'Active'
                      ? 'text-red-400 hover:text-red-600 hover:bg-red-100'
                      : 'text-green-400 hover:text-green-600 hover:bg-green-100'
                    } ${actionLoading && togglingUserId === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                >
                  {actionLoading && togglingUserId === user.id ? (
                    <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  ) : (
                    <Power size={16} />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="text-sm">No users found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{' '}
            of <span className="font-medium">{totalCount}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-md border ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-purple-50 hover:border-purple-300'
                } transition-colors`}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 py-1.5 bg-purple-50 text-purple-600 rounded-md font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-md border ${currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-purple-50 hover:border-purple-300'
                } transition-colors`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

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
                  <X size={20} />
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
                      {userDetails.profileImage ? (
                        <img
                          src={userDetails.profileImage}
                          alt={userDetails.name}
                          className="w-full h-full rounded-full object-cover border-4 border-purple-100"
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
                      } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {actionLoading && resettingUserId !== userDetails.id ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {userDetails.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
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
                        <Key size={16} />
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
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="text-center mb-4">
              {messageModal.type === 'success' ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-600" />
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

export default Users;