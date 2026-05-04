import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useEntrenador from '../hooks/useEntrenador';
import BottomNav from '../components/BottomNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Entrenador() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { atletas, tendencia, loading, fetchEquipo, fetchTendencia } = useEntrenador();
  const [lowReadinessCount, setLowReadinessCount] = useState(0);

  useEffect(() => {
    fetchEquipo();
    fetchTendencia();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Contar atletas con readiness < 40
  useEffect(() => {
    const count = atletas.filter((a) => a.readiness !== null && a.readiness < 40).length;
    setLowReadinessCount(count);
  }, [atletas]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'green':
        return '#31eb96';
      case 'yellow':
        return '#ffd93d';
      case 'red':
        return '#ff6b6b';
      default:
        return '#8b92a4';
    }
  };

  const getStatusLabel = (readiness) => {
    if (readiness === null) return 'Sin dato';
    if (readiness > 70) return 'Listo';
    if (readiness >= 40) return 'Regular';
    return 'Bajo';
  };

  const chartData = tendencia.map((item) => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    score: item.score_promedio,
  }));

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mt-6 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: '#c9d1d9' }}>
              Mi Equipo
            </h1>
            <p style={{ color: '#8b92a4' }}>
              {atletas.length} atletas
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg transition hover:opacity-80 mt-2"
            style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
            title="Cerrar Sesión"
          >
            <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Alerta si hay atletas con readiness bajo */}
        {lowReadinessCount >= 2 && (
          <div
            className="p-4 rounded-lg mb-6 border-l-4"
            style={{
              backgroundColor: '#1a1f2e',
              borderLeftColor: '#ff6b6b',
            }}
          >
            <p style={{ color: '#ff6b6b' }} className="font-semibold mb-1">
              ⚠️ Alerta de Readiness Bajo
            </p>
            <p style={{ color: '#c9d1d9' }}>
              {lowReadinessCount} atletas llegan con readiness bajo hoy — considerá reducir la carga.
            </p>
          </div>
        )}

        {/* Lista de atletas */}
        <div className="mb-8">
          {loading ? (
            <div className="text-center py-8" style={{ color: '#00d4ff' }}>
              Cargando equipo...
            </div>
          ) : atletas.length === 0 ? (
            <div
              className="text-center py-8 rounded-lg"
              style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
            >
              No tienes atletas en tu equipo
            </div>
          ) : (
            <div className="space-y-3">
              {atletas.map((atleta) => {
                const color = getStatusColor(atleta.status);
                const statusLabel = getStatusLabel(atleta.readiness);

                return (
                  <button
                    key={atleta.id}
                    onClick={() => navigate(`/entrenador/atleta/${atleta.id}`)}
                    className="w-full p-4 rounded-lg text-left transition hover:opacity-80 border"
                    style={{
                      backgroundColor: '#1a1f2e',
                      borderColor: `${color}40`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: '#c9d1d9' }}>
                          {atleta.nombre}
                        </p>
                        <p style={{ color: '#8b92a4' }} className="text-sm">
                          {atleta.deporte} • {atleta.nivel}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p
                            className="text-2xl font-bold"
                            style={{ color }}
                          >
                            {atleta.readiness !== null ? atleta.readiness : '—'}
                          </p>
                          <p style={{ color: '#8b92a4' }} className="text-xs">
                            {statusLabel}
                          </p>
                        </div>
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: `${color}20`,
                            borderLeft: `3px solid ${color}`,
                          }}
                        >
                          {atleta.status === 'green' && '🟢'}
                          {atleta.status === 'yellow' && '🟡'}
                          {atleta.status === 'red' && '🔴'}
                          {!atleta.status && '⚪'}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Gráfico de tendencia */}
        {chartData.length > 0 && (
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#c9d1d9' }}>
              Readiness Promedio del Equipo
            </h3>
            <ResponsiveContainer width="100%" height={250}>
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
                  formatter={(value) => [Math.round(value), 'Promedio']}
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
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
