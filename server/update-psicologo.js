const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function updatePsicologo() {
  try {
    const email = 'psicologo@gmail.com';
    const password = 'psicologo123';
    const nombre = 'Psicólogo Deportivo';
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Buscar si el usuario existe
    const existingUser = await db.query(
      'SELECT id FROM usuarios WHERE rol = $1',
      ['psicologo_deportivo']
    );
    
    if (existingUser.rows.length > 0) {
      // Actualizar usuario existente
      const result = await db.query(
        'UPDATE usuarios SET email = $1, password_hash = $2, nombre = $3 WHERE rol = $4 RETURNING id, nombre, email, rol',
        [email, hashedPassword, nombre, 'psicologo_deportivo']
      );
      console.log('✓ Usuario psicólogo actualizado:', result.rows[0]);
    } else {
      // Crear nuevo usuario
      const result = await db.query(
        'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
        [nombre, email, hashedPassword, 'psicologo_deportivo']
      );
      console.log('✓ Usuario psicólogo creado:', result.rows[0]);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updatePsicologo();
