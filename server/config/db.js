const { Pool } = require('pg');
require('dotenv').config();

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'innerlog_db',
});

// Manejo de errores de conexión
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});

// Función para ejecutar queries
const query = (text, params) => {
  const start = Date.now();
  return pool.query(text, params).then((result) => {
    const duration = Date.now() - start;
    console.log('Query ejecutada:', { text, duration: `${duration}ms`, rows: result.rowCount });
    return result;
  });
};

// Función para obtener un cliente (para transacciones)
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

module.exports = {
  query,
  getClient,
  pool,
};
