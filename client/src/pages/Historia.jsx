import { useState, useEffect } from 'react';
import useSesiones from '../hooks/useSesiones';
import Slider from '../components/Slider';
import BottomNav from '../components/BottomNav';

export default function Historia() {
  const { sesiones, fetchSesiones, loading, updateSesion } = useSesiones();
  const [selectedSesion, setSelectedSesion] = useState(null);
  const [editFatiga, setEditFatiga] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSesiones();
  }, []);

  const handleEditFatiga = (sesion) => {
    setSelectedSesion(sesion);
    setEditFatiga(sesion.fatiga_dia_siguiente);
  };

  const handleSaveChanges = async () => {
    if (editFatiga === null || editFatiga === selectedSesion.fatiga_dia_siguiente) {
      setSelectedSesion(null);
      return;
    }

    setSaving(true);
    const result = await updateSesion(selectedSesion.id, {
      fatiga_dia_siguiente: editFatiga,
    });

    if (result.success) {
      setSuccess('¡Fatiga actualizada!');
      setTimeout(() => setSuccess(''), 2000);
    }

    setSaving(false);
    setSelectedSesion(null);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="pb-24 flex items-center justify-center" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
        <div style={{ color: '#00d4ff' }}>Cargando sesiones...</div>
      </div>
    );
  }

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2 mt-6" style={{ color: '#00d4ff' }}>
          Historial
        </h1>
        <p className="mb-6" style={{ color: '#8b92a4' }}>
          {sesiones.length} sesiones registradas
        </p>

        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg" style={{ color: '#31eb96' }}>
            {success}
          </div>
        )}

        {sesiones.length === 0 ? (
          <div
            className="p-8 rounded-lg text-center"
            style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
          >
            No hay sesiones registradas aún
          </div>
        ) : (
          <div className="space-y-4">
            {sesiones.map((sesion) => (
              <div
                key={sesion.id}
                className="p-4 rounded-lg cursor-pointer transition hover:opacity-80"
                style={{ backgroundColor: '#1a1f2e', borderLeft: '3px solid #00d4ff' }}
                onClick={() => handleEditFatiga(sesion)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold" style={{ color: '#c9d1d9' }}>
                      {formatDate(sesion.timestamp)}
                    </h3>
                    <p style={{ color: '#8b92a4', fontSize: '0.875rem' }}>
                      Satisfacción: {sesion.satisfaccion}/10
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span style={{ color: '#8b92a4' }}>Esfuerzo:</span>
                    <span className="ml-1" style={{ color: '#c9d1d9' }}>
                      {sesion.esfuerzo_mental}/10
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#8b92a4' }}>Enfoque:</span>
                    <span className="ml-1" style={{ color: '#c9d1d9' }}>
                      {sesion.enfoque}/10
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#8b92a4' }}>Fatiga carrera:</span>
                    <span className="ml-1" style={{ color: '#c9d1d9' }}>
                      {sesion.fatiga_carrera}/10
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#8b92a4' }}>Fatiga posterior:</span>
                    <span className="ml-1" style={{ color: '#c9d1d9' }}>
                      {sesion.fatiga_dia_siguiente}/10
                    </span>
                  </div>
                </div>

                {sesion.notas && (
                  <p
                    className="mt-2 text-sm italic"
                    style={{ color: '#8b92a4' }}
                  >
                    "{sesion.notas}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal de edición */}
        {selectedSesion && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSesion(null)}
          >
            <div
              className="rounded-lg p-6 max-w-md w-full"
              style={{ backgroundColor: '#1a1f2e' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4" style={{ color: '#c9d1d9' }}>
                Editar Fatiga al Día Siguiente
              </h2>

              <div className="mb-6">
                <Slider
                  label="Fatiga"
                  value={editFatiga}
                  onChange={(e) => setEditFatiga(parseInt(e.target.value))}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSesion(null)}
                  className="flex-1 py-2 rounded-lg font-semibold"
                  style={{
                    backgroundColor: '#30363d',
                    color: '#c9d1d9',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="flex-1 py-2 rounded-lg font-semibold transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#00d4ff', color: '#0f1117' }}
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
