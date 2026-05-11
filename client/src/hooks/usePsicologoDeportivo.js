import { useState, useCallback } from 'react';
import api from '../utils/api';

export const usePsicologoDeportivo = () => {
  const [atletas, setAtletas] = useState([]);
  const [atletasInactivos, setAtletasInactivos] = useState([]);
  const [intervenciones, setIntervenciones] = useState([]);
  const [resumenAtleta, setResumenAtleta] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener atletas asignados
  const fetchAtletasAsignados = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/psicologo/atletas');
      setAtletas(response.data.atletas);
      return response.data.atletas;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar atletas');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener atletas inactivos
  const fetchAtletasInactivos = useCallback(async (dias = 3) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/psicologo/atletasInactivos?dias=${dias}`);
      setAtletasInactivos(response.data.atletasInactivos);
      return response.data.atletasInactivos;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar atletas inactivos');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener intervenciones asignadas
  const fetchIntervencionesAsignadas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/psicologo/intervenciones');
      setIntervenciones(response.data.intervenciones);
      return response.data.intervenciones;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar intervenciones');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener resumen de un atleta
  const fetchResumenAtleta = useCallback(async (atletaId) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/psicologo/atleta/${atletaId}`);
      setResumenAtleta(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar resumen');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener estadísticas
  const fetchEstadisticas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/psicologo/estadisticas');
      setEstadisticas(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar estadísticas');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Asignar intervención
  const asignarIntervencion = useCallback(async (atletaId, tipo, titulo, descripcion, duracion_minutos) => {
    setError('');
    try {
      const response = await api.post('/psicologo/asignar-intervencion', {
        atletaId,
        tipo,
        titulo,
        descripcion,
        duracion_minutos
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al asignar intervención');
      throw err;
    }
  }, []);

  return {
    atletas,
    atletasInactivos,
    intervenciones,
    resumenAtleta,
    estadisticas,
    loading,
    error,
    fetchAtletasAsignados,
    fetchAtletasInactivos,
    fetchIntervencionesAsignadas,
    fetchResumenAtleta,
    fetchEstadisticas,
    asignarIntervencion
  };
};

export default usePsicologoDeportivo;
