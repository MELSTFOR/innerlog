export default function ReadinessWidget({ readiness, status }) {
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'green':
        return 'Listo para competir';
      case 'yellow':
        return 'Estado regular';
      case 'red':
        return 'Necesitas recuperación';
      default:
        return 'Calculando...';
    }
  };

  const color = getStatusColor(status);

  return (
    <div
      className="p-8 rounded-lg text-center border-4"
      style={{
        backgroundColor: '#1a1f2e',
        borderColor: color,
      }}
    >
      <p style={{ color: '#8b92a4' }} className="mb-2">
        Condición Física de Hoy
      </p>

      <div className="flex items-center justify-center gap-4 mb-4">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center border-4"
          style={{
            backgroundColor: `${color}20`,
            borderColor: color,
          }}
        >
          <div className="text-5xl font-bold" style={{ color }}>
            {readiness || 0}
          </div>
        </div>
      </div>

      <p className="text-lg font-semibold mb-2" style={{ color }}>
        {getStatusLabel(status)}
      </p>

      <div className="text-sm" style={{ color: '#8b92a4' }}>
        <div className="flex justify-between mb-1">
          <span>Wellness</span>
          <span style={{ color: '#c9d1d9' }}>●</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Cognitivo</span>
          <span style={{ color: '#c9d1d9' }}>●</span>
        </div>
        <div className="flex justify-between">
          <span>Sesión</span>
          <span style={{ color: '#c9d1d9' }}>●</span>
        </div>
      </div>
    </div>
  );
}
