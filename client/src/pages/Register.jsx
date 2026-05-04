import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'atleta',
    deporte: '',
    nivel: 'principiante',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { value: 'atleta', label: 'Atleta' },
    { value: 'entrenador', label: 'Entrenador' },
    { value: 'club', label: 'Club' },
  ];

  const niveles = [
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' },
  ];

  const deportes = [
    'Atletismo',
    'Natación',
    'Ciclismo',
    'Triatlón',
    'Fútbol',
    'Tenis',
    'Otro',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.nombre,
      formData.email,
      formData.password,
      formData.rol,
      formData.deporte,
      formData.nivel
    );

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8" style={{ backgroundColor: '#0f1117' }}>
      <div className="w-full max-w-md" style={{ backgroundColor: '#1a1f2e' }}>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#00d4ff' }}>
            Regístrate
          </h1>
          <p className="text-center mb-8" style={{ color: '#8b92a4' }}>
            Crea tu cuenta en INNERLOG
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg" style={{ color: '#ff6b6b' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c9d1d9' }}>
                Nombre Completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-cyan-400 transition"
                style={{
                  backgroundColor: '#0f1117',
                  borderColor: '#30363d',
                  color: '#c9d1d9',
                }}
                placeholder="Tu nombre"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c9d1d9' }}>
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c9d1d9' }}>
                Rol
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-cyan-400 transition"
                style={{
                  backgroundColor: '#0f1117',
                  borderColor: '#30363d',
                  color: '#c9d1d9',
                }}
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value} style={{ backgroundColor: '#1a1f2e' }}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Deporte */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c9d1d9' }}>
                Deporte
              </label>
              <select
                name="deporte"
                value={formData.deporte}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-cyan-400 transition"
                style={{
                  backgroundColor: '#0f1117',
                  borderColor: '#30363d',
                  color: '#c9d1d9',
                }}
                required
              >
                <option value="">Selecciona un deporte</option>
                {deportes.map((deporte) => (
                  <option key={deporte} value={deporte} style={{ backgroundColor: '#1a1f2e' }}>
                    {deporte}
                  </option>
                ))}
              </select>
            </div>

            {/* Nivel */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c9d1d9' }}>
                Nivel
              </label>
              <select
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-cyan-400 transition"
                style={{
                  backgroundColor: '#0f1117',
                  borderColor: '#30363d',
                  color: '#c9d1d9',
                }}
              >
                {niveles.map((nivel) => (
                  <option key={nivel.value} value={nivel.value} style={{ backgroundColor: '#1a1f2e' }}>
                    {nivel.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c9d1d9' }}>
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c9d1d9' }}>
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: '#8b92a4' }}>
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-semibold hover:underline"
                style={{ color: '#00d4ff' }}
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
