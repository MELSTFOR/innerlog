const { Pool } = require('pg');

const connectionString = `postgresql://postgres:melina89@localhost:5432/innerlog_db`;

async function checkDB() {
  const pool = new Pool({ connectionString });
  try {
    const result = await pool.query('SELECT id, nombre, email FROM usuarios LIMIT 10');
    console.log('Usuarios en la BD:');
    console.table(result.rows);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkDB();
