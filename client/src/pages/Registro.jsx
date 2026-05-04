import { useState, useEffect } from 'react';
import useSesiones from '../hooks/useSesiones';
import Slider from '../components/Slider';
import BottomNav from '../components/BottomNav';

export default function Registro() {
  const { createSesion, loading: creating } = useSesiones();

  const [formData, setFormData] = useState({
    esfuerzo_mental: 5,
    enfoque: 5,
    emocional: 5,
    fatiga_carrera: 5,
    fatiga_dia_siguiente: 5,
    satisfaccion: 5,
    notas: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSliderChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: parseInt(value),
    }));
  };

  const handleNotasChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      notas: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = await createSesion(formData);

    if (result.success) {
      setSuccess('¡Sesión guardada exitosamente!');
      // Resetear formulario
      setFormData({
        esfuerzo_mental: 5,
        enfoque: 5,
        emocional: 5,
        fatiga_carrera: 5,
        fatiga_dia_siguiente: 5,
        satisfaccion: 5,
        notas: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2 mt-6" style={{ color: '#00d4ff' }}>
          Registro de Sesión
        </h1>
        <p className="mb-6" style={{ color: '#8b92a4' }}>
          Evalúa tu entrenamiento de hoy
        </p>

        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg" style={{ color: '#31eb96' }}>
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg" style={{ color: '#ff6b6b' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: '#1a1f2e' }}
          >
            <Slider
              label="Esfuerzo Mental"
              value={formData.esfuerzo_mental}
              onChange={(e) => handleSliderChange('esfuerzo_mental', e.target.value)}
            />

            <Slider
              label="Enfoque"
              value={formData.enfoque}
              onChange={(e) => handleSliderChange('enfoque', e.target.value)}
            />

            <Slider
              label="Emocional"
              value={formData.emocional}
              onChange={(e) => handleSliderChange('emocional', e.target.value)}
            />

            <Slider
              label="Fatiga en Carrera"
              value={formData.fatiga_carrera}
              onChange={(e) => handleSliderChange('fatiga_carrera', e.target.value)}
            />

            <Slider
              label="Fatiga al Día Siguiente"
              value={formData.fatiga_dia_siguiente}
              onChange={(e) => handleSliderChange('fatiga_dia_siguiente', e.target.value)}
            />

            <Slider
              label="Satisfacción"
              value={formData.satisfaccion}
              onChange={(e) => handleSliderChange('satisfaccion', e.target.value)}
            />

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#c9d1d9' }}>
                Notas (opcional)
              </label>
              <textarea
                value={formData.notas}
                onChange={handleNotasChange}
                rows="4"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                style={{
                  backgroundColor: '#0f1117',
                  borderColor: '#30363d',
                  color: '#c9d1d9',
                }}
                placeholder="Cuéntanos cómo te sientes hoy..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-3 rounded-lg font-semibold transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#00d4ff', color: '#0f1117' }}
          >
            {creating ? 'Guardando...' : 'Guardar Sesión'}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
