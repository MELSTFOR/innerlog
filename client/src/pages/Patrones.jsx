import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePatrones from '../hooks/usePatrones';
import PatternCard from '../components/PatternCard';
import BottomNav from '../components/BottomNav';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Patrones() {
  const navigate = useNavigate();
  const { patterns, loading, error, fetchPatterns } = usePatrones();

  useEffect(() => {
    fetchPatterns();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mt-6 mb-8 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg transition hover:opacity-80"
            style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#c9d1d9' }}>
              Mis Patrones
            </h1>
            <p style={{ color: '#8b92a4' }} className="text-sm mt-1">
              Últimos 30 días
            </p>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div 
            className="p-8 rounded-lg text-center"
            style={{ backgroundColor: '#1a1f2e', color: '#00d4ff' }}
          >
            <p>Analizando tus datos...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div 
            className="p-4 rounded-lg border mb-4"
            style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.3)' }}
          >
            <p style={{ color: '#ff6b6b' }} className="text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Patterns list */}
        {!loading && patterns.length > 0 && (
          <div>
            {patterns.map((pattern, idx) => (
              <PatternCard key={idx} pattern={pattern} />
            ))}
            
            {/* Info footer */}
            <div 
              className="p-4 rounded-lg text-center mt-8"
              style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
            >
              <p className="text-xs">
                Los patrones se actualizan con tus datos de wellness, tests cognitivos y sesiones de entrenamiento
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && patterns.length === 0 && !error && (
          <div 
            className="p-8 rounded-lg text-center"
            style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
          >
            <p>No hay suficientes datos para analizar patrones.</p>
            <p className="text-sm mt-2">Continúa registrando tus sesiones y wellness para que aparezcan.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
