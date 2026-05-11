const { Pool } = require('pg');

async function cleanUserData() {
  const connectionString = `postgresql://postgres:melina89@localhost:5432/innerlog_db`;
  const pool = new Pool({
    connectionString: connectionString,
    ssl: false,
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('✓ Connected successfully');

    // Obtener ID del usuario
    console.log('Finding user mforgiarini@atleta.com...');
    const userResult = await client.query(
      'SELECT id, nombre FROM usuarios WHERE email = $1',
      ['mforgiarini@atleta.com']
    );

    if (userResult.rows.length === 0) {
      console.log('❌ Usuario no encontrado');
      client.release();
      pool.end();
      return;
    }

    const userId = userResult.rows[0].id;
    const userName = userResult.rows[0].nombre;
    console.log(`✓ Found user: ${userName}`);

    // Limpiar historial del usuario
    console.log('Cleaning user data...');
    
    await client.query('DELETE FROM intervenciones WHERE usuario_id = $1', [userId]);
    console.log('  ✓ Intervenciones deleted');
    
    await client.query('DELETE FROM test_sessions WHERE usuario_id = $1', [userId]);
    console.log('  ✓ Test sessions deleted');
    
    await client.query('DELETE FROM sesiones_entrenamiento WHERE usuario_id = $1', [userId]);
    console.log('  ✓ Training sessions deleted');
    
    await client.query('DELETE FROM wellness_entries WHERE usuario_id = $1', [userId]);
    console.log('  ✓ Wellness entries deleted');
    
    await client.query('DELETE FROM readiness_scores WHERE usuario_id = $1', [userId]);
    console.log('  ✓ Readiness scores deleted');

    console.log('\n✓ All historical data cleaned!');

    client.release();
    pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanUserData();
