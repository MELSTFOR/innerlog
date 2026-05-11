import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useReporte from '../hooks/useReporte';
import BottomNav from '../components/BottomNav';
import { ArrowLeftIcon, ShareIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

export default function Reporte() {
  const navigate = useNavigate();
  const { report, loading, error, fetchWeeklyReport } = useReporte();

  useEffect(() => {
    fetchWeeklyReport();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = async () => {
    if (!report) return;
    
    // Generar resumen en texto
    const resumen = `📊 Resumen de mi semana en Innerlog
    
📈 Condición Física Promedio: ${report.readiness.promedio}
   Mínimo: ${report.readiness.minimo}
   Máximo: ${report.readiness.maximo}

🏆 Mejor día: ${report.mejorDia?.dia} (${report.mejorDia?.score})
📉 Peor día: ${report.peorDia?.dia} (${report.peorDia?.score})

${report.testMasFrecuente ? `🧠 Test más frecuente: ${report.testMasFrecuente.tipo} (${report.testMasFrecuente.cantidad}x, precisión: ${report.testMasFrecuente.precision_promedio}%)` : ''}

${report.comparacionSemanaAnterior?.diferencia > 0 ? '📈 Mejorando!' : report.comparacionSemanaAnterior?.diferencia < 0 ? '📉 En bajada' : '➡️ Estable'}
    
#Innerlog #Entrenamiento`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Resumen Semanal',
          text: resumen
        });
      } catch (err) {
        console.log('Compartir cancelado');
      }
    } else {
      // Fallback: copiar al portapapeles
      await navigator.clipboard.writeText(resumen);
      alert('Resumen copiado al portapapeles');
    }
  };

  const getTrendIcon = () => {
    if (report?.comparacionSemanaAnterior?.tendencia === 'up') {
      return <ArrowTrendingUpIcon className="w-6 h-6" style={{ color: '#31eb96' }} />;
    } else if (report?.comparacionSemanaAnterior?.tendencia === 'down') {
      return <ArrowTrendingDownIcon className="w-6 h-6" style={{ color: '#ff6b6b' }} />;
    }
    return null;
  };

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mt-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg transition hover:opacity-80"
              style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#c9d1d9' }}>
                Mi Semana
              </h1>
              <p style={{ color: '#8b92a4' }} className="text-sm mt-1">
                Resumen semanal
              </p>
            </div>
          </div>
          {report && (
            <button
              onClick={handleShare}
              className="p-2 rounded-lg transition hover:opacity-80"
              style={{ backgroundColor: '#1a1f2e', color: '#00d4ff' }}
              title="Compartir"
            >
              <ShareIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div 
            className="p-8 rounded-lg text-center"
            style={{ backgroundColor: '#1a1f2e', color: '#00d4ff' }}
          >
            <p>Preparando tu resumen...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div 
            className="p-4 rounded-lg border mb-4"
            style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.3)' }}
          >
            <p style={{ color: '#ff6b6b' }} className="text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Report Cards */}
        {!loading && report && (
          <div className="space-y-4">
            {/* Condición Física Promedio */}
            <div
              className="rounded-lg p-6 border"
              style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d' }}
            >
              <p style={{ color: '#8b92a4' }} className="text-xs uppercase tracking-wider mb-2">
                📈 Condición Física Promedio
              </p>
              <div className="flex items-baseline justify-between">
                <p className="text-4xl font-bold" style={{ color: '#00d4ff' }}>
                  {report.readiness.promedio}
                </p>
                <div className="text-right">
                  <p style={{ color: '#8b92a4' }} className="text-xs">
                    Mín: {report.readiness.minimo}
                  </p>
                  <p style={{ color: '#8b92a4' }} className="text-xs">
                    Máx: {report.readiness.maximo}
                  </p>
                </div>
              </div>
            </div>

            {/* Mejor y Peor Día */}
            <div className="grid grid-cols-2 gap-4">
              {report.mejorDia && (
                <div
                  className="rounded-lg p-4 border"
                  style={{ backgroundColor: '#1a1f2e', borderColor: '#31eb96' }}
                >
                  <p style={{ color: '#31eb96' }} className="text-xs uppercase tracking-wider mb-2">
                    🏆 Mejor Día
                  </p>
                  <p style={{ color: '#c9d1d9' }} className="font-semibold">
                    {report.mejorDia.dia}
                  </p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#31eb96' }}>
                    {report.mejorDia.score}
                  </p>
                </div>
              )}

              {report.peorDia && (
                <div
                  className="rounded-lg p-4 border"
                  style={{ backgroundColor: '#1a1f2e', borderColor: '#ff6b6b' }}
                >
                  <p style={{ color: '#ff6b6b' }} className="text-xs uppercase tracking-wider mb-2">
                    📉 Peor Día
                  </p>
                  <p style={{ color: '#c9d1d9' }} className="font-semibold">
                    {report.peorDia.dia}
                  </p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#ff6b6b' }}>
                    {report.peorDia.score}
                  </p>
                </div>
              )}
            </div>

            {/* Test Cognitivo */}
            {report.testMasFrecuente && (
              <div
                className="rounded-lg p-6 border"
                style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d' }}
              >
                <p style={{ color: '#8b92a4' }} className="text-xs uppercase tracking-wider mb-2">
                  🧠 Test Cognitivo Más Frecuente
                </p>
                <p style={{ color: '#c9d1d9' }} className="font-semibold mb-2">
                  {report.testMasFrecuente.tipo}
                </p>
                <div className="flex justify-between">
                  <p style={{ color: '#8b92a4' }} className="text-sm">
                    Realizados: {report.testMasFrecuente.cantidad}
                  </p>
                  <p style={{ color: '#00d4ff' }} className="text-sm font-semibold">
                    Precisión: {report.testMasFrecuente.precision_promedio}%
                  </p>
                </div>
              </div>
            )}

            {/* Patrón Destacado */}
            {report.patronDestacado && (
              <div
                className="rounded-lg p-6 border"
                style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d' }}
              >
                <p style={{ color: '#8b92a4' }} className="text-xs uppercase tracking-wider mb-2">
                  🔍 Patrón Más Destacado
                </p>
                <p style={{ color: '#c9d1d9' }} className="text-sm">
                  {report.patronDestacado.descripcion}
                </p>
              </div>
            )}

            {/* Intervenciones */}
            <div
              className="rounded-lg p-6 border"
              style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d' }}
            >
              <p style={{ color: '#8b92a4' }} className="text-xs uppercase tracking-wider mb-2">
                ✅ Intervenciones Completadas
              </p>
              <p className="text-3xl font-bold" style={{ color: '#00d4ff' }}>
                {report.intervencionesCompletadas}
              </p>
            </div>

            {/* Comparación con Semana Anterior */}
            {report.comparacionSemanaAnterior && (
              <div
                className="rounded-lg p-6 border"
                style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p style={{ color: '#8b92a4' }} className="text-xs uppercase tracking-wider">
                    📊 Comparación con Semana Anterior
                  </p>
                  {getTrendIcon()}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p style={{ color: '#8b92a4' }} className="text-sm">
                      Semana anterior:
                    </p>
                    <p style={{ color: '#c9d1d9' }} className="font-semibold">
                      {report.comparacionSemanaAnterior.laSemanaAnterior}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p style={{ color: '#8b92a4' }} className="text-sm">
                      Esta semana:
                    </p>
                    <p style={{ color: '#c9d1d9' }} className="font-semibold">
                      {report.comparacionSemanaAnterior.estaSemanaPromedio}
                    </p>
                  </div>
                  <div 
                    className="p-3 rounded-lg mt-3"
                    style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
                  >
                    <p style={{ color: '#00d4ff' }} className="text-sm font-semibold">
                      {report.comparacionSemanaAnterior.diferencia > 0 
                        ? `+${report.comparacionSemanaAnterior.diferencia} ¡Mejorando!` 
                        : `${report.comparacionSemanaAnterior.diferencia}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full py-3 rounded-lg font-semibold transition hover:opacity-80 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#00d4ff', color: '#0f1117' }}
            >
              <ShareIcon className="w-5 h-5" />
              Compartir Resumen
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
