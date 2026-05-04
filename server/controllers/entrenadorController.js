const db = require('../config/db');

// Obtener lista de atletas del equipo con readiness de hoy
const getEquipo = async (req, res) => {
  try {
    const entrenadorId = req.user.id;
    const fecha = new Date().toISOString().split('T')[0];

    // Obtener equipo_id del entrenador
    const entrenadorResult = await db.query(
      'SELECT equipo_id FROM usuarios WHERE id = $1',
      [entrenadorId]
    );

    if (!entrenadorResult.rows[0]?.equipo_id) {
      return res.json({ atletas: [] });
    }

    const equipoId = entrenadorResult.rows[0].equipo_id;

    // Obtener todos los atletas del equipo con readiness
    const result = await db.query(
      `SELECT 
         u.id,
         u.nombre,
         u.deporte,
         u.nivel,
         COALESCE(rs.score, NULL) as readiness,
         CASE 
           WHEN COALESCE(rs.score, 0) > 70 THEN 'green'
           WHEN COALESCE(rs.score, 0) >= 40 THEN 'yellow'
           ELSE 'red'
         END as status
       FROM usuarios u
       LEFT JOIN readiness_scores rs ON u.id = rs.usuario_id AND rs.fecha = $2
       WHERE u.equipo_id = $1 AND u.rol = 'atleta'
       ORDER BY u.nombre ASC`,
      [equipoId, fecha]
    );

    res.json({ atletas: result.rows });
  } catch (error) {
    console.error('Error al obtener equipo:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener historial completo de un atleta
const getAtletaHistorial = async (req, res) => {
  try {
    const { id: atletaId } = req.params;
    const entrenadorId = req.user.id;

    // Verificar que el entrenador pueda acceder a este atleta (mismo equipo)
    const verificacion = await db.query(
      `SELECT u1.equipo_id FROM usuarios u1
       WHERE u1.id = $1
       AND u1.equipo_id = (SELECT u2.equipo_id FROM usuarios u2 WHERE u2.id = $2)`,
      [atletaId, entrenadorId]
    );

    if (verificacion.rows.length === 0) {
      return res.status(403).json({ error: 'No puedes acceder a este atleta' });
    }

    // Obtener datos del atleta
    const atletaResult = await db.query(
      'SELECT id, nombre, deporte, nivel FROM usuarios WHERE id = $1',
      [atletaId]
    );

    // Obtener tests
    const testsResult = await db.query(
      `SELECT id, tipo_test, precision, tr_medio, duracion, timestamp
       FROM test_sessions
       WHERE usuario_id = $1
       ORDER BY timestamp DESC
       LIMIT 10`,
      [atletaId]
    );

    // Obtener sesiones
    const sesionesResult = await db.query(
      `SELECT id, esfuerzo_mental, enfoque, emocional, fatiga_carrera, 
              fatiga_dia_siguiente, satisfaccion, notas, timestamp
       FROM sesiones_entrenamiento
       WHERE usuario_id = $1
       ORDER BY timestamp DESC
       LIMIT 10`,
      [atletaId]
    );

    // Obtener wellness (últimas 7)
    const wellnessResult = await db.query(
      `SELECT id, fatiga, sueno, dolor, estres, timestamp
       FROM wellness_entries
       WHERE usuario_id = $1
       ORDER BY timestamp DESC
       LIMIT 7`,
      [atletaId]
    );

    res.json({
      atleta: atletaResult.rows[0],
      tests: testsResult.rows,
      sesiones: sesionesResult.rows,
      wellness: wellnessResult.rows,
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener tendencia de readiness promedio del equipo (últimos 7 días)
const getEquipoTendencia = async (req, res) => {
  try {
    const entrenadorId = req.user.id;

    // Obtener equipo_id del entrenador
    const entrenadorResult = await db.query(
      'SELECT equipo_id FROM usuarios WHERE id = $1',
      [entrenadorId]
    );

    if (!entrenadorResult.rows[0]?.equipo_id) {
      return res.json({ tendencia: [] });
    }

    const equipoId = entrenadorResult.rows[0].equipo_id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Obtener promedio diario de readiness
    const result = await db.query(
      `SELECT 
         rs.fecha,
         ROUND(AVG(rs.score)) as score_promedio,
         COUNT(DISTINCT rs.usuario_id) as atletas_registrados
       FROM readiness_scores rs
       JOIN usuarios u ON rs.usuario_id = u.id
       WHERE u.equipo_id = $1 
         AND rs.fecha >= $2
       GROUP BY rs.fecha
       ORDER BY rs.fecha ASC`,
      [equipoId, sevenDaysAgo.toISOString().split('T')[0]]
    );

    res.json({ tendencia: result.rows });
  } catch (error) {
    console.error('Error al obtener tendencia:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  getEquipo,
  getAtletaHistorial,
  getEquipoTendencia,
};
