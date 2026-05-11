import { useState, useCallback } from 'react';
import api from '../utils/api';

const usePatrones = () => {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPatterns = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/patrones');
      setPatterns(response.data.patterns || []);
      return response.data.patterns || [];
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar patrones');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    patterns,
    loading,
    error,
    fetchPatterns
  };
};

export default usePatrones;
