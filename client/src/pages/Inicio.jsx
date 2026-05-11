import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import useReadiness from '../hooks/useReadiness';
import useIntervenciones from '../hooks/useIntervenciones';
import BottomNav from '../components/BottomNav';
import ReadinessWidget from '../components/ReadinessWidget';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, HeartIcon, DocumentTextIcon, UserGroupIcon, ArrowLeftOnRectangleIcon, ChartBarIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function Inicio() {
  const { user, logout } = useAuth();
  const { readiness, trend, loading, fetchReadinessToday, fetchTrend } = useReadiness();
  const { suggestedIntervention, fetchSuggestedIntervention, completeIntervention, loading: interventionLoading, prescribedInterventions, fetchPrescribedInterventions } = useIntervenciones();
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [activeAtletaTab, setActiveAtletaTab] = useState('condicion');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReadinessToday();
    fetchTrend();
    fetchSuggestedIntervention();
    if (user?.rol === 'atleta') {
      fetchPrescribedInterventions();
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'green':
        return '#31eb96';
      case 'yellow':
        return '#ffd93d';
      case 'red':
        return '#ff6b6b';
      default:
        return '#00d4ff';
    }
  };

  const today = new Date();
  const dayName = today.toLocaleDateString('es-ES', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  const chartData = trend && trend.length > 0 ? trend.map((item) => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    score: item.score,
  })) : [];

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mt-6 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: '#c9d1d9' }}>
              Hola, {user?.nombre?.split(' ')[0]}
            </h1>
            {user?.equipo && (
              <p className="mb-2" style={{ color: '#00d4ff' }}>
                {user.equipo}
              </p>
            )}
            <p style={{ color: '#8b92a4' }}>
              {dayName.charAt(0).toUpperCase() + dayName.slice(1)}, {dateStr}
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg transition hover:opacity-80"
              style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
              title="Ir al Inicio"
            >
              <HomeIcon className="w-6 h-6" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg transition hover:opacity-80"
              style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
              title="Cerrar Sesión"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PANEL PSICÓLOGO DEPORTIVO */}
        {user?.rol === 'psicologo_deportivo' && (
          <>
            {/* Panel Principal */}
            <div className="mb-8 p-6 rounded-lg border-2" style={{ backgroundColor: '#1a1f2e', borderColor: '#00d4ff' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#c9d1d9' }}>
                    Dashboard Psicólogo
                  </h2>
                  <p style={{ color: '#8b92a4' }} className="text-sm">
                    Gestiona a tus atletas
                  </p>
                </div>
                <UserGroupIcon className="w-10 h-10" style={{ color: '#00d4ff' }} />
              </div>
              <button
                onClick={() => navigate('/psicologo')}
                className="w-full py-3 px-4 rounded-lg font-semibold transition hover:opacity-80"
                style={{ backgroundColor: '#00d4ff', color: '#0f1117' }}
              >
                Ir a Mis Atletas
              </button>
            </div>

            {/* Accesos Rápidos */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#c9d1d9' }}>
                Accesos Rápidos
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => navigate('/comunidad')}
                  className="p-4 rounded-lg flex items-center gap-3 transition hover:opacity-80"
                  style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d', borderWidth: '1px' }}
                >
                  <UserGroupIcon className="w-8 h-8" style={{ color: '#00d4ff' }} />
                  <div className="text-left flex-1">
                    <p className="font-medium" style={{ color: '#c9d1d9' }}>Comunidad</p>
                    <p className="text-xs" style={{ color: '#8b92a4' }}>Interactúa con tu equipo</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* PANEL ATLETA */}
        {user?.rol === 'atleta' && (
          <>
            {/* Tabs */}
            <div className="flex justify-center gap-2 mb-6 border-b" style={{ borderColor: '#30363d' }}>
              <button
                onClick={() => setActiveAtletaTab('condicion')}
                className="py-3 px-4 font-semibold transition whitespace-nowrap border-b-2"
                style={{
                  borderBottomColor: activeAtletaTab === 'condicion' ? '#00d4ff' : '#30363d',
                  color: activeAtletaTab === 'condicion' ? '#00d4ff' : '#8b92a4',
                }}
              >
                Mi Condición
              </button>
              <button
                onClick={() => setActiveAtletaTab('evolucion')}
                className="py-3 px-4 font-semibold transition whitespace-nowrap border-b-2"
                style={{
                  borderBottomColor: activeAtletaTab === 'evolucion' ? '#00d4ff' : '#30363d',
                  color: activeAtletaTab === 'evolucion' ? '#00d4ff' : '#8b92a4',
                }}
              >
                Evolución
              </button>
              <button
                onClick={() => setActiveAtletaTab('accesos')}
                className="py-3 px-4 font-semibold transition whitespace-nowrap border-b-2"
                style={{
                  borderBottomColor: activeAtletaTab === 'accesos' ? '#00d4ff' : '#30363d',
                  color: activeAtletaTab === 'accesos' ? '#00d4ff' : '#8b92a4',
                }}
              >
                Accesos
              </button>
            </div>

            {/* Contenido de Tabs */}
            <div className="mb-8">
              {/* Tab: Mi Condición */}
              {activeAtletaTab === 'condicion' && (
                <>
                  {/* Widget de Condición Física */}
                  {!loading && readiness ? (
                    <div className="mb-6">
                      <ReadinessWidget readiness={readiness?.readiness || 0} status={readiness?.status || 'red'} />
                    </div>
                  ) : (
                    <div className="mb-6 p-8 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e', color: '#00d4ff' }}>
                      Calculando condición...
                    </div>
                  )}

                  {/* Info Scores */}
                  {readiness?.scores && (
                    <div className="mb-6 grid grid-cols-3 gap-3">
                      <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e' }}>
                        <p style={{ color: '#8b92a4' }} className="text-xs mb-1">
                          Wellness
                        </p>
                        <p className="text-2xl font-bold" style={{ color: '#00d4ff' }}>
                          {readiness?.scores?.wellness || 0}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e' }}>
                        <p style={{ color: '#8b92a4' }} className="text-xs mb-1">
                          Cognitivo
                        </p>
                        <p className="text-2xl font-bold" style={{ color: '#a371f7' }}>
                          {readiness?.scores?.cognitivo || 0}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e' }}>
                        <p style={{ color: '#8b92a4' }} className="text-xs mb-1">
                          Sesión
                        </p>
                        <p className="text-2xl font-bold" style={{ color: '#58a6ff' }}>
                          {readiness?.scores?.sesion || 0}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Intervenciones Prescritas */}
                  <div className="p-6 rounded-lg border-2" style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d' }}>
                    <label style={{ color: '#8b92a4' }} className="text-sm block mb-3">
                      Intervención Prescrita
                    </label>
                    {prescribedInterventions?.length > 0 ? (
                      <div>
                        <select
                          value={selectedIntervention ? selectedIntervention.id : ''}
                          onChange={(e) => {
                            const id = parseInt(e.target.value);
                            const intervention = prescribedInterventions.find(i => i.id === id);
                            setSelectedIntervention(intervention);
                          }}
                          className="w-full p-2 rounded mb-3"
                          style={{ 
                            backgroundColor: '#0f1117',
                            color: '#c9d1d9',
                            borderColor: '#30363d',
                            border: '1px solid #30363d'
                          }}
                        >
                          <option value="">Selecciona una intervención</option>
                          {prescribedInterventions.map((interv) => (
                            <option key={interv.id} value={interv.id}>
                              {interv.titulo} {interv.completada ? '✓' : ''}
                            </option>
                          ))}
                        </select>

                        {selectedIntervention && (
                          <div className="p-4 rounded" style={{ backgroundColor: '#0f1117' }}>
                            <h4 className="font-semibold mb-2" style={{ color: '#c9d1d9' }}>
                              {selectedIntervention.titulo}
                            </h4>
                            <p style={{ color: '#8b92a4' }} className="text-sm mb-3">
                              {selectedIntervention.descripcion}
                            </p>
                            <div className="flex justify-between items-center text-sm">
                              <span style={{ color: '#8b92a4' }}>
                                Duración: <span style={{ color: '#c9d1d9' }}>{selectedIntervention.duracion_minutos} min</span>
                              </span>
                              <span style={{ color: selectedIntervention.completada ? '#31eb96' : '#ffd93d' }}>
                                {selectedIntervention.completada ? '✓ Completada' : 'Pendiente'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p style={{ color: '#8b92a4' }} className="italic text-center py-4">
                        No se asignaron intervenciones
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Tab: Evolución */}
              {activeAtletaTab === 'evolucion' && (
                <div className="p-6 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                  {chartData.length > 0 ? (
                    <>
                      <h3 className="text-lg font-semibold mb-4" style={{ color: '#c9d1d9' }}>
                        Evolución de Condición Física
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                          <XAxis
                            dataKey="fecha"
                            stroke="#8b92a4"
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis
                            stroke="#8b92a4"
                            domain={[0, 100]}
                            style={{ fontSize: '12px' }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f1117',
                              border: '1px solid #30363d',
                              borderRadius: '8px',
                            }}
                            labelStyle={{ color: '#c9d1d9' }}
                            formatter={(value) => [value, 'Readiness']}
                            wrapperStyle={{ outline: 'none' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#00d4ff"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#00d4ff' }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <p style={{ color: '#8b92a4' }} className="text-center py-8">
                      Sin datos de evolución
                    </p>
                  )}
                </div>
              )}

              {/* Tab: Accesos */}
              {activeAtletaTab === 'accesos' && (
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate('/patrones')}
                      className="p-4 rounded-lg flex flex-col items-center gap-2 transition hover:opacity-80"
                      style={{ backgroundColor: '#1a1f2e', borderColor: '#00d4ff', borderWidth: '1px' }}
                    >
                      <ChartBarIcon className="w-6 h-6" style={{ color: '#00d4ff' }} />
                      <span className="text-xs font-medium text-center" style={{ color: '#c9d1d9' }}>
                        Mis Patrones
                      </span>
                    </button>
                    <button
                      onClick={() => navigate('/tests')}
                      className="p-4 rounded-lg flex flex-col items-center gap-2 transition hover:opacity-80"
                      style={{ backgroundColor: '#1a1f2e' }}
                    >
                      <SparklesIcon className="w-6 h-6" style={{ color: '#00d4ff' }} />
                      <span className="text-xs font-medium text-center" style={{ color: '#c9d1d9' }}>
                        Test Cognitivo
                      </span>
                    </button>
                    <button
                      onClick={() => navigate('/wellness')}
                      className="p-4 rounded-lg flex flex-col items-center gap-2 transition hover:opacity-80"
                      style={{ backgroundColor: '#1a1f2e' }}
                    >
                      <HeartIcon className="w-6 h-6" style={{ color: '#00d4ff' }} />
                      <span className="text-xs font-medium text-center" style={{ color: '#c9d1d9' }}>
                        Wellness
                      </span>
                    </button>
                    <button
                      onClick={() => navigate('/registro')}
                      className="p-4 rounded-lg flex flex-col items-center gap-2 transition hover:opacity-80"
                      style={{ backgroundColor: '#1a1f2e' }}
                    >
                      <DocumentTextIcon className="w-6 h-6" style={{ color: '#00d4ff' }} />
                      <span className="text-xs font-medium text-center" style={{ color: '#c9d1d9' }}>
                        Registrar Sesión
                      </span>
                    </button>
                    <button
                      onClick={() => navigate('/comunidad')}
                      className="p-4 rounded-lg flex flex-col items-center gap-2 transition hover:opacity-80 col-span-2"
                      style={{ backgroundColor: '#1a1f2e' }}
                    >
                      <UserGroupIcon className="w-6 h-6" style={{ color: '#00d4ff' }} />
                      <span className="text-xs font-medium text-center" style={{ color: '#c9d1d9' }}>
                        Comunidad
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>

      <BottomNav />
    </div>
  );
}
