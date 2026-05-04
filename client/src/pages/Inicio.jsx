import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import useReadiness from '../hooks/useReadiness';
import BottomNav from '../components/BottomNav';
import ReadinessWidget from '../components/ReadinessWidget';
import TeamReadiness from '../components/TeamReadiness';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, HeartIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Inicio() {
  const { user } = useAuth();
  const { readiness, trend, loading, fetchReadinessToday, fetchTrend } = useReadiness();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReadinessToday();
    fetchTrend();
  }, []);

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

  const chartData = trend.map((item) => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    score: item.score,
  }));

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#c9d1d9' }}>
            Hola, {user?.nombre?.split(' ')[0]}
          </h1>
          <p style={{ color: '#8b92a4' }}>
            {dayName.charAt(0).toUpperCase() + dayName.slice(1)}, {dateStr}
          </p>
        </div>

        {/* Readiness Widget */}
        {!loading && readiness ? (
          <div className="mb-8">
            <ReadinessWidget readiness={readiness.readiness} status={readiness.status} />
          </div>
        ) : (
          <div className="mb-8 p-8 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e', color: '#00d4ff' }}>
            Calculando readiness...
          </div>
        )}

        {/* Team Readiness */}
        <div className="mb-8">
          <TeamReadiness compañeros={[]} />
        </div>

        {/* Quick Access */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#c9d1d9' }}>
            Accesos Rápidos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/tests')}
              className="p-4 rounded-lg flex flex-col items-center gap-2 transition hover:opacity-80"
              style={{ backgroundColor: '#1a1f2e' }}
            >
              <SparklesIcon className="w-8 h-8" style={{ color: '#00d4ff' }} />
              <span className="text-sm font-medium" style={{ color: '#c9d1d9' }}>
                Test Cognitivo
              </span>
            </button>
            <button
              onClick={() => navigate('/wellness')}
              className="p-4 rounded-lg flex flex-col items-center gap-2 transition hover:opacity-80"
              style={{ backgroundColor: '#1a1f2e' }}
            >
              <HeartIcon className="w-8 h-8" style={{ color: '#00d4ff' }} />
              <span className="text-sm font-medium" style={{ color: '#c9d1d9' }}>
                Wellness
              </span>
            </button>
            <button
              onClick={() => navigate('/registro')}
              className="p-4 rounded-lg flex flex-col items-center gap-2 transition hover:opacity-80"
              style={{ backgroundColor: '#1a1f2e' }}
            >
              <DocumentTextIcon className="w-8 h-8" style={{ color: '#00d4ff' }} />
              <span className="text-sm font-medium" style={{ color: '#c9d1d9' }}>
                Registrar Sesión
              </span>
            </button>
            <button
              onClick={() => navigate('/comunidad')}
              className="p-4 rounded-lg flex flex-col items-center gap-2 transition hover:opacity-80"
              style={{ backgroundColor: '#1a1f2e' }}
            >
              <UserGroupIcon className="w-8 h-8" style={{ color: '#00d4ff' }} />
              <span className="text-sm font-medium" style={{ color: '#c9d1d9' }}>
                Comunidad
              </span>
            </button>
          </div>
        </div>

        {/* Trend Chart */}
        {chartData.length > 0 && (
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#c9d1d9' }}>
              Tendencia de Readiness
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
          </div>
        )}

        {/* Info Scores */}
        {readiness?.scores && (
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e' }}>
              <p style={{ color: '#8b92a4' }} className="text-xs mb-1">
                Wellness
              </p>
              <p className="text-2xl font-bold" style={{ color: '#00d4ff' }}>
                {readiness.scores.wellness}
              </p>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e' }}>
              <p style={{ color: '#8b92a4' }} className="text-xs mb-1">
                Cognitivo
              </p>
              <p className="text-2xl font-bold" style={{ color: '#a371f7' }}>
                {readiness.scores.cognitivo}
              </p>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e' }}>
              <p style={{ color: '#8b92a4' }} className="text-xs mb-1">
                Sesión
              </p>
              <p className="text-2xl font-bold" style={{ color: '#58a6ff' }}>
                {readiness.scores.sesion}
              </p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
