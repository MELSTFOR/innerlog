import { useEffect, useState } from 'react';
import useComunidad from '../hooks/useComunidad';
import { useAuth } from '../hooks/useAuth';
import BottomNav from '../components/BottomNav';
import { NewspaperIcon, CheckCircleIcon, TrophyIcon, ChatBubbleLeftIcon, SparklesIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';

export default function Comunidad() {
  const { user } = useAuth();
  const { feed, reto, leaderboard, fetchFeed, fetchReto, fetchLeaderboard } = useComunidad();
  const [activeTab, setActiveTab] = useState('feed');
  const [showConsignaForm, setShowConsignaForm] = useState(false);
  const [consignas, setConsignas] = useState([]);
  const [consignaContent, setConsignaContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeed();
    fetchReto();
    fetchLeaderboard();
    fetchConsignas();
  }, []);

  const fetchConsignas = async () => {
    try {
      const response = await api.get('/comunidad/consignas');
      setConsignas(response.data.consignas || []);
    } catch (error) {
      console.error('Error al cargar consignas:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `hoy a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  const handleSendConsigna = async () => {
    if (!consignaContent.trim()) {
      alert('Por favor escribe un mensaje');
      return;
    }
    setLoading(true);
    try {
      await api.post('/comunidad/consignas', { contenido: consignaContent });
      setSuccessMessage('¡Mensaje publicado! 🎉');
      setShowConsignaForm(false);
      setConsignaContent('');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchConsignas();
    } catch (error) {
      console.error('Error al publicar:', error);
      alert('Error al publicar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ tab, label, Icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className="flex-1 py-3 font-semibold transition text-sm flex items-center justify-center gap-2"
      style={{
        borderBottomWidth: activeTab === tab ? '2px' : '0',
        borderBottomColor: activeTab === tab ? '#00d4ff' : 'transparent',
        color: activeTab === tab ? '#00d4ff' : '#8b92a4',
      }}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: '#30363d' }}>
          <h1 className="text-3xl font-bold" style={{ color: '#c9d1d9' }}>
            Comunidad
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b sticky top-0 z-10" style={{ backgroundColor: '#0f1117', borderColor: '#30363d' }}>
          <TabButton tab="feed" label="Feed" Icon={NewspaperIcon} />
          <TabButton tab="reto" label="Reto" Icon={CheckCircleIcon} />
          <TabButton tab="ranking" label="Ranking" Icon={TrophyIcon} />
          <TabButton tab="consignas" label="Foro" Icon={ChatBubbleLeftIcon} />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* FEED TAB */}
          {activeTab === 'feed' && (
            <div className="space-y-3">
              {feed.length === 0 ? (
                <p style={{ color: '#8b92a4' }} className="text-center py-8">
                  Sin actividad reciente
                </p>
              ) : (
                feed.map((item) => {
                  let bgColor = '#1a1f2e';
                  let borderLeftColor = '#00d4ff';
                  let icon = '●';

                  if (item.tipo === 'test') {
                    borderLeftColor = '#58a6ff';
                    icon = '[T]';
                  } else if (item.tipo === 'readiness') {
                    borderLeftColor = '#a371f7';
                    icon = '[R]';
                  } else if (item.tipo === 'streak') {
                    borderLeftColor = '#31eb96';
                    icon = '[S]';
                  }

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg border-l-4"
                      style={{ backgroundColor: bgColor, borderLeftColor }}
                    >
                      <div className="flex gap-3">
                        <div className="text-2xl">{icon}</div>
                        <div>
                          <p style={{ color: '#c9d1d9' }} className="font-semibold mb-1">
                            {item.titulo}
                          </p>
                          <p style={{ color: '#8b92a4' }} className="text-sm">
                            {formatDate(item.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* RETO TAB */}
          {activeTab === 'reto' && (
            <div>
              {reto ? (
                <div className="space-y-4">
                  <div
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: '#1a1f2e' }}
                  >
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#c9d1d9' }}>
                      [TARGET] {reto.titulo}
                    </h3>
                    <p style={{ color: '#8b92a4' }} className="text-sm mb-4">
                      {reto.descripcion}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span style={{ color: '#8b92a4' }} className="text-sm">
                          Progreso
                        </span>
                        <span
                          style={{ color: '#00d4ff' }}
                          className="font-bold"
                        >
                          {reto.completados}/{reto.total_atletas}
                        </span>
                      </div>
                      <div
                        className="w-full h-3 rounded-full overflow-hidden"
                        style={{ backgroundColor: '#0f1117' }}
                      >
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${reto.progreso}%`,
                            backgroundColor: reto.progreso > 70 ? '#31eb96' : reto.progreso > 40 ? '#ffd93d' : '#ff6b6b',
                          }}
                        />
                      </div>
                    </div>

                    {/* Fecha */}
                    <p style={{ color: '#8b92a4' }} className="text-xs mb-4">
                      Desde {new Date(reto.fecha_inicio).toLocaleDateString('es-ES')} hasta{' '}
                      {new Date(reto.fecha_fin).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  {/* Lista de atletas */}
                  <div>
                    <h4 style={{ color: '#c9d1d9' }} className="font-semibold mb-3">
                      Estado de los Atletas
                    </h4>
                    <div className="space-y-2">
                      {reto.atletas.map((atleta) => (
                        <div
                          key={atleta.id}
                          className="p-3 rounded-lg flex items-center justify-between"
                          style={{ backgroundColor: '#1a1f2e' }}
                        >
                          <span style={{ color: '#c9d1d9' }}>
                            {atleta.nombre}
                          </span>
                          <span
                            style={{
                              color: atleta.sesiones_dias >= 1 ? '#31eb96' : '#ff6b6b',
                            }}
                            className="font-semibold"
                          >
                            {atleta.sesiones_dias >= 1 ? '✓ Completado' : '○ Pendiente'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#8b92a4' }} className="text-center py-8">
                  No hay reto activo esta semana
                </p>
              )}
            </div>
          )}

          {/* RANKING TAB */}
          {activeTab === 'ranking' && (
            <div>
              {leaderboard.length === 0 ? (
                <p style={{ color: '#8b92a4' }} className="text-center py-8">
                  Sin datos de ranking
                </p>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((atleta, index) => {
                    let medalEmoji = '';
                    let medalColor = '#c9d1d9';

                    if (index === 0) {
                      medalEmoji = '🥇';
                      medalColor = '#ffd93d';
                    } else if (index === 1) {
                      medalEmoji = '🥈';
                      medalColor = '#a9a9a9';
                    } else if (index === 2) {
                      medalEmoji = '🥉';
                      medalColor = '#cd7f32';
                    }

                    return (
                      <div
                        key={atleta.id}
                        className="p-4 rounded-lg flex items-center justify-between"
                        style={{ backgroundColor: '#1a1f2e' }}
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className="text-2xl font-bold w-8 text-center"
                            style={{ color: medalColor }}
                          >
                            {medalEmoji || `${index + 1}`}
                          </span>
                          <div>
                            <p style={{ color: '#c9d1d9' }} className="font-semibold">
                              {atleta.nombre}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p
                            className="text-2xl font-bold"
                            style={{ color: '#00d4ff' }}
                          >
                            {atleta.racha_dias}
                          </p>
                          <p style={{ color: '#8b92a4' }} className="text-xs">
                            días consecutivos
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* FORO/CONSIGNAS TAB */}
          {activeTab === 'consignas' && (
            <div>
              {successMessage && (
                <div
                  className="p-3 rounded-lg mb-4 text-center"
                  style={{ backgroundColor: '#31eb9620', color: '#31eb96', border: '1px solid #31eb96' }}
                >
                  {successMessage}
                </div>
              )}

              {!showConsignaForm ? (
                <button
                  onClick={() => setShowConsignaForm(true)}
                  className="w-full py-3 rounded-lg font-semibold transition mb-6 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#00d4ff', color: '#0f1117' }}
                >
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  {user?.rol === 'psicologo_deportivo' ? 'Crear Consigna' : 'Escribir Mensaje'}
                </button>
              ) : (
                <div
                  className="p-4 rounded-lg mb-6"
                  style={{ backgroundColor: '#1a1f2e' }}
                >
                  <h3 style={{ color: '#c9d1d9' }} className="font-semibold mb-4">
                    {user?.rol === 'psicologo_deportivo' ? 'Nueva Consigna' : 'Nuevo Mensaje'}
                  </h3>

                  {/* Mensaje/Consigna */}
                  <label style={{ color: '#8b92a4' }} className="text-sm block mb-2">
                    {user?.rol === 'psicologo_deportivo' ? 'Consigna:' : 'Mensaje:'}
                  </label>
                  <textarea
                    value={consignaContent}
                    onChange={(e) => setConsignaContent(e.target.value)}
                    placeholder={user?.rol === 'psicologo_deportivo' ? 'Ej: Realiza 5 series de respiración diafragmática...' : 'Ej: ¡Hoy tuve una buena sesión!'}
                    className="w-full p-2 rounded mb-4 text-sm resize-none"
                    rows="4"
                    style={{ backgroundColor: '#0f1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                  />

                  {/* Botones */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSendConsigna}
                      disabled={loading || !consignaContent.trim()}
                      className="flex-1 py-2 rounded font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: consignaContent.trim() ? '#31eb96' : '#8b92a4',
                        color: '#0f1117',
                      }}
                    >
                      <SparklesIcon className="w-4 h-4" />
                      Publicar
                    </button>
                    <button
                      onClick={() => {
                        setShowConsignaForm(false);
                        setConsignaContent('');
                      }}
                      className="flex-1 py-2 rounded font-semibold transition"
                      style={{ backgroundColor: '#30363d', color: '#c9d1d9' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Foro de Consignas y Posts */}
              <h3 style={{ color: '#c9d1d9' }} className="font-semibold mb-3">
                Foro de la Comunidad
              </h3>
              <div className="space-y-3">
                {consignas.length === 0 ? (
                  <div
                    className="text-center py-8 rounded-lg"
                    style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
                  >
                    <ChatBubbleLeftIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Sin mensajes aún. ¡Sé el primero!</p>
                  </div>
                ) : (
                  consignas.map((consigna) => {
                    const isConsigna = consigna.tipo === 'consigna';
                    const isByCurrentUser = consigna.usuario_id === user?.id;
                    
                    return (
                      <div
                        key={consigna.id}
                        className="p-4 rounded-lg border-l-4"
                        style={{
                          backgroundColor: '#1a1f2e',
                          borderLeftColor: isConsigna ? '#00d4ff' : '#8b92a4',
                          borderLeftWidth: '3px'
                        }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p style={{ color: '#c9d1d9' }} className="font-semibold">
                                {consigna.usuario_nombre}
                              </p>
                              {isConsigna && (
                                <span
                                  className="px-2 py-0.5 text-xs rounded font-semibold flex items-center gap-1"
                                  style={{ backgroundColor: '#00d4ff40', color: '#00d4ff' }}
                                >
                                  <SparklesIcon className="w-3 h-3" />
                                  CONSIGNA
                                </span>
                              )}
                            </div>
                            <p style={{ color: '#8b92a4' }} className="text-sm">
                              {formatDate(consigna.timestamp)}
                            </p>
                          </div>
                          {isByCurrentUser && (
                            <span style={{ color: '#8b92a4' }} className="text-xs">
                              Tú
                            </span>
                          )}
                        </div>
                        <p style={{ color: '#c9d1d9' }} className="mt-2">
                          {consigna.contenido}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
