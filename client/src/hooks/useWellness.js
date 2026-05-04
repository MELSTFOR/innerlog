import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useWellness = () => {
  const [wellness, setWellness] = useState([]);
  const [wellnessToday, setWellnessToday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Crear entrada de wellness
  const createWellness = useCallback(async (dataWellness) => {
    try {
      const response = await api.post('/wellness', dataWellness);
      setWellness([response.data.wellness, ...wellness]);
      setWellnessToday(response.data.wellness);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Error al guardar wellness',
      };
    }
  }, [wellness]);

  // Obtener wellness
  const fetchWellness = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/wellness');
      setWellness(response.data.wellness);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar wellness');
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener wellness de hoy
  const fetchWellnessToday = useCallback(async () => {
    try {
      const response = await api.get('/wellness/today');
      setWellnessToday(response.data.wellness);
      return response.data.wellness;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  }, []);

  return {
    wellness,
    wellnessToday,
    loading,
    error,
    createWellness,
    fetchWellness,
    fetchWellnessToday,
  };
};

export default useWellness;
