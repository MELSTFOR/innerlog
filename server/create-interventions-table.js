const { Pool } = require('pg');

const connectionString = `postgresql://postgres:melina89@localhost:5432/innerlog_db`;

async function createInterventionsTable() {
  const pool = new Pool({ connectionString });
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS intervenciones (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL,
        tipo VARCHAR(50),
        descripcion TEXT,
        duracion_minutos INTEGER,
        fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completada BOOLEAN DEFAULT FALSE,
        fecha_completada TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_intervenciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_intervenciones_usuario_id ON intervenciones(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_intervenciones_tipo ON intervenciones(tipo);
      CREATE INDEX IF NOT EXISTS idx_intervenciones_fecha_asignacion ON intervenciones(fecha_asignacion);
      CREATE INDEX IF NOT EXISTS idx_intervenciones_completada ON intervenciones(completada);
    `);
    console.log('✓ Tabla intervenciones creada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createInterventionsTable();
