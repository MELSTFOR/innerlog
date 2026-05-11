const { Pool } = require('pg');

async function updateUserEmail() {
  const connectionString = `postgresql://postgres:melina89@localhost:5432/innerlog_db`;
  const pool = new Pool({
    connectionString: connectionString,
    ssl: false,
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('✓ Connected successfully');

    // Actualizar email de Melina
    console.log('Updating Melina\'s email...');
    const result = await client.query(
      'UPDATE usuarios SET email = $1 WHERE email = $2 RETURNING id, nombre, email',
      ['mforgiarini@atleta.com', 'mforgiarini@atleta']
    );

    if (result.rows.length > 0) {
      console.log(`✓ Email updated successfully`);
      console.log(`  Usuario: ${result.rows[0].nombre}`);
      console.log(`  Nuevo email: ${result.rows[0].email}`);
    } else {
      console.log('Usuario no encontrado');
    }

    client.release();
    pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateUserEmail();
