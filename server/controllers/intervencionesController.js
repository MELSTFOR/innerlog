const db = require('../config/db');

// Templates de intervenciones predefinidas
const INTERVENTION_TEMPLATES = {
  respiracion: {
    titulo: 'Respiración Guiada',
    descripcion: 'Box breathing: inhala 4 segundos, retén 4 segundos, exhala 4 segundos. Repite 4 ciclos.',
    duracion_minutos: 2,
    pasos: [
      { numero: 1, descripcion: 'Busca un lugar tranquilo y siéntate cómodamente' },
      { numero: 2, descripcion: 'Inhala profundamente contando hasta 4' },
      { numero: 3, descripcion: 'Retén la respiración contando hasta 4' },
      { numero: 4, descripcion: 'Exhala contando hasta 4' },
      { numero: 5, descripcion: 'Repite 4 ciclos completos' }
    ]
  },
  activacion: {
    titulo: 'Activación Mental',
    descripcion: 'Rutina de activación pre-entrenamiento para mejorar enfoque y energía',
    duracion_minutos: 5,
    pasos: [
      { numero: 1, descripcion: 'De pie, realiza movilidad dinámica de brazos por 30 segundos' },
      { numero: 2, descripcion: 'Realiza 10 burpees lentamente (enfoque en forma)' },
      { numero: 3, descripcion: 'Respira profundamente 5 veces con intención' },
      { numero: 4, descripcion: 'Realiza 20 saltos con visualización positiva' },
      { numero: 5, descripcion: '¡Listo! Cálido y activado' }
    ]
  },
  recuperacion: {
    titulo: 'Recuperación Post-Entrenamiento',
    descripcion: 'Protocolo de cierre para facilitar recuperación',
    duracion_minutos: 5,
    pasos: [
      { numero: 1, descripcion: 'Camina lentamente durante 2 minutos' },
      { numero: 2, descripcion: 'Realiza estiramientos estáticos por 2 minutos' },
      { numero: 3, descripcion: 'Realiza respiración profunda: 10 respiraciones diafragmáticas' },
      { numero: 4, descripcion: 'Cierra los ojos e intenta 30 segundos de meditación' },
      { numero: 5, descripcion: 'Hidrátate bien' }
    ]
  }
};

// Obtener intervención sugerida según readiness del día
const getSuggestedIntervention = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Obtener readiness de hoy
    const readinessResult = await db.query(
      `SELECT score FROM readiness_scores 
       WHERE usuario_id = $1 AND fecha = $2`,
      [userId, today.toISOString().split('T')[0]]
    );

    let type = 'activacion'; // default
    let suggestedMessage = '';

    if (readinessResult.rows.length > 0) {
      const score = parseFloat(readinessResult.rows[0].score);
      
      if (score < 50) {
        type = 'respiracion';
        suggestedMessage = 'Tu readiness está bajo hoy. Antes de entrenar, probá esto:';
      } else if (score > 75) {
        type = 'activacion';
        suggestedMessage = 'Estás en un buen momento. Potencialo con esto:';
      } else {
        type = 'recuperacion';
        suggestedMessage = 'Mantén el ritmo con una intervención de recuperación:';
      }
    }

    // Verificar si ya existe sugerencia de hoy
    const existingResult = await db.query(
      `SELECT id FROM intervenciones 
       WHERE usuario_id = $1 
       AND tipo = $2 
       AND DATE(fecha_asignacion) = $3`,
      [userId, type, today.toISOString().split('T')[0]]
    );

    let interventionId;
    
    if (existingResult.rows.length > 0) {
      interventionId = existingResult.rows[0].id;
    } else {
      // Crear nueva intervención
      const template = INTERVENTION_TEMPLATES[type];
      const result = await db.query(
        `INSERT INTO intervenciones 
         (usuario_id, tipo, titulo, descripcion, duracion_minutos, fecha_asignacion)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING id`,
        [userId, type, template.titulo, template.descripcion, template.duracion_minutos]
      );
      interventionId = result.rows[0].id;
    }

    // Obtener intervención completa
    const interventionResult = await db.query(
      `SELECT * FROM intervenciones WHERE id = $1`,
      [interventionId]
    );

    const intervention = interventionResult.rows[0];
    const template = INTERVENTION_TEMPLATES[intervention.tipo];

    res.json({
      success: true,
      intervention: {
        id: intervention.id,
        tipo: intervention.tipo,
        titulo: intervention.titulo,
        descripcion: intervention.descripcion,
        duracion_minutos: intervention.duracion_minutos,
        completada: intervention.completada,
        fecha_asignacion: intervention.fecha_asignacion,
        pasos: template.pasos
      },
      mensaje: suggestedMessage
    });
  } catch (error) {
    console.error('Error al obtener intervención sugerida:', error);
    res.status(500).json({ error: 'Error al obtener intervención sugerida' });
  }
};

// Marcar intervención como completada
const completeIntervention = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar permisos
    const checkResult = await db.query(
      `SELECT usuario_id FROM intervenciones WHERE id = $1`,
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Intervención no encontrada' });
    }

    if (checkResult.rows[0].usuario_id !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para completar esta intervención' });
    }

    // Marcar como completada
    const result = await db.query(
      `UPDATE intervenciones 
       SET completada = TRUE, fecha_completada = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      message: '¡Intervención completada! Excelente trabajo.',
      intervention: result.rows[0]
    });
  } catch (error) {
    console.error('Error al completar intervención:', error);
    res.status(500).json({ error: 'Error al completar intervención' });
  }
};

// Obtener historial de intervenciones completadas
const getInterventionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    const result = await db.query(
      `SELECT id, tipo, titulo, descripcion, duracion_minutos, 
              fecha_asignacion, fecha_completada, completada
       FROM intervenciones
       WHERE usuario_id = $1
       ORDER BY fecha_asignacion DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Estadísticas
    const statsResult = await db.query(
      `SELECT 
        tipo,
        COUNT(*) as total,
        COUNT(CASE WHEN completada = TRUE THEN 1 END) as completadas
       FROM intervenciones
       WHERE usuario_id = $1
       GROUP BY tipo`,
      [userId]
    );

    const completedCount = await db.query(
      `SELECT COUNT(*) as total FROM intervenciones 
       WHERE usuario_id = $1 AND completada = TRUE`,
      [userId]
    );

    res.json({
      success: true,
      intervenciones: result.rows,
      estadisticas: {
        totalCompletadas: parseInt(completedCount.rows[0].total),
        porTipo: statsResult.rows
      },
      paginacion: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

// Asignar intervención manualmente (entrenador)
const assignIntervention = async (req, res) => {
  try {
    const entrenadorId = req.user.id;
    const { atleta_id, tipo, nota } = req.body;

    // Verificar que es entrenador
    const entrenadorCheck = await db.query(
      `SELECT rol FROM usuarios WHERE id = $1`,
      [entrenadorId]
    );

    if (!entrenadorCheck.rows[0] || entrenadorCheck.rows[0].rol !== 'entrenador') {
      return res.status(403).json({ error: 'Solo entrenadores pueden asignar intervenciones' });
    }

    // Verificar que el atleta está en su equipo
    const atletaCheck = await db.query(
      `SELECT equipo_id FROM usuarios WHERE id = $1`,
      [atleta_id]
    );

    // Get the trainer's team through equipos table
    const entrenadorTeamCheck = await db.query(
      `SELECT id FROM equipos WHERE entrenador_id = $1`,
      [entrenadorId]
    );

    if (atletaCheck.rows.length === 0 || entrenadorTeamCheck.rows.length === 0 ||
        atletaCheck.rows[0].equipo_id !== entrenadorTeamCheck.rows[0].id) {
      return res.status(403).json({ error: 'El atleta no está en tu equipo' });
    }

    if (!INTERVENTION_TEMPLATES[tipo]) {
      return res.status(400).json({ error: 'Tipo de intervención inválido' });
    }

    const template = INTERVENTION_TEMPLATES[tipo];
    
    const result = await db.query(
      `INSERT INTO intervenciones 
       (usuario_id, tipo, titulo, descripcion, duracion_minutos, fecha_asignacion)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [atleta_id, tipo, template.titulo, template.descripcion, template.duracion_minutos]
    );

    res.json({
      success: true,
      message: 'Intervención asignada exitosamente',
      intervention: result.rows[0]
    });
  } catch (error) {
    console.error('Error al asignar intervención:', error);
    res.status(500).json({ error: 'Error al asignar intervención' });
  }
};

// Obtener intervenciones completadas esta semana (para entrenador)
const getWeekCompletedInterventions = async (req, res) => {
  try {
    const entrenadorId = req.user.id;

    // Verificar que es entrenador
    const entrenadorCheck = await db.query(
      `SELECT rol FROM usuarios WHERE id = $1`,
      [entrenadorId]
    );

    if (!entrenadorCheck.rows[0] || entrenadorCheck.rows[0].rol !== 'entrenador') {
      return res.status(403).json({ error: 'Solo entrenadores pueden ver esta información' });
    }

    // Obtener intervenciones completadas esta semana
    const result = await db.query(
      `SELECT 
        u.id,
        u.nombre,
        COUNT(*) as total_completadas,
        STRING_AGG(DISTINCT i.tipo, ', ') as tipos,
        MAX(i.fecha_completada) as ultima_completada
       FROM intervenciones i
       INNER JOIN usuarios u ON u.id = i.usuario_id
       WHERE u.equipo_id = (SELECT equipo_id FROM usuarios WHERE id = $1)
         AND i.completada = TRUE
         AND i.fecha_completada >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY u.id, u.nombre
       ORDER BY total_completadas DESC`,
      [entrenadorId]
    );

    res.json({
      success: true,
      atletas: result.rows
    });
  } catch (error) {
    console.error('Error al obtener intervenciones completadas:', error);
    res.status(500).json({ error: 'Error al obtener intervenciones completadas' });
  }
};

// Obtener intervenciones prescritas por el psicólogo (para atletas)
const getPrescribedInterventions = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT id, tipo, titulo, descripcion, duracion_minutos, completada, fecha_asignacion, fecha_completada
       FROM intervenciones
       WHERE usuario_id = $1 AND asignada_por_entrenador = TRUE
       ORDER BY fecha_asignacion DESC`,
      [userId]
    );

    res.json({
      success: true,
      intervenciones: result.rows
    });
  } catch (error) {
    console.error('Error al obtener intervenciones prescritas:', error);
    res.status(500).json({ error: 'Error al obtener intervenciones prescritas' });
  }
};

module.exports = {
  getSuggestedIntervention,
  completeIntervention,
  getInterventionHistory,
  assignIntervention,
  getWeekCompletedInterventions,
  getPrescribedInterventions
};
