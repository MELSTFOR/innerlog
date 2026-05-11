const db = require('./config/db');

async function testDB() {
  try {
    // Test 1: Get all usuarios
    console.log('\n===== USUARIOS =====');
    const usersRes = await db.query('SELECT id, nombre, email, rol, equipo_id FROM usuarios ORDER BY id');
    console.log(usersRes.rows);

    // Test 2: Get all equipos
    console.log('\n===== EQUIPOS =====');
    const equiposRes = await db.query('SELECT id, nombre, entrenador_id FROM equipos');
    console.log(equiposRes.rows);

    // Test 3: Get Pedro's info
    console.log('\n===== PEDRO (entrenador) =====');
    const pedroRes = await db.query('SELECT id, nombre, rol, equipo_id FROM usuarios WHERE email = $1', ['pedro@fila.com']);
    console.log(pedroRes.rows[0]);

    // Test 4: Get Pedro's equipo
    console.log('\n===== PEDRO\'S TEAM =====');
    const pedroTeamRes = await db.query('SELECT e.id, e.nombre, e.entrenador_id FROM equipos WHERE entrenador_id = $1', [pedroRes.rows[0]?.id]);
    console.log(pedroTeamRes.rows);

    // Test 5: Get atletas in Pedro's team
    console.log('\n===== ATLETAS IN PEDRO\'S TEAM =====');
    if (pedroTeamRes.rows[0]) {
      const atletasRes = await db.query(
        'SELECT u.id, u.nombre, u.email, u.rol, u.equipo_id FROM usuarios u WHERE u.equipo_id = $1 AND u.rol = $2 ORDER BY u.nombre',
        [pedroTeamRes.rows[0].id, 'atleta']
      );
      console.log(atletasRes.rows);
    } else {
      console.log('Pedro has no team');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testDB();
