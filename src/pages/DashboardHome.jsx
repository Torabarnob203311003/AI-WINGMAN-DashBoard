import React, { useState } from 'react';
import { Eye, Trash2, ChevronDown } from 'lucide-react';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('Monthly');

  const users = [
    {
      id: 1,
      name: 'Roni Roy',
      email: 'mostafo@gmail.com',
      subscription: 'Premium',
      usage: 50,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Roni Roy',
      email: 'mostafo@gmail.com',
      subscription: 'Premium',
      usage: 50,
      status: 'Active',
    },
  ];

  const chartData = [
    { month: 'Jan', value: 12 },
    { month: 'Feb', value: 15 },
    { month: 'Mar', value: 18 },
    { month: 'Apr', value: 16 },
    { month: 'May', value: 14 },
    { month: 'Jun', value: 24 },
    { month: 'Jul', value: 20 },
    { month: 'Aug', value: 13 },
    { month: 'Sep', value: 15 },
    { month: 'Oct', value: 14 },
    { month: 'Nov', value: 12 },
    { month: 'Dec', value: 10 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div
      style={{
        // background: 'linear-gradient(90deg, #6A026A 0%, #FF00FF 129%)',
        minHeight: '100vh',
        padding: '4px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: 'Black', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
          Dashboard
        </h1>
      </div>

      {/* Top Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {[
          { label: 'Total Users', value: '4,370', change: '+12.5%', icon: '👤' },
          { label: 'Active Today', value: '950', change: '+12.5%', icon: '🟢' },
          { label: 'Premium Users', value: '4,370', change: '+12.5%', icon: '💎' },
          { label: 'Conversion Rate', value: '4,370', change: '+12.5%', icon: '⭐' },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#999', margin: '0 0 8px 0', fontSize: '14px' }}>
                  {stat.label}
                </p>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold' }}>
                  {stat.value}
                </h3>
                <p style={{ color: '#22c55e', margin: 0, fontSize: '12px', fontWeight: '500' }}>
                  {stat.change}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Chart Section */}
        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>
                Users Overview
              </h3>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#000' }}>
                5,2035 <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: '500' }}>+12.5%</span>
              </p>
            </div>
            <button
              style={{
                background: '#a21caf',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onClick={() => setTimeFilter(timeFilter === 'Monthly' ? 'Weekly' : 'Monthly')}
            >
              {timeFilter} <ChevronDown size={16} />
            </button>
          </div>

          {/* Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', gap: '8px' }}>
            {chartData.map((data, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div
                  style={{
                    background: data.month === 'Jun' ? '#a21caf' : '#e5e7eb',
                    width: '100%',
                    height: `${(data.value / maxValue) * 150}px`,
                    borderRadius: '4px',
                    transition: 'background 0.3s',
                  }}
                />
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                  {data.month}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart Section */}
        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', width: '100%' }}>
            Users Overview
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 'bold', color: '#000' }}>
            5,2035 <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: '500' }}>+12.5%</span>
          </p>

          {/* Donut Chart */}
          <svg viewBox="0 0 100 100" style={{ width: '150px', height: '150px', margin: '16px 0' }}>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#a21caf"
              strokeWidth="12"
              strokeDasharray="247.6 352"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#d4af37"
              strokeWidth="12"
              strokeDasharray="104.4 352"
              strokeDashoffset="-247.6"
              strokeLinecap="round"
            />
            <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="bold">
              88%
            </text>
          </svg>

          {/* Legend */}
          <div style={{ width: '100%', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: '#a21caf',
                }}
              />
              <span style={{ fontSize: '12px', color: '#666' }}>Free: 15768</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: '#d4af37',
                }}
              />
              <span style={{ fontSize: '12px', color: '#666' }}>Premium: 4,568</span>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Table Header */}
        <div
          style={{
            background: '#a21caf',
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
            gap: '16px',
            padding: '16px 24px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
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
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
              gap: '16px',
              padding: '16px 24px',
              borderBottom: '1px solid #e5e7eb',
              alignItems: 'center',
            }}
          >
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
                }}
              >
                {user.name.charAt(0)}
              </div>
              <span style={{ fontWeight: '500' }}>{user.name}</span>
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>{user.email}</div>
            <div
              style={{
                display: 'inline-block',
                background: '#fef3c7',
                color: '#92400e',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
              }}
            >
              {user.subscription}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>{user.usage}</div>
            <div
              style={{
                display: 'inline-block',
                background: '#d1fae5',
                color: '#047857',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
              }}
            >
              {user.status}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                }}
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
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;