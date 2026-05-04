import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useKudos = () => {
  const [kudos, setKudos] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Enviar kudo
  const sendKudo = useCallback(async (a_usuario_id, mensaje) => {
    setError('');
    try {
      const response = await api.post('/kudos', { a_usuario_id, mensaje });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar kudo');
      throw err;
    }
  }, []);

  // Obtener kudos recibidos
  const fetchKudosRecibidos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/kudos/recibidos');
      setKudos(response.data.kudos);
      return response.data.kudos;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar kudos');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener ranking de kudos
  const fetchRanking = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/kudos/ranking');
      setRanking(response.data.ranking);
      return response.data.ranking;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar ranking');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    kudos,
    ranking,
    loading,
    error,
    sendKudo,
    fetchKudosRecibidos,
    fetchRanking,
  };
};

export default useKudos;
