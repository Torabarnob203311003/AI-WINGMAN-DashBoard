import React, { useState, useEffect } from 'react';
import { Trash2, Plus, X, Edit2, Save, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TonesLimits = () => {
  const { tokens } = useAuth();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Limits states
  const [dailyFreeLimit, setDailyFreeLimit] = useState('');
  const [maxChatLength, setMaxChatLength] = useState('');
  const [ocrLimit, setOcrLimit] = useState('');

  // Tones states
  const [tones, setTones] = useState([]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTone, setSelectedTone] = useState(null);
  const [newToneName, setNewToneName] = useState('');
  const [newToneDescription, setNewToneDescription] = useState('');
  const [toneActive, setToneActive] = useState(true);

  // Message modal states
  const [messageModal, setMessageModal] = useState({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Fetch limits from API
  const fetchLimits = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/limits/`,
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
        setDailyFreeLimit(responseData.data.daily_free_limit.toString());
        setMaxChatLength(responseData.data.max_chat_length.toString());
        setOcrLimit(responseData.data.ocr_limit.toString());
        setLastFetch(new Date(responseData.data.updated_at).toLocaleString());
      }
    } catch (err) {
      console.error('Error fetching limits:', err);
      showMessageModal('error', 'Error', 'Failed to load limits');
    }
  };

  // Fetch tones from API
  const fetchTones = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/tones/`,
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
        const formattedTones = responseData.data.results.map(tone => ({
          id: tone.id,
          name: tone.name,
          description: tone.description,
          isActive: tone.is_active,
          createdAt: new Date(tone.created_at).toLocaleString(),
          updatedAt: new Date(tone.updated_at).toLocaleString()
        }));
        setTones(formattedTones);
      }
    } catch (err) {
      console.error('Error fetching tones:', err);
      showMessageModal('error', 'Error', 'Failed to load tones');
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (tokens?.access_token) {
      const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchLimits(), fetchTones()]);
        setLoading(false);
      };
      fetchData();
    }
  }, [tokens]);

  // Show message modal
  const showMessageModal = (type, title, message) => {
    setMessageModal({
      show: true,
      type,
      title,
      message
    });
  };

  // Close message modal
  const closeMessageModal = () => {
    setMessageModal({
      show: false,
      type: 'success',
      title: '',
      message: ''
    });
  };

  // Update limits
  const handleUpdateLimits = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/limits/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            daily_free_limit: parseInt(dailyFreeLimit),
            max_chat_length: parseInt(maxChatLength),
            ocr_limit: parseInt(ocrLimit)
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update limits');
      }

      const responseData = await response.json();

      if (responseData.success) {
        showMessageModal('success', 'Success', responseData.message || 'Limits updated successfully');
        await fetchLimits(); // Refresh limits
      }
    } catch (err) {
      console.error('Error updating limits:', err);
      showMessageModal('error', 'Error', err.message || 'Failed to update limits');
    } finally {
      setSaving(false);
    }
  };

  // Create new tone
  const handleCreateTone = async () => {
    if (newToneName.trim() === '') {
      showMessageModal('error', 'Validation Error', 'Please enter a tone name');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/tones/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newToneName,
            description: newToneDescription || 'Add your tone description here',
            is_active: toneActive
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create tone');
      }

      const responseData = await response.json();

      if (responseData.success) {
        showMessageModal('success', 'Success', 'Tone created successfully');
        await fetchTones(); // Refresh tones
        handleCloseAddModal();
      }
    } catch (err) {
      console.error('Error creating tone:', err);
      showMessageModal('error', 'Error', err.message || 'Failed to create tone');
    } finally {
      setSaving(false);
    }
  };

  // Update tone
  const handleUpdateTone = async () => {
    if (!selectedTone) return;

    if (newToneName.trim() === '') {
      showMessageModal('error', 'Validation Error', 'Please enter a tone name');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/tones/${selectedTone.id}/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${tokens?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newToneName,
            description: newToneDescription,
            is_active: toneActive
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update tone');
      }

      const responseData = await response.json();

      if (responseData.success) {
        showMessageModal('success', 'Success', 'Tone updated successfully');
        await fetchTones(); // Refresh tones
        handleCloseEditModal();
      }
    } catch (err) {
      console.error('Error updating tone:', err);
      showMessageModal('error', 'Error', err.message || 'Failed to update tone');
    } finally {
      setSaving(false);
    }
  };

  // Delete tone
  const handleDeleteTone = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tone?')) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/tones/${id}/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${tokens?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete tone');
      }

      const responseData = await response.json();

      if (responseData.success) {
        showMessageModal('success', 'Success', responseData.message || 'Tone deleted successfully');
        await fetchTones(); // Refresh tones
      }
    } catch (err) {
      console.error('Error deleting tone:', err);
      showMessageModal('error', 'Error', err.message || 'Failed to delete tone');
    }
  };

  // Toggle tone active status
  const handleToggleTone = async (tone) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/tones/${tone.id}/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${tokens?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            is_active: !tone.isActive
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to toggle tone status');
      }

      const responseData = await response.json();

      if (responseData.success) {
        await fetchTones(); // Refresh tones
      }
    } catch (err) {
      console.error('Error toggling tone:', err);
      showMessageModal('error', 'Error', err.message || 'Failed to toggle tone status');
    }
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setNewToneName('');
    setNewToneDescription('');
    setToneActive(true);
    setShowAddModal(true);
  };

  // Close add modal
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewToneName('');
    setNewToneDescription('');
    setToneActive(true);
  };

  // Open edit modal
  const handleOpenEditModal = (tone) => {
    setSelectedTone(tone);
    setNewToneName(tone.name);
    setNewToneDescription(tone.description);
    setToneActive(tone.isActive);
    setShowEditModal(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedTone(null);
    setNewToneName('');
    setNewToneDescription('');
    setToneActive(true);
  };

  // Refresh all data
  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([fetchLimits(), fetchTones()]);
    setLoading(false);
  };

  if (loading && !dailyFreeLimit && tones.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-3 border-purple-200 border-t-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 border border-red-500 flex justify-between items-center text-sm">
          <span>Error: {error}</span>
          <button
            onClick={handleRefresh}
            className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Last Updated */}
      {lastFetch && (
        <div className="text-sm text-gray-500 mb-6">
          Last updated: {lastFetch}
        </div>
      )}

      {/* Free Users Tier Limits Section */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Free Users Tier Limits
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Daily Free Limit */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Daily Free Limit
            </label>
            <input
              type="number"
              value={dailyFreeLimit}
              onChange={(e) => setDailyFreeLimit(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
            />
          </div>

          {/* Max Chat Length */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Max Chat Length
            </label>
            <input
              type="number"
              value={maxChatLength}
              onChange={(e) => setMaxChatLength(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
            />
          </div>

          {/* OCR Limit */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              OCR Limit
            </label>
            <input
              type="number"
              value={ocrLimit}
              onChange={(e) => setOcrLimit(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
            />
          </div>
        </div>

        {/* Update Limits Button */}
        <div className="mt-4 text-right">
          <button
            onClick={handleUpdateLimits}
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 ml-auto"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={16} />
                Update Limits
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tones Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Tones
          </h2>
          <button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Add Tone
          </button>
        </div>

        {/* Tones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tones.map((tone) => (
            <div
              key={tone.id}
              className="bg-white p-5 rounded-xl shadow-sm flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {tone.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {tone.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    Updated: {new Date(tone.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                {/* Toggle Switch */}
                <button
                  onClick={() => handleToggleTone(tone)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${tone.isActive ? 'bg-gradient-to-r from-[#6A026A] to-[#FF00FF]' : 'bg-gray-300'
                    }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${tone.isActive ? 'left-7' : 'left-1'
                      }`}
                  />
                </button>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(tone)}
                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-100 rounded-md transition-all"
                    title="Edit Tone"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTone(tone.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-all"
                    title="Delete Tone"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Tones Message */}
        {tones.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No tones found. Click "Add Tone" to create one.</p>
          </div>
        )}
      </div>

      {/* Add Tone Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseAddModal}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-md w-full relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Tone</h2>
              <button
                onClick={handleCloseAddModal}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tone Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tone Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Professional"
                value={newToneName}
                onChange={(e) => setNewToneName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe the tone..."
                value={newToneDescription}
                onChange={(e) => setNewToneDescription(e.target.value)}
                rows="3"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Active Status Toggle */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={toneActive}
                    onChange={(e) => setToneActive(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${toneActive ? 'bg-gradient-to-r from-[#6A026A] to-[#FF00FF]' : 'bg-gray-300'
                    }`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${toneActive ? 'left-7' : 'left-1'
                      }`} />
                  </div>
                </div>
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCreateTone}
                disabled={saving}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Tone'
                )}
              </button>
              <button
                onClick={handleCloseAddModal}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tone Modal */}
      {showEditModal && selectedTone && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseEditModal}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-md w-full relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Tone</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tone Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tone Name *
              </label>
              <input
                type="text"
                value={newToneName}
                onChange={(e) => setNewToneName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newToneDescription}
                onChange={(e) => setNewToneDescription(e.target.value)}
                rows="3"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Active Status Toggle */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={toneActive}
                    onChange={(e) => setToneActive(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${toneActive ? 'bg-gradient-to-r from-[#6A026A] to-[#FF00FF]' : 'bg-gray-300'
                    }`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${toneActive ? 'left-7' : 'left-1'
                      }`} />
                  </div>
                </div>
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleUpdateTone}
                disabled={saving}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Tone'
                )}
              </button>
              <button
                onClick={handleCloseEditModal}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModal.show && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={closeMessageModal}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeMessageModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-4">
              {messageModal.type === 'success' ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>

            <h3 className={`text-lg font-bold text-center mb-2 ${messageModal.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
              {messageModal.title}
            </h3>

            <p className="text-gray-600 text-center mb-6">
              {messageModal.message}
            </p>

            <button
              onClick={closeMessageModal}
              className={`w-full py-2.5 rounded-lg text-white font-semibold transition-colors ${messageModal.type === 'success'
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

export default TonesLimits;