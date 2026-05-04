import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useSesiones = () => {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener todas las sesiones
  const fetchSesiones = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/sesiones');
      setSesiones(response.data.sesiones);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar sesiones');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva sesión
  const createSesion = useCallback(async (dataSesion) => {
    try {
      const response = await api.post('/sesiones', dataSesion);
      setSesiones([response.data.sesion, ...sesiones]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Error al crear sesión',
      };
    }
  }, [sesiones]);

  // Actualizar sesión
  const updateSesion = useCallback(async (id, dataSesion) => {
    try {
      const response = await api.patch(`/sesiones/${id}`, dataSesion);
      setSesiones(
        sesiones.map((s) => (s.id === id ? response.data.sesion : s))
      );
      return { success: true, sesion: response.data.sesion };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Error al actualizar sesión',
      };
    }
  }, [sesiones]);

  // Eliminar sesión
  const deleteSesion = useCallback(async (id) => {
    try {
      await api.delete(`/sesiones/${id}`);
      setSesiones(sesiones.filter((s) => s.id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Error al eliminar sesión',
      };
    }
  }, [sesiones]);

  return {
    sesiones,
    loading,
    error,
    fetchSesiones,
    createSesion,
    updateSesion,
    deleteSesion,
  };
};

export default useSesiones;
