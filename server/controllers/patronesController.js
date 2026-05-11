const db = require('../config/db');

// Helper: obtener día de semana en español
const getDayName = (date) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[new Date(date).getDay()];
};

// Analizar patrones de los últimos 30 días
const analyzePatterns = async (req, res) => {
  try {
    const userId = req.user.id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. PATRÓN DE FATIGA: readiness por día de semana
    const fatigaResult = await db.query(
      `SELECT 
        TO_CHAR(fecha, 'D') as day_num,
        CASE WHEN TO_CHAR(fecha, 'D') = '1' THEN 'Domingo'
             WHEN TO_CHAR(fecha, 'D') = '2' THEN 'Lunes'
             WHEN TO_CHAR(fecha, 'D') = '3' THEN 'Martes'
             WHEN TO_CHAR(fecha, 'D') = '4' THEN 'Miércoles'
             WHEN TO_CHAR(fecha, 'D') = '5' THEN 'Jueves'
             WHEN TO_CHAR(fecha, 'D') = '6' THEN 'Viernes'
             WHEN TO_CHAR(fecha, 'D') = '7' THEN 'Sábado' END as day_name,
        ROUND(AVG(score)::numeric, 1) as avg_score
      FROM readiness_scores
      WHERE usuario_id = $1 AND fecha >= $2
      GROUP BY TO_CHAR(fecha, 'D')
      ORDER BY day_num`,
      [userId, thirtyDaysAgo.toISOString().split('T')[0]]
    );

    let fatigaPattern = null;
    if (fatigaResult.rows.length > 0) {
      const minDay = fatigaResult.rows.reduce((min, row) => 
        parseFloat(row.avg_score) < parseFloat(min.avg_score) ? row : min
      );
      
      fatigaPattern = {
        titulo: 'Patrón de Fatiga',
        insight: `Tus ${minDay.day_name.toLowerCase()}s tienen un readiness promedio de ${minDay.avg_score} — el más bajo de tu semana`,
        recomendacion: `Considera una intervención de recuperación los ${minDay.day_name.toLowerCase()}s`,
        datos: fatigaResult.rows.map(r => ({
          dia: r.day_name,
          score: parseFloat(r.avg_score)
        }))
      };
    }

    // 2. CORRELACIÓN SUEÑO-RENDIMIENTO COGNITIVO (últimos 30 días)
    const sleepCognitiveResult = await db.query(
      `SELECT 
        w.sueno,
        t.precision,
        DATE(w.timestamp) as fecha
      FROM wellness_entries w
      LEFT JOIN test_sessions t ON 
        DATE(t.timestamp) = DATE(w.timestamp) AND t.usuario_id = w.usuario_id
      WHERE w.usuario_id = $1 AND DATE(w.timestamp) >= $2
      ORDER BY DATE(w.timestamp) DESC`,
      [userId, thirtyDaysAgo.toISOString().split('T')[0]]
    );

    let sleepCognitivePattern = null;
    if (sleepCognitiveResult.rows.length > 0) {
      const lowSleepDays = sleepCognitiveResult.rows.filter(r => r.sueno < 3);
      const highSleepDays = sleepCognitiveResult.rows.filter(r => r.sueno >= 3);
      
      const avgLowSleep = lowSleepDays.length > 0 
        ? (lowSleepDays.reduce((sum, r) => sum + (r.precision || 0), 0) / lowSleepDays.length).toFixed(1)
        : 'N/A';
      
      const avgHighSleep = highSleepDays.length > 0 
        ? (highSleepDays.reduce((sum, r) => sum + (r.precision || 0), 0) / highSleepDays.length).toFixed(1)
        : 'N/A';

      const diff = avgLowSleep !== 'N/A' && avgHighSleep !== 'N/A' 
        ? (parseFloat(avgHighSleep) - parseFloat(avgLowSleep)).toFixed(1)
        : 0;

      sleepCognitivePattern = {
        titulo: 'Sueño vs Rendimiento Cognitivo',
        insight: `Cuando duermes menos (< 3/5), tu rendimiento cognitivo es ${avgLowSleep}%. Con más sueño es ${avgHighSleep}% (diferencia: ${diff}%)`,
        recomendacion: `Prioriza las noches con sueño >= 3/5 antes de entrenamientos exigentes`,
        datos: {
          bajoSueño: avgLowSleep,
          altoSueño: avgHighSleep,
          diferencia: diff
        }
      };
    }

    // 3. PATRÓN EMOCIONAL: emocional score por día de semana
    const emotionalResult = await db.query(
      `SELECT 
        TO_CHAR(se.timestamp, 'D') as day_num,
        CASE WHEN TO_CHAR(se.timestamp, 'D') = '1' THEN 'Domingo'
             WHEN TO_CHAR(se.timestamp, 'D') = '2' THEN 'Lunes'
             WHEN TO_CHAR(se.timestamp, 'D') = '3' THEN 'Martes'
             WHEN TO_CHAR(se.timestamp, 'D') = '4' THEN 'Miércoles'
             WHEN TO_CHAR(se.timestamp, 'D') = '5' THEN 'Jueves'
             WHEN TO_CHAR(se.timestamp, 'D') = '6' THEN 'Viernes'
             WHEN TO_CHAR(se.timestamp, 'D') = '7' THEN 'Sábado' END as day_name,
        ROUND(AVG(emocional)::numeric, 1) as avg_emotional
      FROM sesiones_entrenamiento se
      WHERE usuario_id = $1 AND se.timestamp >= $2
      GROUP BY TO_CHAR(se.timestamp, 'D')
      ORDER BY day_num`,
      [userId, thirtyDaysAgo.toISOString().split('T')[0]]
    );

    let emotionalPattern = null;
    if (emotionalResult.rows.length > 0) {
      const minEmotion = emotionalResult.rows.reduce((min, row) => 
        parseFloat(row.avg_emotional) < parseFloat(min.avg_emotional) ? row : min
      );
      
      emotionalPattern = {
        titulo: 'Patrón Emocional',
        insight: `Tu estado emocional es más bajo los ${minEmotion.day_name.toLowerCase()}s (promedio ${minEmotion.avg_emotional}/10)`,
        recomendacion: `Planifica sesiones menos demandantes o incluye técnicas de regulación emocional ese día`,
        datos: emotionalResult.rows.map(r => ({
          dia: r.day_name,
          score: parseFloat(r.avg_emotional)
        }))
      };
    }

    // 4. MEJOR MOMENTO DE LA SEMANA: día con mayor readiness
    const bestDayResult = await db.query(
      `SELECT 
        TO_CHAR(fecha, 'D') as day_num,
        CASE WHEN TO_CHAR(fecha, 'D') = '1' THEN 'Domingo'
             WHEN TO_CHAR(fecha, 'D') = '2' THEN 'Lunes'
             WHEN TO_CHAR(fecha, 'D') = '3' THEN 'Martes'
             WHEN TO_CHAR(fecha, 'D') = '4' THEN 'Miércoles'
             WHEN TO_CHAR(fecha, 'D') = '5' THEN 'Jueves'
             WHEN TO_CHAR(fecha, 'D') = '6' THEN 'Viernes'
             WHEN TO_CHAR(fecha, 'D') = '7' THEN 'Sábado' END as day_name,
        ROUND(AVG(score)::numeric, 1) as avg_score
      FROM readiness_scores
      WHERE usuario_id = $1 AND fecha >= $2
      GROUP BY TO_CHAR(fecha, 'D')
      ORDER BY avg_score DESC
      LIMIT 1`,
      [userId, thirtyDaysAgo.toISOString().split('T')[0]]
    );

    let bestDayPattern = null;
    if (bestDayResult.rows.length > 0) {
      const bestDay = bestDayResult.rows[0];
      bestDayPattern = {
        titulo: 'Mejor Momento de la Semana',
        insight: `Tus ${bestDay.day_name.toLowerCase()}s son tus mejores días con un readiness promedio de ${bestDay.avg_score}`,
        recomendacion: `Aprovecha los ${bestDay.day_name.toLowerCase()}s para entrenamientos de alto rendimiento`,
        datos: {
          dia: bestDay.day_name,
          score: parseFloat(bestDay.avg_score)
        }
      };
    }

    const patterns = [
      fatigaPattern,
      sleepCognitivePattern,
      emotionalPattern,
      bestDayPattern
    ].filter(p => p !== null);

    res.json({
      success: true,
      patterns,
      periodo: '30 días',
      fecha_analisis: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al analizar patrones:', error);
    res.status(500).json({ error: 'Error al analizar patrones' });
  }
};

// Obtener patrón de equipo para entrenador
const getTeamPatterns = async (req, res) => {
  try {
    const entrenadorId = req.user.id;
    
    // Verificar que es entrenador
    const userCheck = await db.query(
      'SELECT rol FROM usuarios WHERE id = $1',
      [entrenadorId]
    );
    
    if (!userCheck.rows[0] || userCheck.rows[0].rol !== 'entrenador') {
      return res.status(403).json({ error: 'No tienes permiso para ver patrones del equipo' });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. DÍA DE LA SEMANA CON MÁS BAJO READINESS
    const worstDayResult = await db.query(
      `SELECT 
        TO_CHAR(rs.fecha, 'D') as day_num,
        CASE WHEN TO_CHAR(rs.fecha, 'D') = '1' THEN 'Domingo'
             WHEN TO_CHAR(rs.fecha, 'D') = '2' THEN 'Lunes'
             WHEN TO_CHAR(rs.fecha, 'D') = '3' THEN 'Martes'
             WHEN TO_CHAR(rs.fecha, 'D') = '4' THEN 'Miércoles'
             WHEN TO_CHAR(rs.fecha, 'D') = '5' THEN 'Jueves'
             WHEN TO_CHAR(rs.fecha, 'D') = '6' THEN 'Viernes'
             WHEN TO_CHAR(rs.fecha, 'D') = '7' THEN 'Sábado' END as day_name,
        ROUND(AVG(rs.score)::numeric, 1) as avg_score
      FROM readiness_scores rs
      INNER JOIN usuarios u ON u.id = rs.usuario_id
      WHERE u.equipo_id = (SELECT equipo_id FROM usuarios WHERE id = $1)
        AND rs.fecha >= $2
      GROUP BY TO_CHAR(rs.fecha, 'D')
      ORDER BY avg_score ASC
      LIMIT 1`,
      [entrenadorId, thirtyDaysAgo.toISOString().split('T')[0]]
    );

    // 2. ATLETA CON MAYOR VARIABILIDAD DE READINESS
    const variabilityResult = await db.query(
      `SELECT 
        u.id,
        u.nombre,
        ROUND(STDDEV(rs.score)::numeric, 2) as variabilidad,
        ROUND(AVG(rs.score)::numeric, 1) as avg_score
      FROM readiness_scores rs
      INNER JOIN usuarios u ON u.id = rs.usuario_id
      WHERE u.equipo_id = (SELECT equipo_id FROM usuarios WHERE id = $1)
        AND rs.fecha >= $2
      GROUP BY u.id, u.nombre
      HAVING COUNT(rs.id) > 5
      ORDER BY variabilidad DESC
      LIMIT 1`,
      [entrenadorId, thirtyDaysAgo.toISOString().split('T')[0]]
    );

    // 3. ATLETA CON TENDENCIA POSITIVA (últimas 2 semanas)
    const positiveResult = await db.query(
      `WITH readiness_semanas AS (
        SELECT 
          u.id,
          u.nombre,
          AVG(rs.score) as avg_score,
          CASE WHEN rs.fecha >= CURRENT_DATE - INTERVAL '14 days' THEN 'reciente'
               ELSE 'anterior' END as periodo
        FROM readiness_scores rs
        INNER JOIN usuarios u ON u.id = rs.usuario_id
        WHERE u.equipo_id = (SELECT equipo_id FROM usuarios WHERE id = $1)
          AND rs.fecha >= $2
        GROUP BY u.id, u.nombre, periodo
      )
      SELECT 
        id,
        nombre,
        MAX(CASE WHEN periodo = 'reciente' THEN avg_score END) - 
        MAX(CASE WHEN periodo = 'anterior' THEN avg_score END) as diferencia,
        MAX(CASE WHEN periodo = 'reciente' THEN avg_score END) as score_reciente
      FROM readiness_semanas
      GROUP BY id, nombre
      HAVING MAX(CASE WHEN periodo = 'reciente' THEN avg_score END) > 
             MAX(CASE WHEN periodo = 'anterior' THEN avg_score END)
      ORDER BY diferencia DESC
      LIMIT 1`,
      [entrenadorId, thirtyDaysAgo.toISOString().split('T')[0]]
    );

    res.json({
      success: true,
      peorDia: worstDayResult.rows[0] || null,
      atletaMayorVariabilidad: variabilityResult.rows[0] || null,
      atletaTendenciaPositiva: positiveResult.rows[0] || null,
      periodo: 'últimos 30 días'
    });
  } catch (error) {
    console.error('Error al obtener patrones del equipo:', error);
    res.status(500).json({ error: 'Error al obtener patrones del equipo' });
  }
};

module.exports = {
  analyzePatterns,
  getTeamPatterns
};
