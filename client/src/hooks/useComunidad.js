import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useComunidad = () => {
  const [feed, setFeed] = useState([]);
  const [reto, setReto] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener feed
  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/comunidad/feed');
      setFeed(response.data.feed);
      return response.data.feed;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar feed');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener reto semanal
  const fetchReto = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/comunidad/reto');
      setReto(response.data.reto);
      return response.data.reto;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar reto');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener leaderboard
  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/comunidad/leaderboard');
      setLeaderboard(response.data.leaderboard);
      return response.data.leaderboard;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar leaderboard');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    feed,
    reto,
    leaderboard,
    loading,
    error,
    fetchFeed,
    fetchReto,
    fetchLeaderboard,
  };
};

export default useComunidad;
