export default function TeamReadiness({ compañeros = [] }) {
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

  return (
    <div className="p-6 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#c9d1d9' }}>
        Tu Equipo Hoy
      </h3>

      {compañeros.length === 0 ? (
        <p style={{ color: '#8b92a4' }}>No perteneces a un equipo aún</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {compañeros.map((compañero) => {
            const color = getStatusColor(compañero.status);
            return (
              <div key={compañero.id} className="flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 flex-shrink-0"
                  style={{
                    backgroundColor: `${color}20`,
                    borderColor: color,
                  }}
                >
                  {compañero.avatar}
                </div>
                <div className="text-center">
                  <p className="text-xs" style={{ color: '#c9d1d9' }}>
                    {compañero.nombre.split(' ')[0]}
                  </p>
                  <p className="text-xs font-semibold" style={{ color }}>
                    {compañero.readiness}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
