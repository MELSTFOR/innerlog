const db = require('../config/db');

// Obtener lista de atletas asignados al psicólogo deportivo
const getAtletasAsignados = async (req, res) => {
  try {
    const fecha = new Date().toISOString().split('T')[0];

    // Obtener todos los atletas que han recibido intervenciones
    const result = await db.query(
      `SELECT DISTINCT 
         u.id,
         u.nombre,
         u.deporte,
         u.nivel,
         u.equipo_id,
         eq.nombre as equipo_nombre,
         COALESCE(rs.score, NULL) as readiness,
         CASE 
           WHEN COALESCE(rs.score, 0) > 70 THEN 'green'
           WHEN COALESCE(rs.score, 0) >= 40 THEN 'yellow'
           ELSE 'red'
         END as status,
         COUNT(i.id) as intervenciones_asignadas,
         SUM(CASE WHEN i.completada = true THEN 1 ELSE 0 END)::INTEGER as intervenciones_completadas
       FROM usuarios u
       LEFT JOIN equipos eq ON u.equipo_id = eq.id
       LEFT JOIN readiness_scores rs ON u.id = rs.usuario_id AND rs.fecha = $1
       LEFT JOIN intervenciones i ON u.id = i.usuario_id
       WHERE u.rol = 'atleta'
       AND u.id IN (
         SELECT DISTINCT usuario_id FROM intervenciones 
         WHERE DATE(fecha_asignacion) >= CURRENT_DATE - INTERVAL '30 days'
       )
       GROUP BY u.id, u.nombre, u.deporte, u.nivel, u.equipo_id, eq.nombre, rs.score
       ORDER BY u.nombre ASC`,
      [fecha]
    );

    res.json({ atletas: result.rows });
  } catch (error) {
    console.error('Error al obtener atletas asignados:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener intervenciones asignadas por el psicólogo
const getIntervencionesAsignadas = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         i.id,
         i.usuario_id,
         u.nombre as atleta_nombre,
         u.equipo_id,
         eq.nombre as equipo_nombre,
         i.tipo,
         i.titulo,
         i.descripcion,
         i.duracion_minutos,
         i.completada,
         i.fecha_asignacion,
         i.fecha_completada,
         i.nota_entrenador
       FROM intervenciones i
       JOIN usuarios u ON i.usuario_id = u.id
       LEFT JOIN equipos eq ON u.equipo_id = eq.id
       WHERE i.asignada_por_entrenador = true
       AND u.rol = 'atleta'
       AND DATE(i.fecha_asignacion) >= CURRENT_DATE - INTERVAL '30 days'
       ORDER BY i.fecha_asignacion DESC`
    );

    res.json({ intervenciones: result.rows });
  } catch (error) {
    console.error('Error al obtener intervenciones:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener resumen de un atleta (sus últimas cargadas de datos)
const getResumenAtleta = async (req, res) => {
  try {
    const { id: atletaId } = req.params;
    const psicologoId = req.user.id;

    // Verificar que este atleta existe en el sistema
    const atletaCheck = await db.query(
      'SELECT id, nombre, deporte, nivel FROM usuarios WHERE id = $1 AND rol = $2',
      [atletaId, 'atleta']
    );

    if (atletaCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Atleta no encontrado' });
    }

    const atleta = atletaCheck.rows[0];

    // Obtener wellness más reciente
    const wellnessResult = await db.query(
      `SELECT fatiga, sueno, dolor, estres, timestamp
       FROM wellness_entries
       WHERE usuario_id = $1
       ORDER BY timestamp DESC
       LIMIT 7`,
      [atletaId]
    );

    // Obtener sesiones más recientes
    const sesionesResult = await db.query(
      `SELECT id, esfuerzo_mental, enfoque, emocional, fatiga_carrera, 
              fatiga_dia_siguiente, satisfaccion, notas, timestamp
       FROM sesiones_entrenamiento
       WHERE usuario_id = $1
       ORDER BY timestamp DESC
       LIMIT 7`,
      [atletaId]
    );

    // Obtener tests más recientes
    const testsResult = await db.query(
      `SELECT id, tipo_test, precision, tr_medio, duracion, timestamp
       FROM test_sessions
       WHERE usuario_id = $1
       ORDER BY timestamp DESC
       LIMIT 5`,
      [atletaId]
    );

    // Obtener readiness actual
    const readinessResult = await db.query(
      `SELECT score, wellness_score, cognitivo_score, sesion_score, fecha
       FROM readiness_scores
       WHERE usuario_id = $1
       ORDER BY fecha DESC
       LIMIT 1`,
      [atletaId]
    );

    // Obtener intervenciones del atleta
    const intervencionesResult = await db.query(
      `SELECT id, tipo, titulo, descripcion, completada, fecha_asignacion, fecha_completada
       FROM intervenciones
       WHERE usuario_id = $1
       ORDER BY fecha_asignacion DESC
       LIMIT 10`,
      [atletaId]
    );

    res.json({
      atleta,
      wellness: wellnessResult.rows,
      sesiones: sesionesResult.rows,
      tests: testsResult.rows,
      readiness: readinessResult.rows[0] || null,
      intervenciones: intervencionesResult.rows
    });
  } catch (error) {
    console.error('Error al obtener resumen del atleta:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener estadísticas generales del psicólogo
const getEstadisticas = async (req, res) => {
  try {
    // Contar atletas con intervenciones
    const atletas = await db.query(
      `SELECT COUNT(DISTINCT usuario_id) as total
       FROM intervenciones
       WHERE asignada_por_entrenador = true
       AND DATE(fecha_asignacion) >= CURRENT_DATE - INTERVAL '30 days'`
    );

    // Contar intervenciones pendientes
    const pendientes = await db.query(
      `SELECT COUNT(*) as total
       FROM intervenciones
       WHERE completada = false
       AND asignada_por_entrenador = true
       AND DATE(fecha_asignacion) >= CURRENT_DATE - INTERVAL '30 days'`
    );

    // Contar intervenciones completadas
    const completadas = await db.query(
      `SELECT COUNT(*) as total
       FROM intervenciones
       WHERE completada = true
       AND asignada_por_entrenador = true
       AND DATE(fecha_asignacion) >= CURRENT_DATE - INTERVAL '30 days'`
    );

    // Promedio de readiness
    const promedio = await db.query(
      `SELECT AVG(score) as promedio
       FROM readiness_scores
       WHERE fecha = CURRENT_DATE
       AND usuario_id IN (
         SELECT DISTINCT usuario_id FROM intervenciones
         WHERE asignada_por_entrenador = true
         AND DATE(fecha_asignacion) >= CURRENT_DATE - INTERVAL '30 days'
       )`
    );

    res.json({
      atletasConIntervenciones: parseInt(atletas.rows[0]?.total || 0),
      intervencionesPendientes: parseInt(pendientes.rows[0]?.total || 0),
      intervencionesCompletadas: parseInt(completadas.rows[0]?.total || 0),
      promedioReadiness: Math.round(promedio.rows[0]?.promedio || 0)
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Asignar intervención a un atleta
const asignarIntervencion = async (req, res) => {
  try {
    const { atletaId, tipo, titulo, descripcion, duracion_minutos } = req.body;

    if (!atletaId || !tipo || !titulo) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const result = await db.query(
      `INSERT INTO intervenciones 
       (usuario_id, tipo, titulo, descripcion, duracion_minutos, asignada_por_entrenador)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING *`,
      [atletaId, tipo, titulo, descripcion, duracion_minutos]
    );

    res.json({ intervension: result.rows[0] });
  } catch (error) {
    console.error('Error al asignar intervención:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener atletas inactivos
const getAtletasInactivos = async (req, res) => {
  try {
    const diasInactividad = parseInt(req.query.dias) || 3; // Por defecto 3 días

    const result = await db.query(
      `SELECT 
         u.id,
         u.nombre,
         u.deporte,
         u.nivel,
         u.equipo_id,
         eq.nombre as equipo_nombre,
         u.last_activity,
         EXTRACT(DAY FROM (CURRENT_TIMESTAMP - u.last_activity)) as dias_inactivo,
         COALESCE(rs.score, NULL) as readiness,
         CASE 
           WHEN COALESCE(rs.score, 0) > 70 THEN 'green'
           WHEN COALESCE(rs.score, 0) >= 40 THEN 'yellow'
           ELSE 'red'
         END as status
       FROM usuarios u
       LEFT JOIN equipos eq ON u.equipo_id = eq.id
       LEFT JOIN readiness_scores rs ON u.id = rs.usuario_id AND rs.fecha = CURRENT_DATE
       WHERE u.rol = 'atleta'
       AND EXTRACT(DAY FROM (CURRENT_TIMESTAMP - u.last_activity)) >= $1
       AND u.id IN (
         SELECT DISTINCT usuario_id FROM intervenciones 
         WHERE DATE(fecha_asignacion) >= CURRENT_DATE - INTERVAL '30 days'
       )
       ORDER BY u.last_activity ASC`,
      [diasInactividad]
    );

    res.json({ atletasInactivos: result.rows });
  } catch (error) {
    console.error('Error al obtener atletas inactivos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  getAtletasAsignados,
  getIntervencionesAsignadas,
  getResumenAtleta,
  getEstadisticas,
  asignarIntervencion,
  getAtletasInactivos
};
