import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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

// Páginas del entrenador
import Entrenador from './pages/Entrenador';
import AtletaDetail from './pages/AtletaDetail';

// Página de comunidad
import Comunidad from './pages/Comunidad';

function App() {
  return (
    <Router>
      <AuthProvider>
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

          {/* Rutas del entrenador */}
          <Route
            path="/entrenador"
            element={
              <ProtectedRoute>
                <Entrenador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entrenador/atleta/:id"
            element={
              <ProtectedRoute>
                <AtletaDetail />
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
