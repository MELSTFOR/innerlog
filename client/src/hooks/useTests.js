import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Crear resultado de test
  const createTest = useCallback(async (dataTest) => {
    try {
      const response = await api.post('/tests', dataTest);
      setTests([response.data.test, ...tests]);
      return { success: true, test: response.data.test };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Error al guardar test',
      };
    }
  }, [tests]);

  // Obtener todos los tests
  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/tests');
      setTests(response.data.tests);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar tests');
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener tests por tipo
  const fetchTestsByType = useCallback(async (tipo) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/tests/${tipo}`);
      return response.data.tests;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar tests');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tests,
    loading,
    error,
    createTest,
    fetchTests,
    fetchTestsByType,
  };
};

export default useTests;
