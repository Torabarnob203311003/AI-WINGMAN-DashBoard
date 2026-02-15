import React, { useState, useEffect } from 'react';
import {
  FiUsers, FiActivity, FiTrendingUp, FiRefreshCw,
  FiChevronDown, FiCalendar, FiEye, FiTrash2
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
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Stats cards configuration - using real API data
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

  // Chart data - using only real API data
  const chartData = apiData.chartData.length > 0 ? apiData.chartData : [];

  const totalUsers = apiData.totalUsers || 0;
  const freeUsers = apiData.freeUsers || 0;
  const premiumUsers = apiData.premiumUsers || 0;

  // Pie data with real values
  const pieData = [
    { name: 'Free', value: freeUsers },
    { name: 'Premium', value: premiumUsers },
  ];

  const users = apiData.users.length > 0 ? apiData.users : [];

  const freePercentage = totalUsers > 0 ? Math.round((freeUsers / totalUsers) * 100) : 0;

  // Fetch data function
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
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

      // Handle the nested data structure
      if (response_data.success && response_data.data) {
        const apiPayload = response_data.data;

        let chartData = [];
        if (apiPayload.graph_data && Array.isArray(apiPayload.graph_data)) {
          chartData = apiPayload.graph_data.map(item => ({
            month: item.month || 'N/A',
            count: parseInt(item.count || 0) || 0
          }));
        }

        setApiData({
          totalUsers: parseInt(apiPayload.total_users || 0) || 0,
          activeToday: parseInt(apiPayload.active_today || 0) || 0,
          premiumUsers: parseInt(apiPayload.premium_users || 0) || 0,
          conversionRate: parseFloat(apiPayload.conversion_rate || 0) || 0,
          freeUsers: parseInt(apiPayload.free_users || 0) || 0,
          chartData: chartData,
          users: Array.isArray(apiPayload.users) ? apiPayload.users : [],
        });
        setLastFetch(new Date().toLocaleTimeString());
      } else {
        throw new Error('Invalid API response format');
      }

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-3 border-purple-200 border-t-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white m-0">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black text-2xl font-semibold m-0">
          Dashboard
        </h1>

        <div className="flex items-center gap-3">
          {lastFetch && (
            <span className="text-black text-sm flex items-center gap-1">
              <FiCalendar size={13} />
              Last updated: {lastFetch}
            </span>
          )}
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FiRefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3.5 rounded-xl mb-5 border border-red-500 flex justify-between items-center text-sm">
          <span>{error}</span>
          <button
            onClick={fetchAnalytics}
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

        {/* User Distribution - Donut Chart with Gradient */}
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

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header - Purple gradient background */}
        <div className="grid grid-cols-[2fr_2.5fr_1.3fr_1.2fr_1fr_0.8fr] px-6 py-4 bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white text-sm font-semibold">
          <div>Profile</div>
          <div>Email</div>
          <div>Subscription</div>
          <div>Usage Count</div>
          <div>Status</div>
          <div className="text-center">Action</div>
        </div>

        {/* Table Rows */}
        {users.length > 0 ? (
          users.map((user, index) => (
            <div
              key={index}
              className={`grid grid-cols-[2fr_2.5fr_1.3fr_1.2fr_1fr_0.8fr] px-6 py-4 items-center text-sm ${index < users.length - 1 ? 'border-b border-gray-200' : ''
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold text-sm">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-gray-900 font-medium">
                  {user.name || 'User'}
                </span>
              </div>

              <div className="text-gray-500">
                {user.email || 'N/A'}
              </div>

              <div>
                <span className={`${user.subscription === 'Premium'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white'
                  } px-3 py-1 rounded-md text-xs font-semibold inline-block`}>
                  {user.subscription || 'Free'}
                </span>
              </div>

              <div className="text-gray-900 font-medium">
                {user.usage || 0}
              </div>

              <div>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-md text-xs font-semibold inline-block">
                  {user.status || 'Active'}
                </span>
              </div>

              <div className="flex gap-2 justify-center items-center">
                <button className="bg-transparent border-none cursor-pointer text-gray-400 p-1.5 rounded-md flex items-center justify-center transition-all hover:bg-purple-100 hover:text-purple-600">
                  <FiEye size={16} />
                </button>
                <button className="bg-transparent border-none cursor-pointer text-gray-400 p-1.5 rounded-md flex items-center justify-center transition-all hover:bg-red-100 hover:text-red-600">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="m-0 text-sm">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;