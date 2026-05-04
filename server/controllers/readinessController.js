const db = require('../config/db');

// Calcular readiness score del día
const calculateReadinessToday = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Wellness score: promedio de los 4 sliders de hoy (1-5 normalizado a 0-100)
    const wellnessResult = await db.query(
      `SELECT AVG((fatiga + sueno + dolor + estres) / 4.0) as avg_score
       FROM wellness_entries
       WHERE usuario_id = $1 AND DATE(timestamp) = DATE($2)`,
      [userId, today]
    );

    let wellnessScore = 0;
    if (wellnessResult.rows[0]?.avg_score) {
      // Normalizar de 1-5 a 0-100: (valor - 1) / 4 * 100
      wellnessScore = ((wellnessResult.rows[0].avg_score - 1) / 4) * 100;
    }

    // 2. Cognitivo score: precisión del último test
    const testResult = await db.query(
      `SELECT precision, timestamp FROM test_sessions
       WHERE usuario_id = $1
       ORDER BY timestamp DESC
       LIMIT 1`,
      [userId]
    );

    let cognitivoScore = 0;
    if (testResult.rows[0]?.precision !== undefined) {
      let precision = testResult.rows[0].precision;
      const testDate = new Date(testResult.rows[0].timestamp);
      
      // Decaimiento 10% por cada día sin test reciente
      const daysDiff = Math.floor((today - testDate) / (1000 * 60 * 60 * 24));
      precision = Math.max(0, precision - (daysDiff * 10));
      
      cognitivoScore = precision; // Ya está en 0-100
    }

    // 3. Sesión score: promedio de (satisfaccion + (10 - fatiga_carrera) + enfoque) / 3
    const sesionResult = await db.query(
      `SELECT 
         AVG(satisfaccion) as avg_satisfaccion,
         AVG(fatiga_carrera) as avg_fatiga,
         AVG(enfoque) as avg_enfoque
       FROM sesiones_entrenamiento
       WHERE usuario_id = $1 AND DATE(timestamp) = DATE($2)`,
      [userId, today]
    );

    let sesionScore = 0;
    if (sesionResult.rows[0]?.avg_satisfaccion || sesionResult.rows[0]?.avg_enfoque) {
      const satisfaccion = sesionResult.rows[0]?.avg_satisfaccion || 0;
      const fatiga = sesionResult.rows[0]?.avg_fatiga || 0;
      const enfoque = sesionResult.rows[0]?.avg_enfoque || 0;
      
      // Fórmula: promedio de (satisfaccion + (10 - fatiga_carrera) + enfoque)
      const avgComponent = (satisfaccion + (10 - fatiga) + enfoque) / 3;
      // Normalizar de 1-10 a 0-100
      sesionScore = (avgComponent / 10) * 100;
    }

    // 4. Readiness = (Wellness × 0.40) + (Cognitivo × 0.35) + (Sesión × 0.25)
    const readiness = (wellnessScore * 0.40) + (cognitivoScore * 0.35) + (sesionScore * 0.25);

    // 5. Determinar color: verde > 70 | amarillo 40-70 | rojo < 40
    let status = 'red';
    if (readiness > 70) {
      status = 'green';
    } else if (readiness >= 40) {
      status = 'yellow';
    }

    // Guardar o actualizar readiness score del día
    const fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const saveResult = await db.query(
      `INSERT INTO readiness_scores 
       (usuario_id, score, wellness_score, cognitivo_score, sesion_score, fecha)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (usuario_id, fecha) DO UPDATE SET
         score = $2,
         wellness_score = $3,
         cognitivo_score = $4,
         sesion_score = $5
       RETURNING *`,
      [userId, Math.round(readiness), Math.round(wellnessScore), Math.round(cognitivoScore), Math.round(sesionScore), fecha]
    );

    res.json({
      readiness: Math.round(readiness),
      status,
      scores: {
        wellness: Math.round(wellnessScore),
        cognitivo: Math.round(cognitivoScore),
        sesion: Math.round(sesionScore),
      },
      components: {
        wellnessScore: wellnessResult.rows[0]?.avg_score || 0,
        testPrecision: testResult.rows[0]?.precision || 0,
        sesionMetrics: {
          satisfaccion: sesionResult.rows[0]?.avg_satisfaccion || 0,
          fatiga: sesionResult.rows[0]?.avg_fatiga || 0,
          enfoque: sesionResult.rows[0]?.avg_enfoque || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error al calcular readiness:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener readiness de los últimos 7 días
const getReadinessTrend = async (req, res) => {
  try {
    const userId = req.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await db.query(
      `SELECT fecha, score FROM readiness_scores
       WHERE usuario_id = $1 AND fecha >= $2
       ORDER BY fecha ASC`,
      [userId, sevenDaysAgo.toISOString().split('T')[0]]
    );

    res.json({ trend: result.rows });
  } catch (error) {
    console.error('Error al obtener tendencia:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener readiness de un usuario específico (para equipo)
const getUserReadiness = async (req, res) => {
  try {
    const { userId } = req.params;
    const fecha = new Date().toISOString().split('T')[0];

    const result = await db.query(
      `SELECT score, fecha FROM readiness_scores
       WHERE usuario_id = $1 AND fecha = $2
       LIMIT 1`,
      [userId, fecha]
    );

    if (result.rows.length === 0) {
      return res.json({ readiness: null });
    }

    const score = result.rows[0].score;
    let status = 'red';
    if (score > 70) {
      status = 'green';
    } else if (score >= 40) {
      status = 'yellow';
    }

    res.json({
      readiness: score,
      status,
    });
  } catch (error) {
    console.error('Error al obtener readiness:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  calculateReadinessToday,
  getReadinessTrend,
  getUserReadiness,
};
