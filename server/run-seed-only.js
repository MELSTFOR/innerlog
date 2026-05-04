const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSeed() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    // First, let's check what users exist
    console.log('\n=== Current Users ===');
    const users = await client.query('SELECT id, nombre, email, rol FROM usuarios');
    console.log(users.rows);
    
    // Delete existing data to start fresh
    console.log('\n=== Clearing existing data ===');
    await client.query('DELETE FROM readiness_scores');
    await client.query('DELETE FROM kudos');
    await client.query('DELETE FROM retos');
    await client.query('DELETE FROM test_sessions');
    await client.query('DELETE FROM wellness_entries');
    await client.query('DELETE FROM sesiones_entrenamiento');
    await client.query('DELETE FROM usuarios WHERE email IN (\'pedro@fila.com\', \'melina@fila.com\')');
    await client.query('DELETE FROM equipos');
    console.log('✓ Cleared old data');
    
    // Now run the seed
    console.log('\n=== Inserting seed data ===');
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = seedSQL.split(';').filter(s => s.trim());
    for (const statement of statements) {
      try {
        await client.query(statement);
      } catch (err) {
        console.warn('Warning:', err.message);
      }
    }
    console.log('✓ Seed data inserted');
    
    // Verify
    console.log('\n=== Verification ===');
    const finalUsers = await client.query('SELECT id, nombre, email, rol FROM usuarios ORDER BY email');
    console.log('Users:', finalUsers.rows);
    
    const melinaData = await client.query('SELECT * FROM usuarios WHERE email = \'melina@fila.com\'');
    if (melinaData.rows.length > 0) {
      console.log('\n✓ Melina found in database!');
      console.log('ID:', melinaData.rows[0].id);
      console.log('Email:', melinaData.rows[0].email);
      console.log('Password Hash:', melinaData.rows[0].password_hash.substring(0, 20) + '...');
    } else {
      console.log('\n✗ Melina NOT found in database');
    }
    
    client.release();
    await pool.end();
    console.log('\n✓ Database seeding completed!');
  } catch (error) {
    console.error('Fatal error:', error.message);
    console.error(error);
    await pool.end();
    process.exit(1);
  }
}

runSeed();
