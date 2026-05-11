const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSeed() {
  // Construir string de conexión sin usar DATABASE_URL
  const connectionString = `postgresql://postgres:melina89@localhost:5432/innerlog_db`;

  const pool = new Pool({
    connectionString: connectionString,
    ssl: false,
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('✓ Connected successfully');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await client.query('DELETE FROM test_sessions');
    await client.query('DELETE FROM sesiones_entrenamiento');
    await client.query('DELETE FROM wellness_entries');
    await client.query('DELETE FROM readiness_scores');
    await client.query('DELETE FROM usuarios WHERE rol = \'atleta\'');
    console.log('✓ Data cleared');
    
    // Read and execute seed.sql
    console.log('Reading seed.sql...');
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    console.log('Executing seed.sql...');
    await client.query(seedSQL);
    console.log('✓ Seed data inserted successfully');
    
    client.release();
    await pool.end();
    console.log('✓ All done!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

runSeed();
