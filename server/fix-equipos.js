const db = require('./config/db');

async function fixDB() {
  try {
    // Update equipos to assign to Pedro instead of Fernando
    console.log('Updating equipo entrenador...');
    
    // Get Pedro's ID
    const pedroRes = await db.query('SELECT id FROM usuarios WHERE email = $1', ['pedro@fila.com']);
    const pedroId = pedroRes.rows[0]?.id;
    
    if (!pedroId) {
      console.error('Pedro not found');
      process.exit(1);
    }
    
    // Update equipo
    const updateRes = await db.query(
      'UPDATE equipos SET entrenador_id = $1 WHERE id = 1',
      [pedroId]
    );
    
    console.log(`Updated equipo 1 to be managed by Pedro (id=${pedroId})`);
    console.log(`Rows updated: ${updateRes.rowCount}`);
    
    // Verify
    const verifyRes = await db.query('SELECT id, nombre, entrenador_id FROM equipos WHERE id = 1');
    console.log('Updated equipo:', verifyRes.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixDB();
