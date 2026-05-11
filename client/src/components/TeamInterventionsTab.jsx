export default function TeamInterventionsTab({ interventions, loading }) {
  if (loading) {
    return (
      <div 
        className="p-8 rounded-lg text-center"
        style={{ backgroundColor: '#1a1f2e', color: '#00d4ff' }}
      >
        <p>Cargando intervenciones...</p>
      </div>
    );
  }

  if (!interventions || interventions.length === 0) {
    return (
      <div 
        className="p-8 rounded-lg text-center"
        style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
      >
        <p>No hay intervenciones completadas esta semana</p>
      </div>
    );
  }

  const getTipoIcon = (tipo) => {
    switch(tipo) {
      case 'respiracion': return '🧘';
      case 'activacion': return '⚡';
      case 'recuperacion': return '💆';
      default: return '✅';
    }
  };

  return (
    <div className="space-y-3">
      {interventions.map((atleta, idx) => (
        <div
          key={idx}
          className="rounded-lg p-4 border"
          style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d' }}
        >
          <div className="flex items-start justify-between mb-2">
            <p style={{ color: '#c9d1d9' }} className="font-semibold">
              {atleta.nombre}
            </p>
            <p style={{ color: '#31eb96' }} className="font-bold text-lg">
              {atleta.total_completadas}
            </p>
          </div>

          <p style={{ color: '#8b92a4' }} className="text-xs mb-2">
            {atleta.tipos}
          </p>

          <p style={{ color: '#8b92a4' }} className="text-xs">
            Última: {new Date(atleta.ultima_completada).toLocaleDateString('es-ES')}
          </p>

          <div className="flex gap-1 mt-3">
            {atleta.tipos.split(', ').map((tipo) => (
              <span key={tipo} className="text-xs">
                {getTipoIcon(tipo.trim())}
              </span>
            ))}
          </div>
        </div>
      ))}

      <div 
        className="p-4 rounded-lg text-center"
        style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
      >
        <p style={{ color: '#00d4ff' }} className="text-xs">
          {interventions.length} atleta{interventions.length !== 1 ? 's' : ''} activo{interventions.length !== 1 ? 's' : ''} esta semana
        </p>
      </div>
    </div>
  );
}
