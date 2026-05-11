import { useState, useCallback } from 'react';
import api from '../utils/api';

const useIntervenciones = () => {
  const [suggestedIntervention, setSuggestedIntervention] = useState(null);
  const [history, setHistory] = useState([]);
  const [prescribedInterventions, setPrescribedInterventions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSuggestedIntervention = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/intervenciones/sugerida');
      setSuggestedIntervention(response.data.intervention);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar intervención sugerida');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeIntervention = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post(`/intervenciones/${id}/completar`);
      setSuggestedIntervention(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al completar intervención');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (limit = 20, offset = 0) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/intervenciones/historial?limit=${limit}&offset=${offset}`);
      setHistory(response.data.intervenciones);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar historial');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrescribedInterventions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/intervenciones/prescritas');
      setPrescribedInterventions(response.data.intervenciones);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar intervenciones prescritas');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    suggestedIntervention,
    history,
    prescribedInterventions,
    loading,
    error,
    fetchSuggestedIntervention,
    completeIntervention,
    fetchHistory,
    fetchPrescribedInterventions
  };
};

export default useIntervenciones;
