import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import logo from '../assets/logoinnerlog.png';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error, user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsValidating(true);

    // Validaciones básicas
    if (!email.trim()) {
      setLocalError('Por favor ingresa tu correo electrónico');
      setIsValidating(false);
      return;
    }
    if (!password.trim()) {
      setLocalError('Por favor ingresa tu contraseña');
      setIsValidating(false);
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setLocalError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsValidating(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center overflow-hidden relative">
      {/* Gradient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/3 blur-[250px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl h-screen grid grid-cols-1 lg:grid-cols-2 gap-0">
        
        {/* LEFT SIDE - Brand Message */}
        <div className="hidden lg:flex flex-col justify-center px-8 xl:px-20 py-12">
          
          {/* Logo Section */}
          <div className="-mb-8">
            <img
              src={logo}
              alt="INNERLOG"
              className="h-72 drop-shadow-[0_0_25px_rgba(0,212,255,0.1)] transition-transform duration-500"
            />
          </div>

          {/* Main Message */}
          <div className="max-w-lg mb-2">
            {/* Tagline */}
            <div className="inline-block mb-4">
              <p className="text-cyan-400/80 text-xs font-mono tracking-[0.25em] uppercase mb-1">
                Sistema de Alto Rendimiento Mental
              </p>
              <div className="h-px bg-gradient-to-r from-cyan-400/50 to-transparent" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl xl:text-5xl font-light tracking-tight text-white leading-[1] mb-4">
              <span className="block">El deporte</span>
              <span className="block">debería enseñarte</span>
              <span className="block text-cyan-400/70">algo más que competir.</span>
            </h1>

            {/* Description */}
            <p className="text-xs xl:text-sm text-zinc-400 leading-relaxed max-w-md font-light mb-2">
              INNERLOG es tu bitácora deportiva y cognitiva. Aprende a desarrollar mentalidad, conciencia y herramientas para la vida a través del deporte.
            </p>

            {/* Philosophy */}
            <div className="mt-2 pt-2 border-t border-zinc-800/50">
              <p className="text-xs tracking-[0.15em] text-zinc-600 uppercase font-medium mb-2">
                Filosofía
              </p>
              <p className="text-xs text-zinc-500 italic font-light">
                "El deporte tiene que hacerte más inteligente."
              </p>
            </div>
          </div>

          {/* Bottom Detail */}
          <div className="flex items-center gap-4 pt-4 border-t border-zinc-800/30">
            <div className="w-8 h-px bg-gradient-to-r from-cyan-400/30 to-transparent" />
            <p className="text-xs text-zinc-600 tracking-[0.1em] uppercase">
              Diseñado para atletas conscientes
            </p>
          </div>

        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="flex flex-col lg:justify-center items-center px-6 sm:px-8 lg:px-12 xl:px-16 py-20 lg:py-0 w-full">
          
          {/* Mobile Logo - Only visible on mobile */}
          <div className="lg:hidden mb-2 mt-2">
            <img
              src={logo}
              alt="INNERLOG"
              className="h-40 drop-shadow-[0_0_25px_rgba(0,212,255,0.1)]"
            />
          </div>

          {/* Login Card */}
          <div className="w-full max-w-md">
            
            {/* Card Background with Glassmorphism */}
            <div className="relative">
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/10 rounded-3xl blur opacity-0 lg:opacity-100" />
              
              {/* Card Content */}
              <div className="relative bg-[#161b26]/80 backdrop-blur-2xl border border-cyan-400/10 rounded-3xl p-7 shadow-2xl shadow-cyan-900/20">

                {/* Header */}
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-400/60 font-semibold mb-2">
                    Acceso
                  </p>
                  <h2 className="text-2xl font-light text-white tracking-tight">
                    Bienvenido
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 font-light">
                    Continúa desenvolviendo tu conciencia mental
                  </p>
                </div>

                {/* Error Message */}
                {displayError && (
                  <div className="mb-3 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                    <ExclamationCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300 font-light">{displayError}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Email Input */}
                  <div className="relative">
                    <label className="text-xs uppercase tracking-[0.1em] text-zinc-400 font-semibold block mb-3">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      disabled={loading || isValidating}
                      className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-400/50 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 font-light disabled:opacity-50"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <label className="text-xs uppercase tracking-[0.1em] text-zinc-400 font-semibold block mb-3">
                      Contraseña
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading || isValidating}
                        className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-400/50 px-5 pr-14 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 font-light disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading || isValidating}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-cyan-400 transition-colors duration-200 disabled:opacity-50"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || isValidating}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-400 text-[#0f1117] font-semibold text-base mt-4 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:from-cyan-300 hover:to-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {loading || isValidating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#0f1117]/30 border-t-[#0f1117] rounded-full animate-spin" />
                        <span>Validando...</span>
                      </>
                    ) : (
                      <>
                        <span>Ingresar</span>
                        <ArrowRightIcon className="w-5 h-5" />
                      </>
                    )}
                  </button>

                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/5" />
                  <p className="text-xs text-zinc-600 font-light">o</p>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Register Link */}
                <button
                  onClick={() => navigate('/register')}
                  disabled={loading || isValidating}
                  className="w-full h-10 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-light transition-all duration-200 text-sm disabled:opacity-50"
                >
                  Crear nueva cuenta
                </button>

              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-3 text-center">
              <p className="text-xs text-zinc-600 font-light tracking-wide">
                INNERLOG v1.0 • Tu sistema de alto rendimiento mental
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}