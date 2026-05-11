import { useState, useCallback } from 'react';
import api from '../utils/api';

const useReporte = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeeklyReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/reporte/semana');
      setReport(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar reporte');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    report,
    loading,
    error,
    fetchWeeklyReport
  };
};

export default useReporte;
