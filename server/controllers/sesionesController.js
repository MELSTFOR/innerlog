const db = require('../config/db');

// Crear nueva sesión de entrenamiento
const createSesion = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      esfuerzo_mental,
      enfoque,
      emocional,
      fatiga_carrera,
      fatiga_dia_siguiente,
      satisfaccion,
      notas,
      fecha,
    } = req.body;

    // Validar que los valores estén entre 1 y 10
    const valores = [
      esfuerzo_mental,
      enfoque,
      emocional,
      fatiga_carrera,
      fatiga_dia_siguiente,
      satisfaccion,
    ];

    for (const valor of valores) {
      if (valor < 1 || valor > 10) {
        return res.status(400).json({ error: 'Los valores deben estar entre 1 y 10' });
      }
    }

    // Crear timestamp: si viene fecha (YYYY-MM-DD), usarla; si no, usar hoy
    let timestamp;
    if (fecha) {
      timestamp = new Date(`${fecha}T12:00:00Z`).toISOString();
    } else {
      timestamp = new Date().toISOString();
    }

    const result = await db.query(
      `INSERT INTO sesiones_entrenamiento 
       (usuario_id, esfuerzo_mental, enfoque, emocional, fatiga_carrera, fatiga_dia_siguiente, satisfaccion, notas, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, esfuerzo_mental, enfoque, emocional, fatiga_carrera, fatiga_dia_siguiente, satisfaccion, notas, timestamp]
    );

    res.status(201).json({
      message: 'Sesión registrada exitosamente',
      sesion: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear sesión:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener todas las sesiones del usuario
const getSesiones = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT * FROM sesiones_entrenamiento 
       WHERE usuario_id = $1 
       ORDER BY timestamp DESC`,
      [userId]
    );

    res.json({ sesiones: result.rows });
  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener una sesión específica
const getSesionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await db.query(
      `SELECT * FROM sesiones_entrenamiento 
       WHERE id = $1 AND usuario_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    res.json({ sesion: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener sesión:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar sesión
const updateSesion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      esfuerzo_mental,
      enfoque,
      emocional,
      fatiga_carrera,
      fatiga_dia_siguiente,
      satisfaccion,
      notas,
    } = req.body;

    // Verificar que la sesión pertenece al usuario
    const sesionResult = await db.query(
      `SELECT * FROM sesiones_entrenamiento 
       WHERE id = $1 AND usuario_id = $2`,
      [id, userId]
    );

    if (sesionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    // Construir query dinámicamente según los campos proporcionados
    let updateFields = [];
    let updateValues = [];
    let paramIndex = 1;

    if (esfuerzo_mental !== undefined) {
      updateFields.push(`esfuerzo_mental = $${paramIndex}`);
      updateValues.push(esfuerzo_mental);
      paramIndex++;
    }
    if (enfoque !== undefined) {
      updateFields.push(`enfoque = $${paramIndex}`);
      updateValues.push(enfoque);
      paramIndex++;
    }
    if (emocional !== undefined) {
      updateFields.push(`emocional = $${paramIndex}`);
      updateValues.push(emocional);
      paramIndex++;
    }
    if (fatiga_carrera !== undefined) {
      updateFields.push(`fatiga_carrera = $${paramIndex}`);
      updateValues.push(fatiga_carrera);
      paramIndex++;
    }
    if (fatiga_dia_siguiente !== undefined) {
      updateFields.push(`fatiga_dia_siguiente = $${paramIndex}`);
      updateValues.push(fatiga_dia_siguiente);
      paramIndex++;
    }
    if (satisfaccion !== undefined) {
      updateFields.push(`satisfaccion = $${paramIndex}`);
      updateValues.push(satisfaccion);
      paramIndex++;
    }
    if (notas !== undefined) {
      updateFields.push(`notas = $${paramIndex}`);
      updateValues.push(notas);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    updateValues.push(id);
    updateValues.push(userId);

    const query = `UPDATE sesiones_entrenamiento 
                   SET ${updateFields.join(', ')}
                   WHERE id = $${paramIndex} AND usuario_id = $${paramIndex + 1}
                   RETURNING *`;

    const result = await db.query(query, updateValues);

    res.json({
      message: 'Sesión actualizada exitosamente',
      sesion: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar sesión:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar sesión
const deleteSesion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM sesiones_entrenamiento 
       WHERE id = $1 AND usuario_id = $2
       RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    res.json({ message: 'Sesión eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar sesión:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  createSesion,
  getSesiones,
  getSesionById,
  updateSesion,
  deleteSesion,
};
