import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useEntrenador = () => {
  const [atletas, setAtletas] = useState([]);
  const [tendencia, setTendencia] = useState([]);
  const [atletaHistorial, setAtletaHistorial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener equipo con readiness
  const fetchEquipo = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/entrenador/equipo');
      setAtletas(response.data.atletas);
      return response.data.atletas;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar equipo');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener tendencia del equipo
  const fetchTendencia = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/entrenador/tendencia');
      setTendencia(response.data.tendencia);
      return response.data.tendencia;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar tendencia');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener historial de un atleta
  const fetchAtletaHistorial = useCallback(async (atletaId) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/entrenador/atleta/${atletaId}`);
      setAtletaHistorial(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar historial');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    atletas,
    tendencia,
    atletaHistorial,
    loading,
    error,
    fetchEquipo,
    fetchTendencia,
    fetchAtletaHistorial,
  };
};

export default useEntrenador;
