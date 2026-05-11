import { useState } from 'react';
import api from '../utils/api';
import { CheckIcon } from '@heroicons/react/24/outline';

export default function AssignInterventionForm({ athleteId, athleteName, onAssigned }) {
  const [selectedType, setSelectedType] = useState('recuperacion');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const interventionTypes = {
    respiracion: {
      label: 'Respiración y Enfoque',
      descripcion: 'Técnicas de respiración para mejorar concentración',
      duracion: 2
    },
    activacion: {
      label: 'Activación Muscular',
      descripcion: 'Protocolo de calentamiento dinámico',
      duracion: 5
    },
    recuperacion: {
      label: 'Recuperación Post-Entrenamiento',
      descripcion: 'Protocolo de cierre para facilitar recuperación',
      duracion: 5
    }
  };

  const handleAssign = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.post(`/intervenciones/asignar`, {
        atleta_id: athleteId,
        tipo: selectedType
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onAssigned?.();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al asignar intervención');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e', border: '1px solid #30363d' }}>
      <h4 style={{ color: '#c9d1d9' }} className="font-semibold mb-3">
        Asignar Intervención a {athleteName}
      </h4>

      <div className="mb-4">
        <label style={{ color: '#8b92a4' }} className="text-xs uppercase tracking-wider font-semibold mb-2 block">
          Tipo de Intervención
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          disabled={loading}
          className="w-full p-2 rounded text-sm"
          style={{
            backgroundColor: '#0f1117',
            color: '#c9d1d9',
            border: '1px solid #30363d',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {Object.entries(interventionTypes).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label} ({value.duracion} min)
            </option>
          ))}
        </select>
      </div>

      {interventionTypes[selectedType] && (
        <div className="mb-4 p-2 rounded text-xs" style={{ backgroundColor: '#0f1117', color: '#8b92a4' }}>
          {interventionTypes[selectedType].descripcion}
        </div>
      )}

      {error && (
        <p style={{ color: '#ff6b6b' }} className="text-xs mb-3">
          {error}
        </p>
      )}

      {success && (
        <div className="flex items-center gap-2 mb-3 p-2 rounded" style={{ backgroundColor: 'rgba(49, 235, 150, 0.1)' }}>
          <CheckIcon width={16} height={16} style={{ color: '#31eb96' }} />
          <p style={{ color: '#31eb96' }} className="text-xs">
            Intervención asignada exitosamente
          </p>
        </div>
      )}

      <button
        onClick={handleAssign}
        disabled={loading}
        className="w-full py-2 rounded-lg font-semibold transition text-sm"
        style={{
          backgroundColor: '#00d4ff',
          color: '#0f1117',
          opacity: loading ? 0.5 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Asignando...' : 'Asignar Intervención'}
      </button>
    </div>
  );
}
