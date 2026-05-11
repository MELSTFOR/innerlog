import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario y token al montar
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Obtener datos actualizados del usuario incluyendo equipo
      api.get('/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` }
      }).then(response => {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }).catch(err => {
        console.error('Error al actualizar usuario:', err);
      });
    }

    setLoading(false);
  }, []);

  // Función de registro
  const register = async (nombre, email, password, rol, deporte, nivel) => {
    try {
      const response = await api.post('/auth/register', {
        nombre,
        email,
        password,
        rol,
        deporte,
        nivel,
      });

      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error en el registro',
      };
    }
  };

  // Función de login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error en el inicio de sesión',
      };
    }
  };

  // Función de logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  // Función para obtener usuario actual
  const getMe = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    getMe,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
