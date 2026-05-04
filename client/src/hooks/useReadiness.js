import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useReadiness = () => {
  const [readiness, setReadiness] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calcular readiness de hoy
  const fetchReadinessToday = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/readiness/hoy');
      setReadiness(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar readiness');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener tendencia de últimos 7 días
  const fetchTrend = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/readiness/tendencia');
      setTrend(response.data.trend);
      return response.data.trend;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar tendencia');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener readiness de usuario específico
  const getUserReadiness = useCallback(async (userId) => {
    try {
      const response = await api.get(`/readiness/usuario/${userId}`);
      return response.data;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  }, []);

  return {
    readiness,
    trend,
    loading,
    error,
    fetchReadinessToday,
    fetchTrend,
    getUserReadiness,
  };
};

export default useReadiness;
