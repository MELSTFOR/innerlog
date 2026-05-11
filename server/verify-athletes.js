const db = require('./config/db');

async function testDB() {
  try {
    // Test: Get Pedro's atletas
    console.log('\n===== VERIFYING PEDRO\'S ATHLETES =====');
    
    const result = await db.query(`
      SELECT u.id, u.nombre, u.email, u.rol, u.equipo_id, e.nombre as equipo
      FROM usuarios u
      LEFT JOIN equipos e ON u.equipo_id = e.id
      WHERE u.equipo_id IN (
        SELECT id FROM equipos WHERE entrenador_id = (
          SELECT id FROM usuarios WHERE email = 'pedro@fila.com'
        )
      )
    `);
    
    console.log('Athletes found:', result.rows.length);
    result.rows.forEach(row => {
      console.log(`  - ${row.nombre} (${row.email}) in ${row.equipo}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testDB();
