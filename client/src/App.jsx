import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import api from './utils/api';

// Páginas de autenticación
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard
import Inicio from './pages/Inicio';

// Páginas del módulo de sesiones
import Registro from './pages/Registro';
import Historia from './pages/Historia';
import Resumen from './pages/Resumen';

// Páginas del módulo de wellness y tests
import Wellness from './pages/Wellness';
import Tests from './pages/Tests';

// Páginas de análisis
import Patrones from './pages/Patrones';
import Reporte from './pages/Reporte';

// Página del psicólogo deportivo
import PsicologoDeportivo from './pages/PsicologoDeportivo';

// Página de comunidad
import Comunidad from './pages/Comunidad';

// Componente para rastrear actividad
function ActivityTracker() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    // Actualizar actividad cuando cambia de ruta
    const updateActivity = async () => {
      try {
        await api.post('/auth/update-activity');
      } catch (error) {
        // Error silencioso para no interrumpir la experiencia del usuario
        console.debug('Activity update:', error);
      }
    };

    updateActivity();
  }, [location.pathname, user]);

  // Actualizar actividad cada 5 minutos
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        await api.post('/auth/update-activity');
      } catch (error) {
        console.debug('Periodic activity update:', error);
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [user]);

  return null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ActivityTracker />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/inicio"
            element={
              <ProtectedRoute>
                <Inicio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registro"
            element={
              <ProtectedRoute>
                <Registro />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historia"
            element={
              <ProtectedRoute>
                <Historia />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resumen"
            element={
              <ProtectedRoute>
                <Resumen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wellness"
            element={
              <ProtectedRoute>
                <Wellness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tests"
            element={
              <ProtectedRoute>
                <Tests />
              </ProtectedRoute>
            }
          />

          {/* Rutas de análisis */}
          <Route
            path="/patrones"
            element={
              <ProtectedRoute>
                <Patrones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reporte"
            element={
              <ProtectedRoute>
                <Reporte />
              </ProtectedRoute>
            }
          />

          {/* Rutas del psicólogo deportivo */}
          <Route
            path="/psicologo"
            element={
              <ProtectedRoute>
                <PsicologoDeportivo />
              </ProtectedRoute>
            }
          />

          {/* Ruta de comunidad */}
          <Route
            path="/comunidad"
            element={
              <ProtectedRoute>
                <Comunidad />
              </ProtectedRoute>
            }
          />

          {/* Redireccionar raíz a inicio */}
          <Route path="/" element={<Navigate to="/inicio" replace />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
