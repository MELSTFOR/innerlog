import { useState, useEffect } from 'react';
import { PlayIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function SuggestedIntervention({ intervention, mensaje, onComplete, loading }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  if (!intervention) return null;

  const handleStartTimer = () => {
    const seconds = (intervention.duracion_minutos || 2) * 60;
    setTimeRemaining(seconds);
    setTimerActive(true);
  };

  const handleComplete = async () => {
    if (onComplete) {
      await onComplete(intervention.id);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="rounded-lg p-6 mb-6 border-2"
      style={{ backgroundColor: '#1a1f2e', borderColor: '#00d4ff' }}
    >
      {/* Header */}
      <div className="mb-4">
        <p style={{ color: '#8b92a4' }} className="text-xs uppercase tracking-wider mb-1">
          Intervención Prescrita
        </p>
        <h2 style={{ color: '#c9d1d9' }} className="text-2xl font-semibold mb-2">
          {intervention.titulo}
        </h2>
        {mensaje && (
          <p style={{ color: '#8b92a4' }} className="text-sm">
            {mensaje}
          </p>
        )}
      </div>

      {/* Descripción */}
      {intervention.descripcion && (
        <p 
          style={{ color: '#8b92a4', backgroundColor: '#0f1117' }} 
          className="text-sm mb-4 p-3 rounded"
        >
          {intervention.descripcion}
        </p>
      )}

      {/* Pasos */}
      {intervention.pasos && intervention.pasos.length > 0 && (
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#0f1117', borderLeft: '3px solid #00d4ff' }}>
          <p style={{ color: '#c9d1d9' }} className="text-xs uppercase tracking-wider font-semibold mb-3">
            Protocolo de Ejecución
          </p>
          <div className="space-y-2">
            {intervention.pasos.map((paso, idx) => (
              <div
                key={idx}
                className={`p-2 rounded flex items-start gap-2 transition ${
                  idx === currentStep ? 'bg-blue-900 bg-opacity-20' : ''
                }`}
              >
                <span
                  className="font-semibold text-xs min-w-fit"
                  style={{ color: idx <= currentStep ? '#00d4ff' : '#8b92a4' }}
                >
                  {idx + 1}.
                </span>
                <span
                  className="text-xs"
                  style={{ color: idx <= currentStep ? '#c9d1d9' : '#8b92a4' }}
                >
                  {paso.descripcion}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duración */}
      <div className="mb-6 p-3 rounded" style={{ backgroundColor: '#0f1117' }}>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ color: '#8b92a4' }} className="text-xs uppercase tracking-wider font-semibold mb-1">
              Tiempo Estimado
            </p>
            <p style={{ color: '#c9d1d9' }} className="text-lg font-semibold">
              {intervention.duracion_minutos} minutos
            </p>
          </div>
          {timerActive && (
            <div className="text-right">
              <p style={{ color: '#8b92a4' }} className="text-xs uppercase tracking-wider font-semibold mb-1">
                Tiempo Transcurrido
              </p>
              <p style={{ color: '#00d4ff' }} className="text-3xl font-bold font-mono">
                {formatTime(timeRemaining)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          onClick={handleStartTimer}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition hover:opacity-80"
          style={{ backgroundColor: '#00d4ff', color: '#0f1117' }}
        >
          <PlayIcon width={18} height={18} />
          Iniciar
        </button>
        <button
          onClick={handleComplete}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
          style={{
            backgroundColor: '#31eb96',
            color: '#0f1117',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          <CheckIcon width={18} height={18} />
          Completar
        </button>
        {timerActive && (
          <div style={{ color: '#00d4ff' }} className="font-mono font-bold text-lg ml-auto pt-2">
            {formatTime(timeRemaining)}
          </div>
        )}
      </div>
    </div>
  );
}
