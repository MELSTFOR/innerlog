const db = require('./config/db');

async function runMigration() {
  try {
    console.log('Iniciando migración...');
    
    // Agregar columna last_activity si no existe
    await db.query(`
      ALTER TABLE usuarios 
      ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    
    console.log('✓ Columna last_activity agregada exitosamente');
    
    // Verificar que la columna existe
    const result = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' AND column_name = 'last_activity'
    `);
    
    if (result.rows.length > 0) {
      console.log('✓ Columna verificada en la tabla usuarios');
    } else {
      console.log('✗ Error: Columna no encontrada después de la migración');
      process.exit(1);
    }
    
    console.log('✓ Migración completada exitosamente');
    process.exit(0);
    
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
}

runMigration();
