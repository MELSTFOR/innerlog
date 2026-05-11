const db = require('./config/db');

async function cleanDatabase() {
  try {
    console.log('🧹 Iniciando limpieza de base de datos...\n');

    // Obtener el ID del psicólogo
    const psicologoResult = await db.query(
      'SELECT id FROM usuarios WHERE rol = $1',
      ['psicologo_deportivo']
    );
    
    if (psicologoResult.rows.length === 0) {
      console.log('⚠️ No se encontró usuario psicólogo');
      process.exit(1);
    }

    const psicologoId = psicologoResult.rows[0].id;
    console.log(`✓ Psicólogo encontrado (ID: ${psicologoId})\n`);

    // 1. Eliminar datos de sesiones de entrenamiento para todos los atletas
    const deleteSesiones = await db.query(
      'DELETE FROM sesiones_entrenamiento WHERE usuario_id IN (SELECT id FROM usuarios WHERE rol = $1)',
      ['atleta']
    );
    console.log(`✓ Eliminadas ${deleteSesiones.rowCount} sesiones de entrenamiento`);

    // 2. Eliminar datos de wellness para todos los atletas
    const deleteWellness = await db.query(
      'DELETE FROM wellness_entries WHERE usuario_id IN (SELECT id FROM usuarios WHERE rol = $1)',
      ['atleta']
    );
    console.log(`✓ Eliminadas ${deleteWellness.rowCount} entradas de wellness`);

    // 3. Eliminar datos de tests cognitivos para todos los atletas
    const deleteTests = await db.query(
      'DELETE FROM test_sessions WHERE usuario_id IN (SELECT id FROM usuarios WHERE rol = $1)',
      ['atleta']
    );
    console.log(`✓ Eliminados ${deleteTests.rowCount} tests cognitivos`);

    // 4. Eliminar readiness scores para todos los atletas
    const deleteReadiness = await db.query(
      'DELETE FROM readiness_scores WHERE usuario_id IN (SELECT id FROM usuarios WHERE rol = $1)',
      ['atleta']
    );
    console.log(`✓ Eliminados ${deleteReadiness.rowCount} readiness scores`);

    // 5. Eliminar intervenciones pendientes
    const deleteIntervenciones = await db.query(
      'DELETE FROM intervenciones WHERE completada = FALSE AND usuario_id IN (SELECT id FROM usuarios WHERE rol = $1)',
      ['atleta']
    );
    console.log(`✓ Eliminadas ${deleteIntervenciones.rowCount} intervenciones pendientes`);

    // 6. Limpiar feed/posts (si existe)
    try {
      const deleteFeed = await db.query(
        'DELETE FROM feed WHERE usuario_id NOT IN (SELECT id FROM usuarios WHERE rol = $1 OR id = $2)',
        ['psicologo_deportivo', psicologoId]
      );
      console.log(`✓ Eliminados ${deleteFeed.rowCount} posts del feed`);
    } catch (e) {
      console.log(`ℹ️  Tabla feed no encontrada o no accesible`);
    }

    // 7. Limpiar kudos
    const deleteKudos = await db.query(
      'DELETE FROM kudos'
    );
    console.log(`✓ Eliminados ${deleteKudos.rowCount} kudos`);

    // 8. Actualizar last_activity para los atletas a hace poco tiempo
    const updateLastActivity = await db.query(
      'UPDATE usuarios SET last_activity = NOW() - INTERVAL \'1 hour\' WHERE rol = $1',
      ['atleta']
    );
    console.log(`✓ Actualizados ${updateLastActivity.rowCount} atletas (last_activity)`);

    console.log('\n✅ Base de datos limpiada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error.message);
    process.exit(1);
  }
}

cleanDatabase();
