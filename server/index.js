const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const sesionesRoutes = require('./routes/sesionesRoutes');
const wellnessRoutes = require('./routes/wellnessRoutes');
const testsRoutes = require('./routes/testsRoutes');
const readinessRoutes = require('./routes/readinessRoutes');
const entrenadorRoutes = require('./routes/entrenadorRoutes');
const psicologoRoutes = require('./routes/psicologoDeportivoRoutes');
const comunidadRoutes = require('./routes/comunidadRoutes');
const kudosRoutes = require('./routes/kudosRoutes');
const patronesRoutes = require('./routes/patronesRoutes');
const intervencionesRoutes = require('./routes/intervencionesRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
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
app.use('/api/psicologo', psicologoRoutes);
app.use('/api/comunidad', comunidadRoutes);
app.use('/api/kudos', kudosRoutes);
app.use('/api/patrones', patronesRoutes);
app.use('/api/intervenciones', intervencionesRoutes);
app.use('/api/reporte', reporteRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Admin endpoint - ejecutar seed (SOLO PARA SETUP INICIAL)
app.post('/api/admin/seed', async (req, res) => {
  try {
    // En desarrollo/setup, permitir sin token o con token simple
    // En producción, requiere token correcto
    const adminToken = req.headers['x-admin-token'];
    const configuredToken = process.env.ADMIN_TOKEN;
    
    // Si no hay token configurado, es setup - permitir con cualquier token o sin token
    // Si hay token configurado, debe coincidir
    if (configuredToken && adminToken !== configuredToken) {
      return res.status(401).json({ error: 'Unauthorized - Invalid admin token' });
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return res.status(500).json({ error: 'DATABASE_URL not configured' });
    }

    const pool = new Pool({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false },
    });

    const client = await pool.connect();
    console.log('🌱 Ejecutando seed...');

    // Leer y ejecutar schema.sql
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'models', 'schema.sql'), 'utf8');
    console.log('📋 Ejecutando schema.sql...');
    await client.query(schemaSQL);
    console.log('✓ Schema creado exitosamente');

    // Leer y ejecutar seed.sql
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    console.log('📋 Ejecutando seed.sql...');
    await client.query(seedSQL);
    console.log('✓ Datos de seed insertados exitosamente');

    client.release();
    await pool.end();

    res.json({ 
      message: 'Seed executed successfully',
      status: 'completed'
    });
  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Manejo de rutas no encontradas - con más logging
app.use((req, res) => {
  console.log(`⚠️  404 - ${req.method} ${req.path} (query: ${JSON.stringify(req.query)})`);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Salud: http://localhost:${PORT}/health`);
});
