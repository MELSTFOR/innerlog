import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useSesiones from '../hooks/useSesiones';
import BottomNav from '../components/BottomNav';

export default function Resumen() {
  const { sesiones, fetchSesiones, loading } = useSesiones();

  useEffect(() => {
    fetchSesiones();
  }, []);

  const stats = useMemo(() => {
    if (sesiones.length === 0) {
      return {
        satisfaccionPromedio: 0,
        enfoquePromedio: 0,
        esfuerzoPromedio: 0,
        totalSesiones: 0,
        mejorPuntuacion: 0,
        fatigaPromedio: 0,
      };
    }

    const satisfaccion = sesiones.reduce((acc, s) => acc + s.satisfaccion, 0) / sesiones.length;
    const enfoque = sesiones.reduce((acc, s) => acc + s.enfoque, 0) / sesiones.length;
    const esfuerzo = sesiones.reduce((acc, s) => acc + s.esfuerzo_mental, 0) / sesiones.length;
    const fatiga = sesiones.reduce((acc, s) => acc + s.fatiga_carrera, 0) / sesiones.length;
    const mejorPuntuacion = Math.max(...sesiones.map((s) => s.satisfaccion));

    return {
      satisfaccionPromedio: satisfaccion.toFixed(1),
      enfoquePromedio: enfoque.toFixed(1),
      esfuerzoPromedio: esfuerzo.toFixed(1),
      totalSesiones: sesiones.length,
      mejorPuntuacion,
      fatigaPromedio: fatiga.toFixed(1),
    };
  }, [sesiones]);

  const chartData = useMemo(() => {
    return sesiones
      .slice()
      .reverse()
      .map((sesion) => ({
        fecha: new Date(sesion.timestamp).toLocaleDateString('es-ES', {
          month: 'short',
          day: 'numeric',
        }),
        enfoque: sesion.enfoque,
        esfuerzo: sesion.esfuerzo_mental,
        satisfaccion: sesion.satisfaccion,
      }));
  }, [sesiones]);

  const StatCard = ({ label, value, unit = '' }) => (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: '#1a1f2e' }}
    >
      <p className="text-sm mb-2" style={{ color: '#8b92a4' }}>
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color: '#00d4ff' }}>
        {value}
        <span className="text-sm ml-1" style={{ color: '#8b92a4' }}>
          {unit}
        </span>
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="pb-24 flex items-center justify-center" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
        <div style={{ color: '#00d4ff' }}>Cargando resumen...</div>
      </div>
    );
  }

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2 mt-6" style={{ color: '#00d4ff' }}>
          Resumen
        </h1>
        <p className="mb-8" style={{ color: '#8b92a4' }}>
          Análisis de tu rendimiento
        </p>

        {sesiones.length === 0 ? (
          <div
            className="p-8 rounded-lg text-center"
            style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
          >
            No hay datos para mostrar. Registra algunas sesiones primero.
          </div>
        ) : (
          <>
            {/* Grid de estadísticas */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatCard label="Satisfacción Promedio" value={stats.satisfaccionPromedio} unit="/10" />
              <StatCard label="Enfoque Promedio" value={stats.enfoquePromedio} unit="/10" />
              <StatCard label="Esfuerzo Mental" value={stats.esfuerzoPromedio} unit="/10" />
              <StatCard label="Sesiones Totales" value={stats.totalSesiones} />
              <StatCard label="Mejor Puntuación" value={stats.mejorPuntuacion} unit="/10" />
              <StatCard label="Fatiga Promedio" value={stats.fatigaPromedio} unit="/10" />
            </div>

            {/* Gráfico */}
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: '#1a1f2e' }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#c9d1d9' }}>
                Evolución de Métricas
              </h2>
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
                    domain={[0, 10]}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f1117',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#c9d1d9' }}
                    formatter={(value) => value}
                    wrapperStyle={{ outline: 'none' }}
                  />
                  <Legend wrapperStyle={{ color: '#8b92a4', paddingTop: '20px' }} />
                  <Line
                    type="monotone"
                    dataKey="enfoque"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    name="Enfoque"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="esfuerzo"
                    stroke="#a371f7"
                    strokeWidth={2}
                    name="Esfuerzo Mental"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="satisfaccion"
                    stroke="#58a6ff"
                    strokeWidth={2}
                    name="Satisfacción"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs mt-4 text-center" style={{ color: '#8b92a4' }}>
                Último: {chartData.length > 0 ? chartData[chartData.length - 1].fecha : 'N/A'}
              </p>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
