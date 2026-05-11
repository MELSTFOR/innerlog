const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSeed() {
  const connectionString = `postgresql://postgres:melina89@localhost:5432/innerlog_db`;
  const pool = new Pool({
    connectionString: connectionString,
    ssl: false,
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('✓ Connected successfully');
    
    // Clear existing data
    console.log('Clearing existing data...');
    try { await client.query('DELETE FROM intervenciones'); } catch (e) {}
    await client.query('DELETE FROM test_sessions');
    await client.query('DELETE FROM sesiones_entrenamiento');
    await client.query('DELETE FROM wellness_entries');
    await client.query('DELETE FROM readiness_scores');
    await client.query('DELETE FROM usuarios WHERE rol = \'atleta\'');
    console.log('✓ Data cleared');
    
    // Get team ID
    const teamResult = await client.query(
      'SELECT id FROM equipos WHERE nombre = \'Fila Running Team\''
    );
    const teamId = teamResult.rows[0].id;
    
    // Create athletes
    console.log('Creating athletes...');
    const athletes = [
      { nombre: 'Melina Forgiarini', email: 'mforgiarini@atleta.com', nivel: 'avanzado' },
      { nombre: 'Juan Martínez', email: 'juan@fila.com', nivel: 'avanzado' },
      { nombre: 'Sofía García', email: 'sofia@fila.com', nivel: 'intermedio' }
    ];

    const athleteIds = {};
    for (const athlete of athletes) {
      const result = await client.query(
        `INSERT INTO usuarios (nombre, email, password_hash, rol, deporte, nivel, equipo_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO UPDATE SET nombre = $1 RETURNING id`,
        [athlete.nombre, athlete.email, '$2a$10$MZ/UgGaYgRjpjkmm7Yl4EeFyaUsROH0MJGgni341W3n54QhJ2JhB.', 'atleta', 'Atletismo', athlete.nivel, teamId]
      );
      athleteIds[athlete.email] = result.rows[0].id;
      console.log(`  ✓ ${athlete.nombre}`);
    }

    // Add 30 days of data for each athlete
    console.log('Adding 30 days of historical data...');
    
    for (const [email, userId] of Object.entries(athleteIds)) {
      console.log(`  Adding data for ${email}...`);
      
      for (let day = 29; day >= 0; day--) {
        const date = new Date();
        date.setDate(date.getDate() - day);
        const dateStr = date.toISOString();
        
        // Wellness entries (daily)
        const fatiga = 2 + Math.floor(Math.random() * 4);
        const sueno = 2 + Math.floor(Math.random() * 4);
        const dolor = Math.floor(Math.random() * 4);
        const estres = 1 + Math.floor(Math.random() * 4);
        
        await client.query(
          `INSERT INTO wellness_entries (usuario_id, fatiga, sueno, dolor, estres, timestamp)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [userId, fatiga, sueno, dolor, estres, dateStr]
        );
        
        // Sesiones de entrenamiento (4 per week)
        if (day % 2 === 0) {
          const esfuerzo = 5 + Math.floor(Math.random() * 4);
          const enfoque = 5 + Math.floor(Math.random() * 4);
          const emocional = 5 + Math.floor(Math.random() * 4);
          const satisfaccion = 6 + Math.floor(Math.random() * 3);
          
          await client.query(
            `INSERT INTO sesiones_entrenamiento (usuario_id, esfuerzo_mental, enfoque, emocional, fatiga_carrera, satisfaccion, notas, timestamp)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT DO NOTHING`,
            [userId, esfuerzo, enfoque, emocional, 3 + Math.floor(Math.random() * 3), satisfaccion, 'Sesión de entrenamiento', dateStr]
          );
        }
        
        // Tests (2-3 per week)
        if (day % 3 === 0) {
          const testTypes = ['PVTB', 'Stroop', 'MSIT'];
          const tipo = testTypes[Math.floor(Math.random() * testTypes.length)];
          const precision = 70 + Math.floor(Math.random() * 25);
          const trMedio = 300 + Math.floor(Math.random() * 200);
          
          await client.query(
            `INSERT INTO test_sessions (usuario_id, tipo_test, precision, tr_medio, duracion, timestamp)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT DO NOTHING`,
            [userId, tipo, precision, trMedio, 120, dateStr]
          );
        }
      }
    }
    
    // Create readiness scores
    console.log('Calculating readiness scores...');
    for (const userId of Object.values(athleteIds)) {
      for (let day = 29; day >= 0; day--) {
        const date = new Date();
        date.setDate(date.getDate() - day);
        const dateStr = date.toISOString().split('T')[0];
        
        // Calculate readiness score
        const scoreCalc = await client.query(
          `SELECT 
            ROUND((COALESCE((5 - (fatiga + sueno + dolor + estres) / 4.0) * 20, 50))::numeric, 1) as score
          FROM wellness_entries
          WHERE usuario_id = $1 AND DATE(timestamp) = $2`,
          [userId, dateStr]
        );
        
        if (scoreCalc.rows.length > 0 && scoreCalc.rows[0].score) {
          const score = Math.max(20, Math.min(100, scoreCalc.rows[0].score));
          
          await client.query(
            `INSERT INTO readiness_scores (usuario_id, score, fecha)
             VALUES ($1, $2, $3)
             ON CONFLICT (usuario_id, fecha) DO UPDATE SET score = $2`,
            [userId, score, dateStr]
          );
        }
      }
    }
    
    // Create some interventions (skip if table doesn't exist)
    console.log('Creating interventions...');
    try {
      for (const [email, userId] of Object.entries(athleteIds)) {
        // Create 2-3 interventions per athlete
        const numInterventions = 2 + Math.floor(Math.random() * 2);
        const tiposIntervenciones = ['respiracion', 'activacion', 'recuperacion'];
        
        for (let i = 0; i < numInterventions; i++) {
          const tipo = tiposIntervenciones[Math.floor(Math.random() * tiposIntervenciones.length)];
          const completada = Math.random() > 0.3;
          const fechaAsignacion = new Date();
          fechaAsignacion.setDate(fechaAsignacion.getDate() - Math.floor(Math.random() * 15));
          
          await client.query(
            `INSERT INTO intervenciones (usuario_id, tipo, titulo, descripcion, duracion_minutos, completada, fecha_asignacion, asignada_por_entrenador)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              userId,
              tipo,
              `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
              `Intervención de ${tipo}`,
              tipo === 'respiracion' ? 2 : tipo === 'activacion' ? 5 : 5,
              completada,
              fechaAsignacion.toISOString(),
              true
            ]
          );
        }
      }
    } catch (e) {
      console.log('  (Intervenciones table not available, skipping)');
    }
    
    // Create team challenges
    console.log('Creating team challenges...');
    const challenges = [
      { titulo: '100km en la semana', descripcion: 'Corre un total de 100km en los próximos 7 días', objetivo_sesiones: 6 },
      { titulo: 'Semana de recuperación perfecta', descripcion: 'Completa 5 sesiones con readiness > 70', objetivo_sesiones: 5 },
      { titulo: 'Reto de consistencia', descripcion: 'Entrena todos los días de la semana', objetivo_sesiones: 7 }
    ];
    
    for (const challenge of challenges) {
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaFin.setDate(fechaFin.getDate() + 7);
      
      await client.query(
        `INSERT INTO retos (equipo_id, titulo, descripcion, objetivo_sesiones, fecha_inicio, fecha_fin)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [teamId, challenge.titulo, challenge.descripcion, challenge.objetivo_sesiones, 
         fechaInicio.toISOString().split('T')[0], fechaFin.toISOString().split('T')[0]]
      );
    }
    console.log('  ✓ 3 challenges created');
    
    // Create kudos between athletes
    console.log('Creating team kudos...');
    const mensajesKudos = [
      '¡Excelente esfuerzo en el entrenamiento de hoy!',
      '¡Eres una inspiración para el equipo!',
      '¡Muy buena consistencia esta semana!',
      '¡Ese readiness de hoy fue increíble!',
      '¡Felicidades por completar la intervención!',
      '¡Vamos equipo, sigamos así!',
      '¡Tu dedicación es admirable!',
      '¡Excelente sesión de recuperación!'
    ];
    
    const athleteEmailsList = Object.keys(athleteIds);
    for (let i = 0; i < 15; i++) {
      const fromIdx = Math.floor(Math.random() * athleteEmailsList.length);
      let toIdx = Math.floor(Math.random() * athleteEmailsList.length);
      
      // Asegurar que no sean el mismo usuario
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * athleteEmailsList.length);
      }
      
      const fromUserId = athleteIds[athleteEmailsList[fromIdx]];
      const toUserId = athleteIds[athleteEmailsList[toIdx]];
      const mensaje = mensajesKudos[Math.floor(Math.random() * mensajesKudos.length)];
      const fechaKudo = new Date();
      fechaKudo.setDate(fechaKudo.getDate() - Math.floor(Math.random() * 14));
      
      await client.query(
        `INSERT INTO kudos (de_usuario_id, a_usuario_id, mensaje, timestamp)
         VALUES ($1, $2, $3, $4)`,
        [fromUserId, toUserId, mensaje, fechaKudo.toISOString()]
      );
    }
    console.log('  ✓ 15 kudos created');
    
    console.log('✓ Seed data inserted successfully');
    client.release();
    await pool.end();
    console.log('✓ All done!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

runSeed();
