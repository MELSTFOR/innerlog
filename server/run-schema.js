const fs = require('fs');
const { Pool } = require('pg');

const connectionString = `postgresql://postgres:melina89@localhost:5432/innerlog_db`;

async function createTables() {
  const pool = new Pool({ connectionString });
  try {
    const sql = fs.readFileSync('./models/schema.sql', 'utf8');
    await pool.query(sql);
    console.log('✓ Schema ejecutado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createTables();
