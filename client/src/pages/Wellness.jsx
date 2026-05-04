import { useState, useEffect } from 'react';
import useWellness from '../hooks/useWellness';
import BottomNav from '../components/BottomNav';

export default function Wellness() {
  const { createWellness, fetchWellnessToday, wellnessToday, loading } = useWellness();

  const [formData, setFormData] = useState({
    fatiga: 3,
    sueno: 3,
    dolor: 3,
    estres: 3,
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadWellnessToday();
  }, []);

  const loadWellnessToday = async () => {
    const data = await fetchWellnessToday();
    if (data) {
      setFormData({
        fatiga: data.fatiga,
        sueno: data.sueno,
        dolor: data.dolor,
        estres: data.estres,
      });
    }
  };

  const handleSliderChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: parseInt(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const result = await createWellness(formData);

    if (result.success) {
      setSuccess('¡Wellness guardado exitosamente!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error);
    }

    setSaving(false);
  };

  const WellnessSlider = ({ label, value, onChange, description1, description5 }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium" style={{ color: '#c9d1d9' }}>
          {label}
        </label>
        <span className="text-lg font-semibold" style={{ color: '#00d4ff' }}>
          {value}/5
        </span>
      </div>
      <div className="flex justify-between text-xs mb-2" style={{ color: '#8b92a4' }}>
        <span>{description1}</span>
        <span>{description5}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={onChange}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          backgroundColor: '#30363d',
          background: `linear-gradient(to right, #00d4ff 0%, #00d4ff ${((value - 1) / 4) * 100}%, #30363d ${((value - 1) / 4) * 100}%, #30363d 100%)`,
        }}
      />
    </div>
  );

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2 mt-6" style={{ color: '#00d4ff' }}>
          Check-in Wellness
        </h1>
        <p className="mb-6" style={{ color: '#8b92a4' }}>
          Evalúa tu estado físico y mental hoy
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

        {wellnessToday && (
          <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded-lg text-sm" style={{ color: '#58a6ff' }}>
            Ya completaste tu check-in de hoy. Puedes actualizar los valores.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
            <WellnessSlider
              label="Fatiga"
              value={formData.fatiga}
              onChange={(e) => handleSliderChange('fatiga', e.target.value)}
              description1="Muy fatigado"
              description5="Muy recuperado"
            />

            <WellnessSlider
              label="Sueño"
              value={formData.sueno}
              onChange={(e) => handleSliderChange('sueno', e.target.value)}
              description1="Insomnio"
              description5="Muy relajante"
            />

            <WellnessSlider
              label="Dolor Muscular"
              value={formData.dolor}
              onChange={(e) => handleSliderChange('dolor', e.target.value)}
              description1="Muy dolorido"
              description5="Muy buenas sensaciones"
            />

            <WellnessSlider
              label="Estrés"
              value={formData.estres}
              onChange={(e) => handleSliderChange('estres', e.target.value)}
              description1="Muy estresado"
              description5="Muy relajado"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-lg font-semibold transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#00d4ff', color: '#0f1117' }}
          >
            {saving ? 'Guardando...' : 'Guardar Check-in'}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
