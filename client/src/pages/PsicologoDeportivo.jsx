import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import usePsicologoDeportivo from '../hooks/usePsicologoDeportivo';
import useComunidad from '../hooks/useComunidad';
import BottomNav from '../components/BottomNav';
import {
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
  CheckCircleIcon,
  DocumentIcon,
  ChartBarIcon,
  SparklesIcon,
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  NewspaperIcon,
  TrophyIcon,
  ChatBubbleLeftIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';

export default function PsicologoDeportivo() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const {
    atletas,
    atletasInactivos,
    intervenciones,
    resumenAtleta,
    estadisticas,
    loading,
    fetchAtletasAsignados,
    fetchAtletasInactivos,
    fetchIntervencionesAsignadas,
    fetchResumenAtleta,
    fetchEstadisticas,
    asignarIntervencion
  } = usePsicologoDeportivo();

  const { feed, reto, leaderboard, fetchFeed, fetchReto, fetchLeaderboard } = useComunidad();

  const [activeMainTab, setActiveMainTab] = useState('atletas');
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [showAsignForm, setShowAsignForm] = useState(false);
  const [activeComunidadTab, setActiveComunidadTab] = useState('feed');
  const [showConsignaForm, setShowConsignaForm] = useState(false);
  const [consignas, setConsignas] = useState([]);
  const [consignaContent, setConsignaContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingConsigna, setLoadingConsigna] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'respiracion',
    titulo: '',
    descripcion: '',
    duracion_minutos: 15
  });

  useEffect(() => {
    fetchAtletasAsignados();
    fetchAtletasInactivos(3);
    fetchIntervencionesAsignadas();
    fetchEstadisticas();
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

  const handleSendConsigna = async () => {
    if (!consignaContent.trim()) {
      alert('Por favor escribe un mensaje');
      return;
    }
    setLoadingConsigna(true);
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
      setLoadingConsigna(false);
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSelectAthlete = (athlete) => {
    setSelectedAthlete(athlete);
    fetchResumenAtleta(athlete.id);
  };

  const handleAsignarIntervencion = async (e) => {
    e.preventDefault();
    if (!selectedAthlete || !formData.titulo) {
      alert('Por favor completa los datos');
      return;
    }

    try {
      await asignarIntervencion(
        selectedAthlete.id,
        formData.tipo,
        formData.titulo,
        formData.descripcion,
        formData.duracion_minutos
      );
      setFormData({ tipo: 'respiracion', titulo: '', descripcion: '', duracion_minutos: 15 });
      setShowAsignForm(false);
      fetchIntervencionesAsignadas();
      fetchResumenAtleta(selectedAthlete.id);
      alert('Intervención asignada correctamente');
    } catch (error) {
      console.error('Error al asignar intervención:', error);
    }
  };

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

  const getStatusLabel = (readiness) => {
    if (readiness === null) return 'Sin dato';
    if (readiness > 70) return 'Listo';
    if (readiness >= 40) return 'Regular';
    return 'Bajo';
  };

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mt-6 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: '#c9d1d9' }}>
              Psicólogo Deportivo
            </h1>
            <p style={{ color: '#8b92a4' }}>
              {atletas.length} atletas en seguimiento
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg transition hover:opacity-80"
              style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
              title="Ir al Inicio"
            >
              <HomeIcon className="w-6 h-6" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg transition hover:opacity-80"
              style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
              title="Cerrar Sesión"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Pestañas Principales */}
        <div className="flex gap-2 mb-6 overflow-x-auto border-b pb-0" style={{ borderColor: '#30363d' }}>
          {[
            { tab: 'atletas', label: 'Atletas', Icon: UserGroupIcon },
            { tab: 'intervenciones', label: 'Intervenciones', Icon: CheckCircleIcon },
            { tab: 'alertas', label: 'Alertas', Icon: ExclamationTriangleIcon },
            { tab: 'estadisticas', label: 'Estadísticas', Icon: ChartBarIcon },
            { tab: 'comunidad', label: 'Comunidad', Icon: ChatBubbleLeftIcon }
          ].map(({ tab, label, Icon }) => (
            <button
              key={tab}
              onClick={() => {
                setActiveMainTab(tab);
                if (tab !== 'atletas') setSelectedAthlete(null);
              }}
              className="px-4 py-2 text-sm font-semibold transition whitespace-nowrap flex items-center gap-2"
              style={{
                color: activeMainTab === tab ? '#00d4ff' : '#8b92a4',
                borderBottomWidth: activeMainTab === tab ? '2px' : '0',
                borderBottomColor: activeMainTab === tab ? '#00d4ff' : 'transparent'
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* PESTAÑA: ATLETAS */}
        {activeMainTab === 'atletas' && (
          <div>
            {/* Resumen rápido */}
            {estadisticas && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e' }}>
                  <p style={{ color: '#00d4ff' }} className="text-2xl font-bold">
                    {estadisticas.atletasConIntervenciones}
                  </p>
                  <p style={{ color: '#8b92a4' }} className="text-xs mt-1">
                    Atletas
                  </p>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e' }}>
                  <p style={{ color: '#ffd93d' }} className="text-2xl font-bold">
                    {estadisticas.intervencionesPendientes}
                  </p>
                  <p style={{ color: '#8b92a4' }} className="text-xs mt-1">
                    Pendientes
                  </p>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e' }}>
                  <p style={{ color: '#31eb96' }} className="text-2xl font-bold">
                    {estadisticas.promedioReadiness}
                  </p>
                  <p style={{ color: '#8b92a4' }} className="text-xs mt-1">
                    Readiness
                  </p>
                </div>
              </div>
            )}

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
              <UserGroupIcon className="w-5 h-5" />
              Atletas en Seguimiento
            </h2>

            {/* Lista de Atletas */}
            {loading ? (
              <div className="text-center py-8" style={{ color: '#00d4ff' }}>
                Cargando atletas...
              </div>
            ) : atletas.length === 0 ? (
              <div
                className="text-center py-8 rounded-lg mb-6"
                style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
              >
                No hay atletas en seguimiento
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                {atletas.map((atleta) => {
                  const color = getStatusColor(atleta.status);
                  const statusLabel = getStatusLabel(atleta.readiness);

                  return (
                    <button
                      key={atleta.id}
                      onClick={() => handleSelectAthlete(atleta)}
                      className="w-full p-4 rounded-lg text-left transition border"
                      style={{
                        backgroundColor: selectedAthlete?.id === atleta.id ? '#0066ff20' : '#1a1f2e',
                        color: '#c9d1d9',
                        borderColor: `${color}40`,
                        borderWidth: '1px'
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold">{atleta.nombre}</p>
                          <p style={{ color: '#8b92a4' }} className="text-sm">
                            {atleta.deporte} • {atleta.nivel}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color }}>
                            {atleta.readiness !== null ? atleta.readiness : '—'}
                          </p>
                          <p style={{ color: '#8b92a4' }} className="text-xs">
                            {statusLabel}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs" style={{ color: '#8b92a4' }}>
                        <span>{atleta.equipo_nombre || 'Sin equipo'}</span>
                        <span>{atleta.intervenciones_asignadas} intervenciones</span>
                        <span>{atleta.intervenciones_completadas || 0} completadas</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Detalle del Atleta Seleccionado */}
            {selectedAthlete && resumenAtleta && (
              <div className="mb-8 p-4 rounded-lg border" style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d' }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-lg font-semibold" style={{ color: '#c9d1d9' }}>
                      {resumenAtleta.atleta.nombre}
                    </p>
                    <p style={{ color: '#8b92a4' }} className="text-sm">
                      {resumenAtleta.atleta.deporte} • {resumenAtleta.atleta.nivel}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAsignForm(!showAsignForm)}
                    className="px-3 py-2 rounded text-sm font-semibold"
                    style={{ backgroundColor: '#0066ff', color: '#ffffff' }}
                  >
                    {showAsignForm ? 'Cancelar' : 'Asignar Intervención'}
                  </button>
                </div>

                {/* Readiness actual */}
                {resumenAtleta.readiness && (
                  <div className="bg-opacity-30 p-3 rounded mb-3" style={{ backgroundColor: '#ffffff' }}>
                    <p style={{ color: '#000000' }} className="text-xs mb-1">
                      Readiness Actual
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="font-bold" style={{ color: '#000000' }}>
                          {Math.round(resumenAtleta.readiness.score)}
                        </p>
                        <p style={{ color: '#8b92a4' }} className="text-xs">
                          General
                        </p>
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: '#000000' }}>
                          {Math.round(resumenAtleta.readiness.wellness_score)}
                        </p>
                        <p style={{ color: '#000000' }} className="text-xs">
                          Wellness
                        </p>
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: '#000000' }}>
                          {Math.round(resumenAtleta.readiness.cognitivo_score)}
                        </p>
                        <p style={{ color: '#000000' }} className="text-xs">
                          Cognitivo
                        </p>
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: '#000000' }}>
                          {Math.round(resumenAtleta.readiness.sesion_score)}
                        </p>
                        <p style={{ color: '#000000' }} className="text-xs">
                          Sesión
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Formulario de asignar intervención */}
                {showAsignForm && (
                  <form onSubmit={handleAsignarIntervencion} className="mt-4 p-3 rounded bg-opacity-20 space-y-3" style={{ backgroundColor: '#ffffff' }}>
                    <div>
                      <label style={{ color: '#000000' }} className="text-sm block mb-1">
                        Tipo de Intervención
                      </label>
                      <select
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        className="w-full p-2 rounded text-sm"
                        style={{ backgroundColor: '#0f1117', color: '#c9d1d9', borderColor: '#30363d' }}
                      >
                        <option value="respiracion">Respiración</option>
                        <option value="activacion">Activación</option>
                        <option value="recuperacion">Recuperación</option>
                        <option value="meditacion">Meditación</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ color: '#000000' }} className="text-sm block mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        placeholder="Ej: Técnica de respiración 4-7-8"
                        className="w-full p-2 rounded text-sm"
                        style={{ backgroundColor: '#0f1117', color: '#c9d1d9', borderColor: '#30363d' }}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#000000' }} className="text-sm block mb-1">
                        Descripción
                      </label>
                      <textarea
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        placeholder="Describe los pasos o instrucciones"
                        className="w-full p-2 rounded text-sm"
                        rows="2"
                        style={{ backgroundColor: '#0f1117', color: '#c9d1d9', borderColor: '#30363d' }}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#000000' }} className="text-sm block mb-1">
                        Duración (minutos)
                      </label>
                      <input
                        type="number"
                        value={formData.duracion_minutos}
                        onChange={(e) => setFormData({ ...formData, duracion_minutos: parseInt(e.target.value) })}
                        className="w-full p-2 rounded text-sm"
                        style={{ backgroundColor: '#0f1117', color: '#c9d1d9', borderColor: '#30363d' }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded font-semibold"
                      style={{ backgroundColor: '#0066ff', color: '#ffffff' }}
                    >
                      Asignar Intervención
                    </button>
                  </form>
                )}

                <button
                  onClick={() => setSelectedAthlete(null)}
                  className="w-full mt-3 py-2 rounded text-sm"
                  style={{ backgroundColor: '#30363d', color: '#8b92a4' }}
                >
                  Cerrar detalles
                </button>

                {/* Sesiones de Entrenamiento */}
                {resumenAtleta.sesiones && resumenAtleta.sesiones.length > 0 && (
                  <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d', borderWidth: '1px' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#c9d1d9' }}>
                      Sesiones de Entrenamiento (últimas 5)
                    </h3>
                    <div className="space-y-2">
                      {resumenAtleta.sesiones.slice(0, 5).map((s, idx) => (
                        <div key={idx} className="p-2 rounded text-sm" style={{ backgroundColor: '#0f111760' }}>
                          <div className="grid grid-cols-3 gap-2 text-center mb-1">
                            <div>
                              <p className="font-bold" style={{ color: '#00d4ff' }}>{s.esfuerzo_mental}</p>
                              <p style={{ color: '#8b92a4' }} className="text-xs">Esfuerzo Mental</p>
                            </div>
                            <div>
                              <p className="font-bold" style={{ color: '#31eb96' }}>{s.satisfaccion}</p>
                              <p style={{ color: '#8b92a4' }} className="text-xs">Satisfacción</p>
                            </div>
                            <div>
                              <p className="font-bold" style={{ color: '#ff6b6b' }}>{s.fatiga_carrera}</p>
                              <p style={{ color: '#8b92a4' }} className="text-xs">Fatiga</p>
                            </div>
                          </div>
                          {s.notas && (
                            <p style={{ color: '#8b92a4' }} className="text-xs italic">
                              "{s.notas}"
                            </p>
                          )}
                          <p style={{ color: '#8b92a4' }} className="text-xs mt-1">
                            {new Date(s.timestamp).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wellness */}
                {resumenAtleta.wellness && resumenAtleta.wellness.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d', borderWidth: '1px' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#c9d1d9' }}>
                      Wellness (últimas 5 entradas)
                    </h3>
                    <div className="space-y-2">
                      {resumenAtleta.wellness.slice(0, 5).map((w, idx) => (
                        <div key={idx} className="p-2 rounded text-sm" style={{ backgroundColor: '#0f111760' }}>
                          <div className="grid grid-cols-4 gap-2 text-center mb-1">
                            <div>
                              <p className="font-bold" style={{ color: '#ff6b6b' }}>{w.fatiga}</p>
                              <p style={{ color: '#8b92a4' }} className="text-xs">Fatiga</p>
                            </div>
                            <div>
                              <p className="font-bold" style={{ color: '#31eb96' }}>{w.sueno}</p>
                              <p style={{ color: '#8b92a4' }} className="text-xs">Sueño</p>
                            </div>
                            <div>
                              <p className="font-bold" style={{ color: '#00d4ff' }}>{w.dolor}</p>
                              <p style={{ color: '#8b92a4' }} className="text-xs">Dolor</p>
                            </div>
                            <div>
                              <p className="font-bold" style={{ color: '#ffd93d' }}>{w.estres}</p>
                              <p style={{ color: '#8b92a4' }} className="text-xs">Estrés</p>
                            </div>
                          </div>
                          <p style={{ color: '#8b92a4' }} className="text-xs">
                            {new Date(w.timestamp).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tests Cognitivos */}
                {resumenAtleta.tests && resumenAtleta.tests.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d', borderWidth: '1px' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#c9d1d9' }}>
                      Tests Cognitivos (últimos 5)
                    </h3>
                    <div className="space-y-2">
                      {resumenAtleta.tests.slice(0, 5).map((t, idx) => (
                        <div key={idx} className="p-2 rounded text-sm" style={{ backgroundColor: '#0f111760' }}>
                          <div className="flex justify-between items-start mb-1">
                            <p style={{ color: '#c9d1d9' }}>{t.tipo_test}</p>
                            <p className="font-bold" style={{ color: '#00d4ff' }}>{t.precision}%</p>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center mb-1">
                            <div>
                              <p className="text-xs" style={{ color: '#8b92a4' }}>
                                TR: <span style={{ color: '#c9d1d9' }}>{t.tr_medio}ms</span>
                              </p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: '#8b92a4' }}>
                                Lapsos: <span style={{ color: '#c9d1d9' }}>{t.lapses || 0}</span>
                              </p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: '#8b92a4' }}>
                                Duración: <span style={{ color: '#c9d1d9' }}>{t.duracion}s</span>
                              </p>
                            </div>
                          </div>
                          <p style={{ color: '#8b92a4' }} className="text-xs">
                            {new Date(t.timestamp).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Intervenciones Asignadas */}
                {resumenAtleta.intervenciones && resumenAtleta.intervenciones.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e', borderColor: '#30363d', borderWidth: '1px' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#c9d1d9' }}>
                      Intervenciones Asignadas
                    </h3>
                    <div className="space-y-2">
                      {resumenAtleta.intervenciones.map((int, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded text-sm"
                          style={{
                            backgroundColor: '#0f111760',
                            borderLeft: `3px solid ${int.completada ? '#31eb96' : '#ffd93d'}`
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p style={{ color: '#c9d1d9' }}>{int.titulo}</p>
                              <p style={{ color: '#8b92a4' }} className="text-xs">
                                {int.tipo} • {int.duracion_minutos} min
                              </p>
                            </div>
                            {int.completada ? (
                              <span style={{ color: '#31eb96' }} className="font-bold text-xs">✓</span>
                            ) : (
                              <span style={{ color: '#ffd93d' }} className="font-bold text-xs">⏳</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: INTERVENCIONES */}
        {activeMainTab === 'intervenciones' && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
              <CheckCircleIcon className="w-5 h-5" />
              Intervenciones Asignadas
            </h2>

            {intervenciones && intervenciones.length > 0 ? (
              <div className="space-y-3">
                {intervenciones.map((int, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: '#1a1f2e',
                      borderLeft: `4px solid ${int.completada ? '#31eb96' : '#ffd93d'}`
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: '#c9d1d9' }}>{int.titulo}</p>
                        <p style={{ color: '#8b92a4' }} className="text-sm">
                          {int.atleta_nombre} • {int.tipo}
                        </p>
                      </div>
                      {int.completada ? (
                        <span style={{ color: '#31eb96' }} className="font-bold">✓ Completada</span>
                      ) : (
                        <span style={{ color: '#ffd93d' }} className="font-bold">⏳ Pendiente</span>
                      )}
                    </div>
                    {int.descripcion && (
                      <p style={{ color: '#8b92a4' }} className="text-sm mb-2">
                        {int.descripcion}
                      </p>
                    )}
                    <div className="flex justify-between text-xs" style={{ color: '#8b92a4' }}>
                      <span>{int.duracion_minutos} min</span>
                      <span>{new Date(int.fecha_asignacion).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="text-center py-8 rounded-lg"
                style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
              >
                Sin intervenciones asignadas
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: ALERTAS */}
        {activeMainTab === 'alertas' && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
              <ExclamationTriangleIcon className="w-5 h-5" />
              Alertas
            </h2>

            {atletasInactivos && atletasInactivos.length > 0 ? (
              <div
                className="p-4 rounded-lg border-2"
                style={{
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  borderColor: '#ff6b6b'
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: '#ff6b6b' }}>
                      ⚠️ {atletasInactivos.length} atleta{atletasInactivos.length > 1 ? 's' : ''} inactivo{atletasInactivos.length > 1 ? 's' : ''}
                    </p>
                    <p style={{ color: '#8b92a4' }} className="text-sm mt-1">
                      Sin usar la aplicación en los últimos 3 días
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {atletasInactivos.map((atleta) => (
                    <div
                      key={atleta.id}
                      className="p-3 rounded bg-black/20 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: '#c9d1d9' }}>{atleta.nombre}</p>
                        <p className="text-sm" style={{ color: '#8b92a4' }}>
                          {atleta.equipo_nombre || 'Sin equipo'} • {atleta.deporte}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p style={{ color: '#ff6b6b' }} className="font-bold text-lg">
                          {Math.floor(atleta.dias_inactivo)}d
                        </p>
                        <p style={{ color: '#8b92a4' }} className="text-xs">
                          inactivo
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="text-center py-8 rounded-lg"
                style={{ backgroundColor: '#1a1f2e', color: '#8b92a4' }}
              >
                ✓ No hay atletas inactivos
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: ESTADÍSTICAS */}
        {activeMainTab === 'estadisticas' && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
              <ChartBarIcon className="w-5 h-5" />
              Estadísticas
            </h2>

            {estadisticas && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e' }}>
                    <p style={{ color: '#00d4ff' }} className="text-3xl font-bold">
                      {estadisticas.atletasConIntervenciones}
                    </p>
                    <p style={{ color: '#8b92a4' }} className="text-sm mt-2">
                      Atletas en Seguimiento
                    </p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e' }}>
                    <p style={{ color: '#ffd93d' }} className="text-3xl font-bold">
                      {estadisticas.intervencionesPendientes}
                    </p>
                    <p style={{ color: '#8b92a4' }} className="text-sm mt-2">
                      Intervenciones Pendientes
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#1a1f2e' }}>
                  <p style={{ color: '#31eb96' }} className="text-3xl font-bold">
                    {estadisticas.promedioReadiness}
                  </p>
                  <p style={{ color: '#8b92a4' }} className="text-sm mt-2">
                    Promedio de Readiness
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: COMUNIDAD */}
        {activeMainTab === 'comunidad' && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
              <ChatBubbleLeftIcon className="w-5 h-5" />
              Comunidad
            </h2>

            {/* Tabs de Comunidad */}
            <div className="flex gap-2 mb-4 overflow-x-auto border-b pb-0" style={{ borderColor: '#30363d' }}>
              {[
                { tab: 'feed', label: 'Feed', Icon: NewspaperIcon },
                { tab: 'reto', label: 'Reto', Icon: CheckCircleIcon },
                { tab: 'ranking', label: 'Ranking', Icon: TrophyIcon },
                { tab: 'consignas', label: 'Foro', Icon: ChatBubbleLeftIcon }
              ].map(({ tab, label, Icon }) => (
                <button
                  key={tab}
                  onClick={() => setActiveComunidadTab(tab)}
                  className="px-4 py-2 text-sm font-semibold transition whitespace-nowrap flex items-center gap-2"
                  style={{
                    color: activeComunidadTab === tab ? '#00d4ff' : '#8b92a4',
                    borderBottomWidth: activeComunidadTab === tab ? '2px' : '0',
                    borderBottomColor: activeComunidadTab === tab ? '#00d4ff' : 'transparent'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Contenido de Comunidad */}
            {activeComunidadTab === 'feed' && (
              <div className="space-y-3">
                {feed && feed.length > 0 ? (
                  feed.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                      <p style={{ color: '#c9d1d9' }}>{item.contenido}</p>
                      <p style={{ color: '#8b92a4' }} className="text-xs mt-2">
                        {item.atleta_nombre} • {formatDate(item.timestamp)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#8b92a4' }} className="text-center py-4">
                    No hay elementos en el feed
                  </p>
                )}
              </div>
            )}

            {activeComunidadTab === 'reto' && (
              <div className="space-y-3">
                {reto ? (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                    <p className="font-semibold" style={{ color: '#c9d1d9' }}>
                      {reto.titulo}
                    </p>
                    <p style={{ color: '#8b92a4' }} className="text-sm mt-2">
                      {reto.descripcion}
                    </p>
                  </div>
                ) : (
                  <p style={{ color: '#8b92a4' }} className="text-center py-4">
                    No hay reto disponible
                  </p>
                )}
              </div>
            )}

            {activeComunidadTab === 'ranking' && (
              <div className="space-y-2">
                {leaderboard && leaderboard.length > 0 ? (
                  leaderboard.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: '#1a1f2e' }}>
                      <div>
                        <p style={{ color: '#c9d1d9' }}>
                          #{idx + 1} {item.nombre}
                        </p>
                        <p style={{ color: '#8b92a4' }} className="text-sm">
                          {item.equipo_nombre}
                        </p>
                      </div>
                      <p className="font-bold text-lg" style={{ color: '#00d4ff' }}>
                        {item.puntos}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#8b92a4' }} className="text-center py-4">
                    No hay ranking disponible
                  </p>
                )}
              </div>
            )}

            {activeComunidadTab === 'consignas' && (
              <div className="space-y-3">
                {successMessage && (
                  <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#31eb9640', color: '#31eb96' }}>
                    {successMessage}
                  </div>
                )}

                {!showConsignaForm && (
                  <button
                    onClick={() => setShowConsignaForm(true)}
                    className="w-full py-2 px-4 rounded-lg font-semibold"
                    style={{ backgroundColor: '#00d4ff', color: '#0f1117' }}
                  >
                    Publicar mensaje
                  </button>
                )}

                {showConsignaForm && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                    <textarea
                      value={consignaContent}
                      onChange={(e) => setConsignaContent(e.target.value)}
                      placeholder="¿Qué quieres compartir con tu equipo?"
                      className="w-full p-3 rounded-lg text-sm"
                      rows="3"
                      style={{ backgroundColor: '#0f1117', color: '#c9d1d9' }}
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleSendConsigna}
                        disabled={loadingConsigna}
                        className="flex-1 py-2 rounded font-semibold"
                        style={{ backgroundColor: '#00d4ff', color: '#0f1117', opacity: loadingConsigna ? 0.6 : 1 }}
                      >
                        {loadingConsigna ? 'Publicando...' : 'Publicar'}
                      </button>
                      <button
                        onClick={() => {
                          setShowConsignaForm(false);
                          setConsignaContent('');
                        }}
                        className="flex-1 py-2 rounded font-semibold"
                        style={{ backgroundColor: '#30363d', color: '#8b92a4' }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {consignas && consignas.length > 0 ? (
                  consignas.map((consigna, idx) => (
                    <div key={idx} className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold" style={{ color: '#c9d1d9' }}>
                          {consigna.atleta_nombre}
                        </p>
                        <p style={{ color: '#8b92a4' }} className="text-xs">
                          {formatDate(consigna.timestamp)}
                        </p>
                      </div>
                      <p style={{ color: '#8b92a4' }}>{consigna.contenido}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#8b92a4' }} className="text-center py-4">
                    Sin mensajes aún
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
