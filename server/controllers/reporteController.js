const db = require('../config/db');

// Obtener reporte semanal
const getWeeklyReport = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Calcular el lunes pasado y domingo de esta semana
    const today = new Date();
    const currentDay = today.getDay(); // 0 = domingo, 1 = lunes, etc.
    
    // Fecha de hace 7 días
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1) - 7);
    lastWeekStart.setHours(0, 0, 0, 0);
    
    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
    lastWeekEnd.setHours(23, 59, 59, 999);

    // Semana actual
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    currentWeekStart.setHours(0, 0, 0, 0);

    // 1. READINESS PROMEDIO DE LA SEMANA
    const readinessResult = await db.query(
      `SELECT 
        ROUND(AVG(score)::numeric, 1) as avg_score,
        MIN(score) as min_score,
        MAX(score) as max_score
       FROM readiness_scores
       WHERE usuario_id = $1 
         AND fecha >= $2
         AND fecha < $3`,
      [userId, currentWeekStart.toISOString().split('T')[0], today.toISOString().split('T')[0]]
    );

    const avgReadiness = readinessResult.rows[0]?.avg_score || 0;
    const minReadiness = readinessResult.rows[0]?.min_score || 0;
    const maxReadiness = readinessResult.rows[0]?.max_score || 0;

    // 2. MEJOR Y PEOR DÍA
    const bestWorstResult = await db.query(
      `SELECT 
        fecha,
        TO_CHAR(fecha, 'day') as day_name,
        score
       FROM readiness_scores
       WHERE usuario_id = $1 
         AND fecha >= $2
         AND fecha < $3
       ORDER BY score DESC`,
      [userId, currentWeekStart.toISOString().split('T')[0], today.toISOString().split('T')[0]]
    );

    let bestDay = null;
    let worstDay = null;
    
    if (bestWorstResult.rows.length > 0) {
      bestDay = {
        fecha: bestWorstResult.rows[0].fecha,
        dia: bestWorstResult.rows[0].day_name.trim(),
        score: parseFloat(bestWorstResult.rows[0].score)
      };
      worstDay = {
        fecha: bestWorstResult.rows[bestWorstResult.rows.length - 1].fecha,
        dia: bestWorstResult.rows[bestWorstResult.rows.length - 1].day_name.trim(),
        score: parseFloat(bestWorstResult.rows[bestWorstResult.rows.length - 1].score)
      };
    }

    // 3. TEST COGNITIVO MÁS FRECUENTE Y TENDENCIA
    const testResult = await db.query(
      `SELECT 
        tipo_test,
        COUNT(*) as cantidad,
        ROUND(AVG(precision)::numeric, 1) as avg_precision
       FROM test_sessions
       WHERE usuario_id = $1 
         AND timestamp >= $2
         AND timestamp < $3
       GROUP BY tipo_test
       ORDER BY cantidad DESC
       LIMIT 1`,
      [userId, currentWeekStart.toISOString(), new Date(today.getTime() + 86400000).toISOString()]
    );

    let mostFrequentTest = null;
    if (testResult.rows.length > 0) {
      mostFrequentTest = {
        tipo: testResult.rows[0].tipo_test,
        cantidad: testResult.rows[0].cantidad,
        precision_promedio: parseFloat(testResult.rows[0].avg_precision)
      };
    }

    // 4. PATRÓN MÁS DESTACADO (ej: fatiga por día de semana)
    const patternResult = await db.query(
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
       WHERE usuario_id = $1 
         AND fecha >= $2
         AND fecha < $3
       GROUP BY TO_CHAR(fecha, 'D')
       ORDER BY avg_score ASC`,
      [userId, currentWeekStart.toISOString().split('T')[0], today.toISOString().split('T')[0]]
    );

    let mostNotablePattern = null;
    if (patternResult.rows.length > 0) {
      const worstPattern = patternResult.rows[0];
      mostNotablePattern = {
        tipo: 'fatiga',
        dia: worstPattern.day_name,
        score: parseFloat(worstPattern.avg_score),
        descripcion: `El ${worstPattern.day_name.toLowerCase()} es tu día más bajo con readiness de ${worstPattern.avg_score}`
      };
    }

    // 5. INTERVENCIONES COMPLETADAS
    const interventionsResult = await db.query(
      `SELECT 
        tipo,
        COUNT(*) as cantidad
       FROM intervenciones
       WHERE usuario_id = $1 
         AND completada = TRUE
         AND fecha_completada >= $2
         AND fecha_completada < $3
       GROUP BY tipo`,
      [userId, currentWeekStart.toISOString(), new Date(today.getTime() + 86400000).toISOString()]
    );

    const completedInterventions = interventionsResult.rows.reduce((sum) => sum + 1, 0);

    // 6. COMPARACIÓN CON SEMANA ANTERIOR
    const lastWeekReadiness = await db.query(
      `SELECT ROUND(AVG(score)::numeric, 1) as avg_score
       FROM readiness_scores
       WHERE usuario_id = $1 
         AND fecha >= $2
         AND fecha <= $3`,
      [userId, lastWeekStart.toISOString().split('T')[0], lastWeekEnd.toISOString().split('T')[0]]
    );

    const lastWeekAvg = lastWeekReadiness.rows[0]?.avg_score || 0;
    const diff = (parseFloat(avgReadiness) - parseFloat(lastWeekAvg)).toFixed(1);
    const trend = parseFloat(diff) > 0 ? 'up' : parseFloat(diff) < 0 ? 'down' : 'stable';

    res.json({
      success: true,
      periodo: {
        inicio: currentWeekStart.toISOString().split('T')[0],
        fin: today.toISOString().split('T')[0]
      },
      readiness: {
        promedio: parseFloat(avgReadiness),
        minimo: parseFloat(minReadiness),
        maximo: parseFloat(maxReadiness)
      },
      mejorDia: bestDay,
      peorDia: worstDay,
      testMasFrecuente: mostFrequentTest,
      patronDestacado: mostNotablePattern,
      intervencionesCompletadas: completedInterventions,
      comparacionSemanaAnterior: {
        laSemanaAnterior: parseFloat(lastWeekAvg),
        estaSemanaPromedio: parseFloat(avgReadiness),
        diferencia: parseFloat(diff),
        tendencia: trend
      }
    });
  } catch (error) {
    console.error('Error al obtener reporte semanal:', error);
    res.status(500).json({ error: 'Error al obtener reporte semanal' });
  }
};

module.exports = {
  getWeeklyReport
};
