import { useEffect, useState } from 'react';
import useComunidad from '../hooks/useComunidad';
import useKudos from '../hooks/useKudos';
import { useAuth } from '../hooks/useAuth';
import BottomNav from '../components/BottomNav';
import { NewspaperIcon, CheckCircleIcon, TrophyIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';

export default function Comunidad() {
  const { user } = useAuth();
  const { feed, reto, leaderboard, fetchFeed, fetchReto, fetchLeaderboard } = useComunidad();
  const { ranking, sendKudo, fetchRanking } = useKudos();
  const [activeTab, setActiveTab] = useState('feed');
  const [showKudoForm, setShowKudoForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [kudoMessage, setKudoMessage] = useState('');
  const [allAtletas, setAllAtletas] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchFeed();
    fetchReto();
    fetchLeaderboard();
    fetchRanking();
  }, []);

  // Cuando se abre el tab de kudos, obtener lista de atletas
  useEffect(() => {
    if (activeTab === 'kudos' && allAtletas.length === 0) {
      // Por ahora, mostramos los del leaderboard
      setAllAtletas(ranking.filter((a) => a.id !== user?.id));
    }
  }, [activeTab, ranking]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `hoy a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  const handleSendKudo = async () => {
    if (!selectedUser) {
      alert('Selecciona un compañero');
      return;
    }
    try {
      await sendKudo(selectedUser.id, kudoMessage);
      setSuccessMessage('¡Kudo enviado! 🎉');
      setShowKudoForm(false);
      setSelectedUser(null);
      setKudoMessage('');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchRanking();
    } catch {
      // Error is handled in hook
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
          <TabButton tab="kudos" label="Kudos" Icon={HandThumbUpIcon} />
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

          {/* KUDOS TAB */}
          {activeTab === 'kudos' && (
            <div>
              {successMessage && (
                <div
                  className="p-3 rounded-lg mb-4 text-center"
                  style={{ backgroundColor: '#31eb9620', color: '#31eb96', border: '1px solid #31eb96' }}
                >
                  {successMessage}
                </div>
              )}

              {!showKudoForm ? (
                <button
                  onClick={() => setShowKudoForm(true)}
                  className="w-full py-3 rounded-lg font-semibold transition mb-6"
                  style={{ backgroundColor: '#00d4ff', color: '#0f1117' }}
                >
                  Enviar Kudo a un Compañero
                </button>
              ) : (
                <div
                  className="p-4 rounded-lg mb-6"
                  style={{ backgroundColor: '#1a1f2e' }}
                >
                  <h3 style={{ color: '#c9d1d9' }} className="font-semibold mb-4">
                    Enviar Kudo
                  </h3>

                  {/* Selector de compañero */}
                  <label style={{ color: '#8b92a4' }} className="text-sm block mb-2">
                    Selecciona un compañero:
                  </label>
                  <select
                    value={selectedUser?.id || ''}
                    onChange={(e) => {
                      const user = allAtletas.find((a) => a.id === parseInt(e.target.value));
                      setSelectedUser(user);
                    }}
                    className="w-full p-2 rounded mb-4 text-sm"
                    style={{ backgroundColor: '#0f1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                  >
                    <option value="">-- Selecciona --</option>
                    {allAtletas.map((atleta) => (
                      <option key={atleta.id} value={atleta.id}>
                        {atleta.nombre}
                      </option>
                    ))}
                  </select>

                  {/* Mensaje */}
                  <label style={{ color: '#8b92a4' }} className="text-sm block mb-2">
                    Mensaje (opcional):
                  </label>
                  <textarea
                    value={kudoMessage}
                    onChange={(e) => setKudoMessage(e.target.value)}
                    placeholder="Ej: ¡Excelente sesión hoy!"
                    className="w-full p-2 rounded mb-4 text-sm resize-none"
                    rows="3"
                    style={{ backgroundColor: '#0f1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                  />

                  {/* Botones */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSendKudo}
                      disabled={!selectedUser}
                      className="flex-1 py-2 rounded font-semibold transition disabled:opacity-50"
                      style={{
                        backgroundColor: selectedUser ? '#31eb96' : '#8b92a4',
                        color: '#0f1117',
                      }}
                    >
                      Enviar Kudo
                    </button>
                    <button
                      onClick={() => {
                        setShowKudoForm(false);
                        setSelectedUser(null);
                        setKudoMessage('');
                      }}
                      className="flex-1 py-2 rounded font-semibold transition"
                      style={{ backgroundColor: '#30363d', color: '#c9d1d9' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Ranking de kudos */}
              <h3 style={{ color: '#c9d1d9' }} className="font-semibold mb-3">
                Kudos del Equipo
              </h3>
              <div className="space-y-2">
                {ranking.map((atleta, index) => (
                  <div
                    key={atleta.id}
                    className="p-3 rounded-lg flex items-center justify-between"
                    style={{ backgroundColor: '#1a1f2e' }}
                  >
                    <span style={{ color: '#c9d1d9' }}>
                      {atleta.nombre}
                    </span>
                    <span
                      className="font-bold text-lg"
                      style={{ color: '#ffd93d' }}
                    >
                      {atleta.kudos_recibidos} kudos
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
