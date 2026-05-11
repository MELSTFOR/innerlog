const db = require('../config/db');

// Obtener feed de actividad reciente del equipo
const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Obtener equipo_id del usuario
    const userResult = await db.query(
      'SELECT equipo_id FROM usuarios WHERE id = $1',
      [userId]
    );

    if (!userResult.rows[0]?.equipo_id) {
      return res.json({ feed: [] });
    }

    const equipoId = userResult.rows[0].equipo_id;

    // 1. Tests completados recientemente
    const testsActivity = await db.query(
      `SELECT 
         u.id, u.nombre, 
         'test' as tipo,
         ts.tipo_test, ts.precision, ts.timestamp,
         ts.timestamp as timestamp_event
       FROM test_sessions ts
       JOIN usuarios u ON ts.usuario_id = u.id
       WHERE u.equipo_id = $1 AND ts.timestamp >= $2
       ORDER BY ts.timestamp DESC
       LIMIT 5`,
      [equipoId, sevenDaysAgo]
    );

    // 2. Readiness promedio del equipo
    const readinessActivity = await db.query(
      `SELECT 
         ROUND(AVG(score)) as avg_score,
         fecha as timestamp_event,
         COUNT(DISTINCT usuario_id) as atletas
       FROM readiness_scores
       WHERE usuario_id IN (
         SELECT id FROM usuarios WHERE equipo_id = $1
       ) AND fecha >= $2
       ORDER BY fecha DESC
       LIMIT 1`,
      [equipoId, sevenDaysAgo.toISOString().split('T')[0]]
    );

    // 3. Streaks (racha de días consecutivos)
    const streakActivity = await db.query(
      `WITH RECURSIVE date_series AS (
         SELECT CURRENT_DATE as fecha
         UNION ALL
         SELECT fecha - INTERVAL '1 day'
         FROM date_series
         WHERE fecha > CURRENT_DATE - INTERVAL '30 days'
       ),
       user_check_ins AS (
         SELECT DISTINCT
           u.id, u.nombre,
           ds.fecha,
           CASE WHEN (
             SELECT COUNT(*) FROM sesiones_entrenamiento
             WHERE usuario_id = u.id AND DATE(timestamp) = ds.fecha
           ) > 0 OR (
             SELECT COUNT(*) FROM test_sessions
             WHERE usuario_id = u.id AND DATE(timestamp) = ds.fecha
           ) > 0 OR (
             SELECT COUNT(*) FROM wellness_entries
             WHERE usuario_id = u.id AND DATE(timestamp) = ds.fecha
           ) > 0 THEN 1 ELSE 0 END as tiene_checkin
         FROM usuarios u
         CROSS JOIN date_series ds
         WHERE u.equipo_id = $1
       ),
       streaks AS (
         SELECT 
           id, nombre,
           COUNT(*) as streak_dias,
           MAX(fecha) as ultima_fecha
         FROM (
           SELECT 
             id, nombre, fecha, tiene_checkin,
             fecha - (ROW_NUMBER() OVER (PARTITION BY id ORDER BY fecha DESC) * INTERVAL '1 day') as streak_group
           FROM user_check_ins
           WHERE tiene_checkin = 1
         ) t
         GROUP BY id, nombre, streak_group
         ORDER BY MAX(fecha) DESC
       )
       SELECT id, nombre, streak_dias, ultima_fecha as timestamp_event
       FROM streaks
       WHERE streak_dias >= 5
       ORDER BY ultima_fecha DESC
       LIMIT 3`,
      [equipoId]
    );

    // Combinar todas las actividades
    const feed = [];

    // Agregar actividades de tests
    testsActivity.rows.forEach((row) => {
      feed.push({
        id: `test-${row.id}-${row.timestamp}`,
        tipo: 'test',
        titulo: `${row.nombre} completó ${row.tipo_test.toUpperCase()} con ${row.precision}% de precisión`,
        timestamp: row.timestamp_event,
        datos: {
          usuario_nombre: row.nombre,
          tipo_test: row.tipo_test,
          precision: row.precision,
        },
      });
    });

    // Agregar readiness promedio
    if (readinessActivity.rows[0]) {
      feed.push({
        id: `readiness-${readinessActivity.rows[0].timestamp_event}`,
        tipo: 'readiness',
        titulo: `Tu equipo tiene un readiness medio de ${readinessActivity.rows[0].avg_score}% hoy (${readinessActivity.rows[0].atletas} atletas)`,
        timestamp: readinessActivity.rows[0].timestamp_event,
        datos: {
          avg_score: readinessActivity.rows[0].avg_score,
          atletas: readinessActivity.rows[0].atletas,
        },
      });
    }

    // Agregar streaks
    streakActivity.rows.forEach((row) => {
      feed.push({
        id: `streak-${row.id}-${row.ultima_fecha}`,
        tipo: 'streak',
        titulo: `${row.nombre} lleva ${row.streak_dias} días seguidos registrando su sesión`,
        timestamp: row.timestamp_event,
        datos: {
          usuario_nombre: row.nombre,
          streak_dias: row.streak_dias,
        },
      });
    });

    // Ordenar por timestamp descendente
    feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ feed });
  } catch (error) {
    console.error('Error al obtener feed:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener reto semanal activo
const getRetoSemanal = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener equipo_id
    const userResult = await db.query(
      'SELECT equipo_id FROM usuarios WHERE id = $1',
      [userId]
    );

    if (!userResult.rows[0]?.equipo_id) {
      return res.json({ reto: null });
    }

    const equipoId = userResult.rows[0].equipo_id;
    const hoy = new Date().toISOString().split('T')[0];

    // Obtener reto activo esta semana
    const retoResult = await db.query(
      `SELECT id, titulo, descripcion, objetivo_sesiones, fecha_inicio, fecha_fin
       FROM retos
       WHERE equipo_id = $1 AND fecha_inicio <= $2 AND fecha_fin >= $2
       ORDER BY fecha_inicio DESC
       LIMIT 1`,
      [equipoId, hoy]
    );

    if (retoResult.rows.length === 0) {
      return res.json({ reto: null });
    }

    const reto = retoResult.rows[0];

    // Contar sesiones completadas por cada atleta esta semana
    const completadosResult = await db.query(
      `SELECT 
         u.id, u.nombre,
         COUNT(DISTINCT DATE(st.timestamp)) as sesiones_dias
       FROM usuarios u
       LEFT JOIN sesiones_entrenamiento st ON u.id = st.usuario_id 
         AND DATE(st.timestamp) >= $1 
         AND DATE(st.timestamp) <= $2
       WHERE u.equipo_id = $3 AND u.rol = 'atleta'
       GROUP BY u.id, u.nombre
       ORDER BY u.nombre ASC`,
      [reto.fecha_inicio, reto.fecha_fin, equipoId]
    );

    // Calcular progreso
    const totalAtletas = completadosResult.rows.length;
    const completados = completadosResult.rows.filter(
      (a) => a.sesiones_dias >= 1
    ).length;
    const progreso = totalAtletas > 0 ? (completados / totalAtletas) * 100 : 0;

    res.json({
      reto: {
        id: reto.id,
        titulo: reto.titulo,
        descripcion: reto.descripcion,
        objetivo_sesiones: reto.objetivo_sesiones,
        fecha_inicio: reto.fecha_inicio,
        fecha_fin: reto.fecha_fin,
        progreso: Math.round(progreso),
        completados,
        total_atletas: totalAtletas,
        atletas: completadosResult.rows,
      },
    });
  } catch (error) {
    console.error('Error al obtener reto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener leaderboard por racha
const getLeaderboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener equipo_id
    const userResult = await db.query(
      'SELECT equipo_id FROM usuarios WHERE id = $1',
      [userId]
    );

    if (!userResult.rows[0]?.equipo_id) {
      return res.json({ leaderboard: [] });
    }

    const equipoId = userResult.rows[0].equipo_id;

    // Calcular racha para cada atleta
    const result = await db.query(
      `WITH RECURSIVE date_series AS (
         SELECT CURRENT_DATE as fecha
         UNION ALL
         SELECT fecha - INTERVAL '1 day'
         FROM date_series
         WHERE fecha > CURRENT_DATE - INTERVAL '90 days'
       ),
       user_check_ins AS (
         SELECT DISTINCT
           u.id, u.nombre,
           ds.fecha,
           CASE WHEN (
             SELECT COUNT(*) FROM sesiones_entrenamiento
             WHERE usuario_id = u.id AND DATE(timestamp) = ds.fecha
           ) > 0 OR (
             SELECT COUNT(*) FROM test_sessions
             WHERE usuario_id = u.id AND DATE(timestamp) = ds.fecha
           ) > 0 OR (
             SELECT COUNT(*) FROM wellness_entries
             WHERE usuario_id = u.id AND DATE(timestamp) = ds.fecha
           ) > 0 THEN 1 ELSE 0 END as tiene_checkin
         FROM usuarios u
         WHERE u.equipo_id = $1 AND u.rol = 'atleta'
       ),
       current_streak AS (
         SELECT 
           id, nombre,
           COUNT(*) as racha_dias
         FROM (
           SELECT 
             id, nombre, fecha, tiene_checkin,
             fecha - (ROW_NUMBER() OVER (PARTITION BY id ORDER BY fecha DESC) * INTERVAL '1 day') as streak_group
           FROM user_check_ins
           WHERE tiene_checkin = 1
           AND fecha >= CURRENT_DATE - INTERVAL '90 days'
         ) t
         WHERE fecha = CURRENT_DATE OR (
           SELECT COUNT(*) FROM (
             SELECT 1 FROM user_check_ins uci2 
             WHERE uci2.id = t.id AND uci2.fecha = CURRENT_DATE AND uci2.tiene_checkin = 1
           ) x
         ) > 0 OR (
           SELECT COUNT(*) FROM (
             SELECT 1 FROM user_check_ins uci3
             WHERE uci3.id = t.id AND uci3.fecha = CURRENT_DATE - INTERVAL '1 day' AND uci3.tiene_checkin = 1
           ) y
         ) > 0
         GROUP BY id, nombre, streak_group
       )
       SELECT 
         id, nombre,
         COALESCE(racha_dias, 0) as racha_dias,
         ROW_NUMBER() OVER (ORDER BY COALESCE(racha_dias, 0) DESC) as posicion
       FROM (
         SELECT id, nombre, racha_dias FROM current_streak
         UNION ALL
         SELECT u.id, u.nombre, 0
         FROM usuarios u
         WHERE u.equipo_id = $1 AND u.rol = 'atleta'
         AND u.id NOT IN (SELECT id FROM current_streak)
       ) all_users
       ORDER BY racha_dias DESC`,
      [equipoId]
    );

    res.json({ leaderboard: result.rows });
  } catch (error) {
    console.error('Error al obtener leaderboard:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener todas las consignas de comunidad
const getConsignas = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         c.id,
         c.usuario_id,
         c.contenido,
         c.tipo,
         c.timestamp,
         u.nombre,
         u.rol
       FROM consignas_comunidad c
       JOIN usuarios u ON c.usuario_id = u.id
       ORDER BY c.timestamp DESC
       LIMIT 50`
    );

    res.json({ consignas: result.rows });
  } catch (error) {
    console.error('Error al obtener consignas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Crear una consigna o post
const crearConsigna = async (req, res) => {
  try {
    const { contenido } = req.body;
    const usuarioId = req.user.id;
    const usuario = req.user;

    if (!contenido || contenido.trim().length === 0) {
      return res.status(400).json({ error: 'El contenido no puede estar vacío' });
    }

    // Determinar tipo: si es psicólogo = consigna, si es atleta = post
    const tipo = usuario.rol === 'psicologo_deportivo' ? 'consigna' : 'post';

    const result = await db.query(
      `INSERT INTO consignas_comunidad (usuario_id, contenido, tipo)
       VALUES ($1, $2, $3)
       RETURNING id, usuario_id, contenido, tipo, timestamp`,
      [usuarioId, contenido, tipo]
    );

    res.status(201).json({ consigna: result.rows[0] });
  } catch (error) {
    console.error('Error al crear consigna:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  getFeed,
  getRetoSemanal,
  getLeaderboard,
  getConsignas,
  crearConsigna,
};
