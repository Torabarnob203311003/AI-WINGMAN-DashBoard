import React, { useState } from 'react';
import { Eye, Trash2, ChevronDown } from 'lucide-react';

const Users = () => {
  const [subscriptionFilter, setSubscriptionFilter] = useState('Premium');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [sortBy, setSortBy] = useState('Most Active');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const users = [
    {
      id: 1,
      name: 'MD. Rahim',
      email: 'mostafo@gmail.com',
      subscription: 'Premium',
      usage: 34,
      status: 'Active',
      joinDate: '12/10/2025',
    },
    {
      id: 2,
      name: 'Roni Roy',
      email: 'mostafo@gmail.com',
      subscription: 'Premium',
      usage: 50,
      status: 'Active',
      joinDate: '12/10/2025',
    },
    {
      id: 3,
      name: 'Roni Roy',
      email: 'mostafo@gmail.com',
      subscription: 'Premium',
      usage: 50,
      status: 'Inactive',
      joinDate: '12/10/2025',
    },
    {
      id: 4,
      name: 'Roni Roy',
      email: 'mostafo@gmail.com',
      subscription: 'Free',
      usage: 50,
      status: 'Active',
      joinDate: '12/10/2025',
    },
    {
      id: 5,
      name: 'Roni Roy',
      email: 'mostafo@gmail.com',
      subscription: 'Premium',
      usage: 50,
      status: 'Active',
      joinDate: '12/10/2025',
    },
    {
      id: 6,
      name: 'Roni Roy',
      email: 'mostafo@gmail.com',
      subscription: 'Premium',
      usage: 50,
      status: 'Active',
      joinDate: '12/10/2025',
    },
    {
      id: 7,
      name: 'Roni Roy',
      email: 'mostafo@gmail.com',
      subscription: 'Premium',
      usage: 50,
      status: 'Active',
      joinDate: '12/10/2025',
    },
  ];

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const getStatusBgColor = (status) => {
    if (status === 'Active') return '#d1fae5';
    if (status === 'Inactive') return '#fee2e2';
    return '#f3f4f6';
  };

  const getStatusTextColor = (status) => {
    if (status === 'Active') return '#047857';
    if (status === 'Inactive') return '#dc2626';
    return '#374151';
  };

  const getSubscriptionBgColor = (subscription) => {
    if (subscription === 'Premium') return '#fef3c7';
    if (subscription === 'Free') return '#f3e8ff';
    return '#e0e7ff';
  };

  const getSubscriptionTextColor = (subscription) => {
    if (subscription === 'Premium') return '#92400e';
    if (subscription === 'Free') return '#6b21a8';
    return '#3730a3';
  };

  return (
    <div
      style={{
        background: '#f9fafb',
        minHeight: '100vh',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#1f2937', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          Users
        </h1>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Subscription Filter */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
            }}
          >
            Subscription
          </label>
          <button
            onClick={() =>
              setSubscriptionFilter(
                subscriptionFilter === 'Premium' ? 'Free' : 'Premium'
              )
            }
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: 'white',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              color: '#374151',
              fontWeight: '500',
            }}
          >
            {subscriptionFilter}
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Status Filter */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
            }}
          >
            Status
          </label>
          <button
            onClick={() =>
              setStatusFilter(statusFilter === 'Active' ? 'Inactive' : 'Active')
            }
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: 'white',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              color: '#374151',
              fontWeight: '500',
            }}
          >
            {statusFilter}
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Sort By */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
            }}
          >
            Sort By
          </label>
          <button
            onClick={() =>
              setSortBy(
                sortBy === 'Most Active' ? 'Least Active' : 'Most Active'
              )
            }
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: 'white',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              color: '#374151',
              fontWeight: '500',
            }}
          >
            {sortBy}
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Table Header */}
        <div
          style={{
            background: 'linear-gradient(90deg, #a21caf 0%, #e91e63 100%)',
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 0.8fr',
            gap: '16px',
            padding: '16px 24px',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <div>Profile</div>
          <div>Email</div>
          <div>Subscription</div>
          <div>Usage Count</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* Table Rows */}
        {users.map((user, index) => (
          <div
            key={user.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 0.8fr',
              gap: '16px',
              padding: '16px 24px',
              borderBottom: index !== users.length - 1 ? '1px solid #e5e7eb' : 'none',
              alignItems: 'center',
              background: index % 2 === 0 ? '#ffffff' : '#f9fafb',
            }}
          >
            {/* Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                {user.name.charAt(0)}
              </div>
              <span style={{ fontWeight: '500', color: '#1f2937', fontSize: '14px' }}>
                {user.name}
              </span>
            </div>

            {/* Email */}
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {user.email}
            </div>

            {/* Subscription */}
            <div
              style={{
                display: 'inline-block',
                background: getSubscriptionBgColor(user.subscription),
                color: getSubscriptionTextColor(user.subscription),
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                border: `1px solid ${getSubscriptionTextColor(user.subscription)}20`,
              }}
            >
              {user.subscription}
            </div>

            {/* Usage Count */}
            <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
              {user.usage}
            </div>

            {/* Status */}
            <div
              style={{
                display: 'inline-block',
                background: getStatusBgColor(user.status),
                color: getStatusTextColor(user.status),
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                border: `1px solid ${getStatusTextColor(user.status)}20`,
              }}
            >
              {user.status}
            </div>

            {/* Action */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start' }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  transition: 'color 0.2s',
                }}
                onClick={() => handleViewUser(user)}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#6b7280')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
              >
                <Eye size={18} />
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#ef4444')}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={closeModal}
        >
          {/* Modal Content */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '40px 32px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
              position: 'relative',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '4px 8px',
                lineHeight: '1',
              }}
              type="button"
            >
              ×
            </button>

            {/* Premium Badge */}
            <div style={{ marginBottom: '16px' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: '1px solid #fcd34d',
                }}
              >
                {selectedUser?.subscription}
              </span>
            </div>

            {/* Profile Avatar */}
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '40px',
                fontWeight: 'bold',
                margin: '0 auto 16px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                position: 'relative',
              }}
            >
              {selectedUser?.name.charAt(0)}
              <div
                style={{
                  position: 'absolute',
                  width: '16px',
                  height: '16px',
                  background: '#10b981',
                  border: '3px solid white',
                  borderRadius: '50%',
                  bottom: '0',
                  right: '0',
                }}
              />
            </div>

            {/* Name */}
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 8px 0',
              }}
            >
              {selectedUser?.name}
            </h2>

            {/* Email */}
            <p
              style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 24px 0',
              }}
            >
              {selectedUser?.email}
            </p>

            {/* Info Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '28px',
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '12px',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '0 0 8px 0',
                    fontWeight: '500',
                  }}
                >
                  Join date
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: 0,
                  }}
                >
                  {selectedUser?.joinDate}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '0 0 8px 0',
                    fontWeight: '500',
                  }}
                >
                  Usage Count
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: 0,
                  }}
                >
                  {selectedUser?.usage}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(90deg, #a21caf 0%, #e91e63 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                type="button"
              >
                Reset Password
              </button>
              <button
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#fecdd3',
                  color: '#dc2626',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                type="button"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;