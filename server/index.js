const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const sesionesRoutes = require('./routes/sesionesRoutes');
const wellnessRoutes = require('./routes/wellnessRoutes');
const testsRoutes = require('./routes/testsRoutes');
const readinessRoutes = require('./routes/readinessRoutes');
const entrenadorRoutes = require('./routes/entrenadorRoutes');
const comunidadRoutes = require('./routes/comunidadRoutes');
const kudosRoutes = require('./routes/kudosRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/readiness', readinessRoutes);
app.use('/api/entrenador', entrenadorRoutes);
app.use('/api/comunidad', comunidadRoutes);
app.use('/api/kudos', kudosRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Salud: http://localhost:${PORT}/health`);
});
