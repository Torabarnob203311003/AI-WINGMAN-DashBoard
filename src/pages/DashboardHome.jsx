import React, { useState, useEffect } from 'react';
import { Eye, Trash2, ChevronDown, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('Monthly');
  const [apiUrl] = useState('http://localhost:8000/dashboard/analytics/');
  const [apiData, setApiData] = useState({
    totalUsers: 0,
    activeToday: 0,
    premiumUsers: 0,
    conversionRate: 0,
    freeUsers: 0,
    chartData: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Fetch data function
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status} - ${response.statusText}`);
      }
      
      const response_data = await response.json();
      console.log('✅ Full API Response:', response_data);
      
      // Extract data from nested structure
      const apiPayload = response_data.data || response_data;
      console.log('📊 Extracted Payload:', apiPayload);
      
      // Safe chart data mapping
      let chartData = [];
      if (apiPayload.graph_data && Array.isArray(apiPayload.graph_data)) {
        chartData = apiPayload.graph_data.map(item => ({
          month: item.month || 'N/A',
          value: parseInt(item.count || item.value || 0) || 0
        }));
      }
      
      console.log('📈 Processed Chart Data:', chartData);
      
      // Safe data assignment
      const totalUsersValue = parseInt(apiPayload.total_users || 0) || 0;
      const freeUsersValue = parseInt(apiPayload.free_users || 0) || 0;
      
      const newData = {
        totalUsers: totalUsersValue,
        activeToday: parseInt(apiPayload.active_today || 0) || 0,
        premiumUsers: parseInt(apiPayload.premium_users || 0) || 0,
        conversionRate: parseFloat(apiPayload.conversion_rate || 0) || 0,
        freeUsers: freeUsersValue,
        chartData: chartData,
        users: Array.isArray(apiPayload.users) ? apiPayload.users : [],
      };
      
      console.log('💾 Setting API Data:', newData);
      setApiData(newData);
      setLastFetch(new Date().toLocaleTimeString());
      
    } catch (err) {
      console.error('❌ Error fetching analytics:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on component mount
  useEffect(() => {
    fetchAnalytics();
    
    // Optionally refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchAnalytics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Users', value: apiData.totalUsers, change: '+12.5%', icon: '👤' },
    { label: 'Active Today', value: apiData.activeToday, change: '+12.5%', icon: '🟢' },
    { label: 'Premium Users', value: apiData.premiumUsers, change: '+12.5%', icon: '💎' },
    { label: 'Conversion Rate', value: `${apiData.conversionRate}%`, change: '+12.5%', icon: '⭐' },
  ];

  const chartData = (apiData.chartData && apiData.chartData.length > 0) ? apiData.chartData : [];
  const maxValue = chartData.length > 0 ? Math.max(...chartData.map((d) => d.value || 0)) : 1;
  const users = (apiData.users && apiData.users.length > 0) ? apiData.users : [];

  const premiumCount = apiData.totalUsers - apiData.freeUsers;
  const piePercentage = apiData.totalUsers > 0 
    ? Math.round((premiumCount / apiData.totalUsers) * 100) 
    : 0;

  if (loading && !apiData.totalUsers) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f9fafb',
      }}>
        <div style={{ fontSize: '24px', color: '#666', marginBottom: '12px' }}>📊 Loading Dashboard...</div>
        <div style={{ fontSize: '12px', color: '#999' }}>Connecting to API: {apiUrl}</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f9fafb',
    }}>
      {/* Header with Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: 'Black', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
            Dashboard
          </h1>
          {lastFetch && (
            <p style={{ color: '#999', fontSize: '12px', margin: '8px 0 0 0' }}>
              Last updated: {lastFetch}
            </p>
          )}
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          style={{
            background: '#a21caf',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <RefreshCw size={16} /> {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#991b1b',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #fca5a5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '4px' }}>❌ Connection Error</p>
            <p style={{ margin: 0, fontSize: '12px' }}>{error}</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '11px', opacity: 0.8 }}>
              Make sure your Django server is running at: {apiUrl}
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            style={{
              background: '#991b1b',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Top Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
      }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#999', margin: '0 0 8px 0', fontSize: '14px' }}>
                  {stat.label}
                </p>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold', color: '#000' }}>
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        marginBottom: '32px',
      }}>
        {/* Chart Section */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>
                Users Overview
              </h3>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#000' }}>
                {apiData.totalUsers} <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: '500' }}>users</span>
              </p>
            </div>
            <button style={{
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
            }} onClick={() => setTimeFilter(timeFilter === 'Monthly' ? 'Weekly' : 'Monthly')}>
              {timeFilter} <ChevronDown size={16} />
            </button>
          </div>

          {/* Bar Chart */}
          {chartData.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', gap: '8px' }}>
              {chartData.map((data, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '40px' }}>
                  <div style={{
                    background: idx === chartData.length - 1 ? '#a21caf' : '#e5e7eb',
                    width: '100%',
                    height: `${Math.max((data.value / maxValue) * 150, 10)}px`,
                    borderRadius: '4px',
                    transition: 'background 0.3s',
                    cursor: 'pointer',
                  }} title={`${data.month}: ${data.value} users`}/>
                  <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#666', textAlign: 'center', wordBreak: 'break-word' }}>
                    {data.month}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              📊 No chart data available
            </div>
          )}
        </div>

        {/* Pie Chart Section */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', width: '100%' }}>
            User Types
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 'bold', color: '#000' }}>
            {apiData.totalUsers} <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: '500' }}>total</span>
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
              strokeDasharray={`${apiData.totalUsers > 0 ? (apiData.freeUsers / apiData.totalUsers) * 282.7 : 0} 282.7`}
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#d4af37"
              strokeWidth="12"
              strokeDasharray={`${apiData.totalUsers > 0 ? (premiumCount / apiData.totalUsers) * 282.7 : 0} 282.7`}
              strokeDashoffset={apiData.totalUsers > 0 ? -((apiData.freeUsers / apiData.totalUsers) * 282.7) : 0}
              strokeLinecap="round"
            />
            <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#333">
              {piePercentage}%
            </text>
          </svg>

          {/* Legend */}
          <div style={{ width: '100%', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: '#a21caf',
              }} />
              <span style={{ fontSize: '12px', color: '#666' }}>Free: {apiData.freeUsers}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: '#d4af37',
              }} />
              <span style={{ fontSize: '12px', color: '#666' }}>Premium: {premiumCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {users.length > 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{
            background: '#a21caf',
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
            gap: '16px',
            padding: '16px 24px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
          }}>
            <div>Profile</div>
            <div>Email</div>
            <div>Subscription</div>
            <div>Usage Count</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {users.map((user) => (
            <div key={user.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
              gap: '16px',
              padding: '16px 24px',
              borderBottom: '1px solid #e5e7eb',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span style={{ fontWeight: '500' }}>{user.name || 'N/A'}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>{user.email || 'N/A'}</div>
              <div style={{
                display: 'inline-block',
                background: '#fef3c7',
                color: '#92400e',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
              }}>
                {user.subscription || 'N/A'}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>{user.usage || 0}</div>
              <div style={{
                display: 'inline-block',
                background: '#d1fae5',
                color: '#047857',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
              }}>
                {user.status || 'N/A'}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Eye size={18} />
                </button>
                <button style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#999',
        }}>
          👥 No user data available
        </div>
      )}
    </div>
  );
};

export default Dashboard;