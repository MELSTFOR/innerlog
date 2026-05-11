import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEntrenador from '../hooks/useEntrenador';
import BottomNav from '../components/BottomNav';
import { SparklesIcon, DocumentTextIcon, HeartIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function AtletaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { atletaHistorial, loading, fetchAtletaHistorial } = useEntrenador();
  const [activeTab, setActiveTab] = useState('tests');

  useEffect(() => {
    fetchAtletaHistorial(id);
  }, [id]);

  if (loading) {
    return (
      <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto p-4 mt-6 text-center" style={{ color: '#00d4ff' }}>
          Cargando...
        </div>
      </div>
    );
  }

  if (!atletaHistorial) {
    return (
      <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto p-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm mb-4"
            style={{ color: '#00d4ff' }}
          >
            ← Volver
          </button>
          <div
            className="text-center py-8 rounded-lg"
            style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
          >
            No pudimos cargar los datos del atleta
          </div>
        </div>
      </div>
    );
  }

  const { atleta, tests, sesiones, wellness } = atletaHistorial;

  const TabButton = ({ tab, label, Icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className="flex-1 py-3 font-semibold transition border-b-2 flex items-center justify-center gap-2"
      style={{
        borderBottomColor: activeTab === tab ? '#00d4ff' : '#30363d',
        color: activeTab === tab ? '#00d4ff' : '#8b92a4',
      }}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: '#30363d' }}>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg transition hover:opacity-80"
              style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
              title="Ir al Inicio"
            >
              <HomeIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(-1)}
              className="text-sm"
              style={{ color: '#00d4ff' }}
            >
              ← Volver
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#c9d1d9' }}>
            {atleta.nombre}
          </h1>
          <p style={{ color: '#8b92a4' }}>
            {atleta.deporte} • {atleta.nivel}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: '#30363d' }}>
          <TabButton tab="tests" label="Tests Cognitivos" Icon={SparklesIcon} />
          <TabButton tab="sesiones" label="Sesiones" Icon={DocumentTextIcon} />
          <TabButton tab="wellness" label="Wellness" Icon={HeartIcon} />
        </div>

        <div className="p-4">
          {/* Tests Tab */}
          {activeTab === 'tests' && (
            <div>
              {tests.length === 0 ? (
                <p style={{ color: '#8b92a4' }} className="text-center py-8">
                  Sin tests realizados
                </p>
              ) : (
                <div className="space-y-3">
                  {tests.map((test) => (
                    <div
                      key={test.id}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: '#1a1f2e' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold" style={{ color: '#c9d1d9' }}>
                            {test.tipo_test.toUpperCase()}
                          </p>
                          <p style={{ color: '#8b92a4' }} className="text-sm">
                            {formatDate(test.timestamp)}
                          </p>
                        </div>
                        <p
                          className="text-2xl font-bold"
                          style={{
                            color: test.precision > 85 ? '#31eb96' : test.precision > 70 ? '#ffd93d' : '#ff6b6b',
                          }}
                        >
                          {test.precision}%
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div
                          className="p-2 rounded"
                          style={{ backgroundColor: '#0f1117' }}
                        >
                          <p style={{ color: '#8b92a4' }} className="text-xs">
                            TR Promedio
                          </p>
                          <p style={{ color: '#c9d1d9' }} className="font-semibold">
                            {formatTime(test.tr_medio)}
                          </p>
                        </div>
                        <div
                          className="p-2 rounded"
                          style={{ backgroundColor: '#0f1117' }}
                        >
                          <p style={{ color: '#8b92a4' }} className="text-xs">
                            Duración
                          </p>
                          <p style={{ color: '#c9d1d9' }} className="font-semibold">
                            {formatTime(test.duracion)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sesiones Tab */}
          {activeTab === 'sesiones' && (
            <div>
              {sesiones.length === 0 ? (
                <p style={{ color: '#8b92a4' }} className="text-center py-8">
                  Sin sesiones registradas
                </p>
              ) : (
                <div className="space-y-3">
                  {sesiones.map((sesion) => (
                    <div
                      key={sesion.id}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: '#1a1f2e' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p style={{ color: '#8b92a4' }} className="text-sm">
                          {formatDate(sesion.timestamp)}
                        </p>
                        <p
                          className="text-xl font-bold"
                          style={{
                            color: sesion.satisfaccion > 7 ? '#31eb96' : sesion.satisfaccion > 5 ? '#ffd93d' : '#ff6b6b',
                          }}
                        >
                          ★ {sesion.satisfaccion}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="text-sm" style={{ color: '#8b92a4' }}>
                          <p>Esfuerzo: <span style={{ color: '#c9d1d9' }}>{sesion.esfuerzo_mental}/10</span></p>
                          <p>Enfoque: <span style={{ color: '#c9d1d9' }}>{sesion.enfoque}/10</span></p>
                          <p>Emocional: <span style={{ color: '#c9d1d9' }}>{sesion.emocional}/10</span></p>
                        </div>
                        <div className="text-sm" style={{ color: '#8b92a4' }}>
                          <p>Fatiga Carrera: <span style={{ color: '#c9d1d9' }}>{sesion.fatiga_carrera}/10</span></p>
                          <p>Fatiga Día Siguiente: <span style={{ color: '#c9d1d9' }}>{sesion.fatiga_dia_siguiente}/10</span></p>
                        </div>
                      </div>

                      {sesion.notas && (
                        <p
                          style={{
                            color: '#8b92a4',
                            borderTopColor: '#30363d',
                          }}
                          className="text-sm italic border-t pt-2"
                        >
                          "{sesion.notas}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wellness Tab */}
          {activeTab === 'wellness' && (
            <div>
              {wellness.length === 0 ? (
                <p style={{ color: '#8b92a4' }} className="text-center py-8">
                  Sin registros de wellness
                </p>
              ) : (
                <div className="space-y-3">
                  {wellness.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: '#1a1f2e' }}
                    >
                      <p style={{ color: '#8b92a4' }} className="text-sm mb-3">
                        {formatDate(entry.timestamp)}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span style={{ color: '#8b92a4' }}>Fatiga</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded"
                                style={{
                                  backgroundColor: i < entry.fatiga ? '#a371f7' : '#30363d',
                                }}
                              />
                            ))}
                          </div>
                          <span style={{ color: '#c9d1d9' }}>{entry.fatiga}/5</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span style={{ color: '#8b92a4' }}>Sueño</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded"
                                style={{
                                  backgroundColor: i < entry.sueno ? '#58a6ff' : '#30363d',
                                }}
                              />
                            ))}
                          </div>
                          <span style={{ color: '#c9d1d9' }}>{entry.sueno}/5</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span style={{ color: '#8b92a4' }}>Dolor</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded"
                                style={{
                                  backgroundColor: i < entry.dolor ? '#ff6b6b' : '#30363d',
                                }}
                              />
                            ))}
                          </div>
                          <span style={{ color: '#c9d1d9' }}>{entry.dolor}/5</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span style={{ color: '#8b92a4' }}>Estrés</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded"
                                style={{
                                  backgroundColor: i < entry.estres ? '#ffd93d' : '#30363d',
                                }}
                              />
                            ))}
                          </div>
                          <span style={{ color: '#c9d1d9' }}>{entry.estres}/5</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
