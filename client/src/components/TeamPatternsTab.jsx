export default function TeamPatternsTab({ patterns, loading }) {
  if (loading) {
    return (
      <div 
        className="p-8 rounded-lg text-center"
        style={{ backgroundColor: '#1a1f2e', color: '#00d4ff' }}
      >
        <p>Analizando patrones del equipo...</p>
      </div>
    );
  }

  if (!patterns) {
    return (
      <div 
        className="p-8 rounded-lg text-center"
        style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
      >
        <p>No hay datos de patrones disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Peor día del equipo */}
      {patterns.peorDia && (
        <div
          className="rounded-lg p-6 border"
          style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d' }}
        >
          <p style={{ color: '#8b92a4' }} className="text-xs uppercase tracking-wider mb-2">
            📉 Día más difícil para el equipo
          </p>
          <p style={{ color: '#c9d1d9' }} className="font-semibold mb-1">
            {patterns.peorDia.day_name}
          </p>
          <p style={{ color: '#ff6b6b' }} className="text-sm">
            Condición promedio: {patterns.peorDia.avg_score}
          </p>
          <p style={{ color: '#8b92a4' }} className="text-xs mt-2">
            💡 Considera entrenamientos más ligeros este día
          </p>
        </div>
      )}

      {/* Atleta con mayor variabilidad */}
      {patterns.atletaMayorVariabilidad && (
        <div
          className="rounded-lg p-6 border"
          style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d' }}
        >
          <p style={{ color: '#8b92a4' }} className="text-xs uppercase tracking-wider mb-2">
            📊 Mayor variabilidad de rendimiento
          </p>
          <p style={{ color: '#c9d1d9' }} className="font-semibold mb-1">
            {patterns.atletaMayorVariabilidad.nombre}
          </p>
          <p style={{ color: '#ffd93d' }} className="text-sm">
            Variabilidad: {patterns.atletaMayorVariabilidad.variabilidad}
          </p>
          <p style={{ color: '#8b92a4' }} className="text-xs mt-2">
            💡 Este atleta podría beneficiarse de un seguimiento más cercano
          </p>
        </div>
      )}

      {/* Atleta con tendencia positiva */}
      {patterns.atletaTendenciaPositiva && (
        <div
          className="rounded-lg p-6 border"
          style={{ backgroundColor: '#1a1f2e', borderColor: '#31eb96' }}
        >
          <p style={{ color: '#31eb96' }} className="text-xs uppercase tracking-wider mb-2">
            🚀 Mejora más notable (últimas 2 semanas)
          </p>
          <p style={{ color: '#c9d1d9' }} className="font-semibold mb-1">
            {patterns.atletaTendenciaPositiva.nombre}
          </p>
          <p style={{ color: '#31eb96' }} className="text-sm">
            Mejora: +{patterns.atletaTendenciaPositiva.diferencia.toFixed(1)}
          </p>
          <p style={{ color: '#8b92a4' }} className="text-xs mt-2">
            💡 Reconoce el trabajo de este atleta
          </p>
        </div>
      )}
    </div>
  );
}
