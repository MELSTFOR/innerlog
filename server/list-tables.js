const { Pool } = require('pg');

const connectionString = `postgresql://postgres:melina89@localhost:5432/innerlog_db`;

async function checkTables() {
  const pool = new Pool({ connectionString });
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('Tablas en la BD:');
    result.rows.forEach(row => console.log('  -', row.table_name));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkTables();
