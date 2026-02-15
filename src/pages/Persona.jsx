import React, { useState, useEffect } from 'react';
import { Trash2, Plus, X, Edit2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PersonasLimits = () => {
  const { tokens } = useAuth();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  // Personas states
  const [personas, setPersonas] = useState([]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [newPersonaName, setNewPersonaName] = useState('');
  const [newPersonaDescription, setNewPersonaDescription] = useState('');
  const [personaActive, setPersonaActive] = useState(true);

  // Message modal states
  const [messageModal, setMessageModal] = useState({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Fetch personas from API
  const fetchPersonas = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/personas/`,
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
        const formattedPersonas = responseData.data.results.map(persona => ({
          id: persona.id,
          name: persona.name,
          description: persona.description,
          isActive: persona.is_active,
          createdAt: new Date(persona.created_at).toLocaleString(),
          updatedAt: new Date(persona.updated_at).toLocaleString()
        }));
        setPersonas(formattedPersonas);
      }
    } catch (err) {
      console.error('Error fetching personas:', err);
      showMessageModal('error', 'Error', 'Failed to load personas');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (tokens?.access_token) {
      fetchPersonas();
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

  // Create new persona
  const handleCreatePersona = async () => {
    if (newPersonaName.trim() === '') {
      showMessageModal('error', 'Validation Error', 'Please enter a persona name');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/personas/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newPersonaName,
            description: newPersonaDescription || 'Add your persona description here',
            is_active: personaActive
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create persona');
      }

      const responseData = await response.json();

      if (responseData.success) {
        showMessageModal('success', 'Success', 'Persona created successfully');
        await fetchPersonas(); // Refresh personas
        handleCloseAddModal();
      }
    } catch (err) {
      console.error('Error creating persona:', err);
      showMessageModal('error', 'Error', err.message || 'Failed to create persona');
    } finally {
      setSaving(false);
    }
  };

  // Update persona
  const handleUpdatePersona = async () => {
    if (!selectedPersona) return;

    if (newPersonaName.trim() === '') {
      showMessageModal('error', 'Validation Error', 'Please enter a persona name');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/personas/${selectedPersona.id}/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${tokens?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newPersonaName,
            description: newPersonaDescription,
            is_active: personaActive
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update persona');
      }

      const responseData = await response.json();

      if (responseData.success) {
        showMessageModal('success', 'Success', 'Persona updated successfully');
        await fetchPersonas(); // Refresh personas
        handleCloseEditModal();
      }
    } catch (err) {
      console.error('Error updating persona:', err);
      showMessageModal('error', 'Error', err.message || 'Failed to update persona');
    } finally {
      setSaving(false);
    }
  };

  // Delete persona
  const handleDeletePersona = async (id) => {
    if (!window.confirm('Are you sure you want to delete this persona?')) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/personas/${id}/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${tokens?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete persona');
      }

      const responseData = await response.json();

      if (responseData.success) {
        showMessageModal('success', 'Success', responseData.message || 'Persona deleted successfully');
        await fetchPersonas(); // Refresh personas
      }
    } catch (err) {
      console.error('Error deleting persona:', err);
      showMessageModal('error', 'Error', err.message || 'Failed to delete persona');
    }
  };

  // Toggle persona active status
  const handleTogglePersona = async (persona) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/personas/${persona.id}/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${tokens?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            is_active: !persona.isActive
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to toggle persona status');
      }

      const responseData = await response.json();

      if (responseData.success) {
        await fetchPersonas(); // Refresh personas
      }
    } catch (err) {
      console.error('Error toggling persona:', err);
      showMessageModal('error', 'Error', err.message || 'Failed to toggle persona status');
    }
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setNewPersonaName('');
    setNewPersonaDescription('');
    setPersonaActive(true);
    setShowAddModal(true);
  };

  // Close add modal
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewPersonaName('');
    setNewPersonaDescription('');
    setPersonaActive(true);
  };

  // Open edit modal
  const handleOpenEditModal = (persona) => {
    setSelectedPersona(persona);
    setNewPersonaName(persona.name);
    setNewPersonaDescription(persona.description);
    setPersonaActive(persona.isActive);
    setShowEditModal(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPersona(null);
    setNewPersonaName('');
    setNewPersonaDescription('');
    setPersonaActive(true);
  };

  // Refresh all data
  const handleRefresh = async () => {
    setLoading(true);
    await fetchPersonas();
    setLoading(false);
  };

  if (loading && personas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-3 border-purple-200 border-t-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading personas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Personas</h1>
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

      {/* Personas Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Personas & Limits
          </h2>
          <button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Add Persona
          </button>
        </div>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className="bg-white p-5 rounded-xl shadow-sm flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {persona.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {persona.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    Updated: {new Date(persona.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                {/* Toggle Switch */}
                <button
                  onClick={() => handleTogglePersona(persona)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${persona.isActive ? 'bg-gradient-to-r from-[#6A026A] to-[#FF00FF]' : 'bg-gray-300'
                    }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${persona.isActive ? 'left-7' : 'left-1'
                      }`}
                  />
                </button>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(persona)}
                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-100 rounded-md transition-all"
                    title="Edit Persona"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeletePersona(persona.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-all"
                    title="Delete Persona"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Personas Message */}
        {personas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No personas found. Click "Add Persona" to create one.</p>
          </div>
        )}
      </div>

      {/* Add Persona Modal */}
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
              <h2 className="text-xl font-bold text-gray-900">Add New Persona</h2>
              <button
                onClick={handleCloseAddModal}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Persona Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Persona Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Customer Support"
                value={newPersonaName}
                onChange={(e) => setNewPersonaName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe the persona..."
                value={newPersonaDescription}
                onChange={(e) => setNewPersonaDescription(e.target.value)}
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
                    checked={personaActive}
                    onChange={(e) => setPersonaActive(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${personaActive ? 'bg-gradient-to-r from-[#6A026A] to-[#FF00FF]' : 'bg-gray-300'
                    }`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${personaActive ? 'left-7' : 'left-1'
                      }`} />
                  </div>
                </div>
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCreatePersona}
                disabled={saving}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Persona'
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

      {/* Edit Persona Modal */}
      {showEditModal && selectedPersona && (
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
              <h2 className="text-xl font-bold text-gray-900">Edit Persona</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Persona Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Persona Name *
              </label>
              <input
                type="text"
                value={newPersonaName}
                onChange={(e) => setNewPersonaName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newPersonaDescription}
                onChange={(e) => setNewPersonaDescription(e.target.value)}
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
                    checked={personaActive}
                    onChange={(e) => setPersonaActive(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${personaActive ? 'bg-gradient-to-r from-[#6A026A] to-[#FF00FF]' : 'bg-gray-300'
                    }`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${personaActive ? 'left-7' : 'left-1'
                      }`} />
                  </div>
                </div>
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleUpdatePersona}
                disabled={saving}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#6A026A] to-[#FF00FF] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Persona'
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

export default PersonasLimits;