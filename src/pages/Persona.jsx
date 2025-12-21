import React, { useState } from 'react';
import { Trash2, Plus, X } from 'lucide-react';

const PersonasLimits = () => {
  const [dailyFreeLimit, setDailyFreeLimit] = useState('10');
  const [maxChatLength, setMaxChatLength] = useState('1000');
  const [ocrLimit, setOcrLimit] = useState('5');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPersonaName, setNewPersonaName] = useState('');
  const [newPersonaDescription, setNewPersonaDescription] = useState('');
  const [personas, setPersonas] = useState([
    {
      id: 1,
      name: 'Professional',
      description: 'Formal and business-appropriate persona',
      enabled: false,
    },
    {
      id: 2,
      name: 'Casual',
      description: 'Relaxed and conversational persona',
      enabled: true,
    },
    {
      id: 3,
      name: 'Friendly',
      description: 'Warm and approachable persona',
      enabled: true,
    },
    {
      id: 4,
      name: 'Academic',
      description: 'Scholarly and technical persona',
      enabled: true,
    },
    {
      id: 5,
      name: 'Creative',
      description: 'Imaginative and expressive persona',
      enabled: true,
    },
    {
      id: 6,
      name: 'Concise',
      description: 'Brief and to-the-point persona',
      enabled: true,
    },
  ]);

  const handleTogglePersona = (id) => {
    setPersonas(
      personas.map((persona) =>
        persona.id === id ? { ...persona, enabled: !persona.enabled } : persona
      )
    );
  };

  const handleDeletePersona = (id) => {
    setPersonas(personas.filter((persona) => persona.id !== id));
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setNewPersonaName('');
    setNewPersonaDescription('');
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewPersonaName('');
    setNewPersonaDescription('');
  };

  const handleAddPersona = () => {
    if (newPersonaName.trim() === '') {
      alert('Please enter a persona name');
      return;
    }

    const newPersona = {
      id: Date.now(),
      name: newPersonaName,
      description: newPersonaDescription || 'Add your persona description here',
      enabled: true,
    };
    setPersonas([...personas, newPersona]);
    handleCloseAddModal();
  };

  const handleSave = () => {
    console.log({
      dailyFreeLimit,
      maxChatLength,
      ocrLimit,
      personas,
    });
    alert('Settings saved successfully!');
  };

  return (
    <div
      style={{
        background: '#f9fafb',
        minHeight: '100vh',
        padding: '32px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Free Users Tier Limits Section */}
      <div style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 24px 0',
          }}
        >
          Free users Tier Limits
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Daily Free Limit */}
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
              }}
            >
              Daily Free Limit
            </label>
            <input
              type="number"
              value={dailyFreeLimit}
              onChange={(e) => setDailyFreeLimit(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Max Chat Length */}
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
              }}
            >
              Max chat length
            </label>
            <input
              type="number"
              value={maxChatLength}
              onChange={(e) => setMaxChatLength(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* OCR Limit */}
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
              }}
            >
              OCR Limit
            </label>
            <input
              type="number"
              value={ocrLimit}
              onChange={(e) => setOcrLimit(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>

      {/* Personas & Limits Section */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0,
            }}
          >
            Personas & Limits
          </h2>
          <button
            onClick={handleOpenAddModal}
            style={{
              background: 'linear-gradient(90deg, #a21caf 0%, #e91e63 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            type="button"
          >
            <Plus size={18} />
            Add Persona
          </button>
        </div>

        {/* Personas Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {personas.map((persona) => (
            <div
              key={persona.id}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {persona.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      margin: 0,
                    }}
                  >
                    {persona.description}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto',
                  paddingTop: '12px',
                }}
              >
                {/* Toggle Switch */}
                <button
                  onClick={() => handleTogglePersona(persona.id)}
                  style={{
                    width: '50px',
                    height: '28px',
                    background: persona.enabled
                      ? 'linear-gradient(90deg, #a21caf 0%, #e91e63 100%)'
                      : '#d1d5db',
                    border: 'none',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.3s',
                    padding: 0,
                  }}
                  type="button"
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      background: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: persona.enabled ? '24px' : '2px',
                      transition: 'left 0.3s',
                    }}
                  />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeletePersona(persona.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px 8px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#ef4444')}
                  type="button"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div style={{ textAlign: 'right' }}>
          <button
            onClick={handleSave}
            style={{
              background: 'linear-gradient(90deg, #a21caf 0%, #e91e63 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 40px',
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
            Save
          </button>
        </div>
      </div>

      {/* Add Persona Modal */}
      {showAddModal && (
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
          onClick={handleCloseAddModal}
        >
          {/* Modal Content */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close Button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0,
                }}
              >
                Add Persona
              </h2>
              <button
                onClick={handleCloseAddModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px 8px',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                type="button"
              >
                <X size={24} />
              </button>
            </div>

            {/* Persona Name Input */}
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
                Persona name
              </label>
              <input
                type="text"
                placeholder="e.g., Customer Support"
                value={newPersonaName}
                onChange={(e) => setNewPersonaName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1f2937',
                  boxSizing: 'border-box',
                  backgroundColor: '#f9fafb',
                }}
              />
            </div>

            {/* Description Input */}
            <div style={{ marginBottom: '28px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                }}
              >
                Description
              </label>
              <textarea
                placeholder="Describe the persona..."
                value={newPersonaDescription}
                onChange={(e) => setNewPersonaDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1f2937',
                  boxSizing: 'border-box',
                  backgroundColor: '#f9fafb',
                  fontFamily: 'inherit',
                  minHeight: '100px',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-start',
              }}
            >
              <button
                onClick={handleAddPersona}
                style={{
                  background: 'linear-gradient(90deg, #a21caf 0%, #e91e63 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  minWidth: '120px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                type="button"
              >
                Save
              </button>
              <button
                onClick={handleCloseAddModal}
                style={{
                  background: '#f3f4f6',
                  color: '#1f2937',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  minWidth: '120px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                type="button"
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

export default PersonasLimits;