import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function PatternCard({ pattern }) {
  if (!pattern) return null;

  const colors = {
    titulo: '#c9d1d9',
    insight: '#8b92a4',
    recomendacion: '#00d4ff',
    background: '#1a1f2e',
    border: '#30363d'
  };

  const renderChart = () => {
    if (!pattern.datos) return null;

    // Detectar tipo de datos para el gráfico apropiado
    if (Array.isArray(pattern.datos) && pattern.datos.length > 0) {
      const firstItem = pattern.datos[0];
      
      if (firstItem.dia && firstItem.score) {
        // Datos para patrón de día de semana
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pattern.datos} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="dia" tick={{ fontSize: 12, fill: '#8b92a4' }} />
              <YAxis tick={{ fontSize: 12, fill: '#8b92a4' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1117', border: '1px solid #30363d' }}
                labelStyle={{ color: '#00d4ff' }}
              />
              <Bar dataKey="score" fill="#00d4ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      }
    }
    
    return null;
  };

  return (
    <div 
      className="rounded-lg p-6 mb-4 border"
      style={{ backgroundColor: colors.background, borderColor: colors.border }}
    >
      {/* Título */}
      <h3 style={{ color: colors.titulo }} className="text-lg font-semibold mb-2">
        {pattern.titulo}
      </h3>

      {/* Insight */}
      <p style={{ color: colors.insight }} className="text-sm mb-4 leading-relaxed">
        {pattern.insight}
      </p>

      {/* Gráfico */}
      {pattern.datos && (
        <div className="mb-4">
          {renderChart()}
        </div>
      )}

      {/* Recomendación */}
      <div 
        className="p-3 rounded-lg border"
        style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)', borderColor: 'rgba(0, 212, 255, 0.3)' }}
      >
        <p style={{ color: colors.recomendacion }} className="text-xs font-medium">
          💡 {pattern.recomendacion}
        </p>
      </div>
    </div>
  );
}
