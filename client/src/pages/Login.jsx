import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('melina@fila.com');
  const [password, setPassword] = useState('running123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f1117' }}>
      <div className="w-full max-w-md" style={{ backgroundColor: '#1a1f2e' }}>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#00d4ff' }}>
            Inicia Sesión
          </h1>
          <p className="text-center mb-8" style={{ color: '#8b92a4' }}>
            Accede a INNERLOG
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg" style={{ color: '#ff6b6b' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c9d1d9' }}>
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-cyan-400 transition"
                style={{
                  backgroundColor: '#0f1117',
                  borderColor: '#30363d',
                  color: '#c9d1d9',
                }}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c9d1d9' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-cyan-400 transition"
                style={{
                  backgroundColor: '#0f1117',
                  borderColor: '#30363d',
                  color: '#c9d1d9',
                }}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg font-semibold transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#00d4ff', color: '#0f1117' }}
            >
              {loading ? 'Iniciando sesión...' : 'Inicia Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: '#8b92a4' }}>
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-semibold hover:underline"
                style={{ color: '#00d4ff' }}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
