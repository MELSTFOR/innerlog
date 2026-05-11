const db = require('../config/db');

// Crear entrada de wellness
const createWellness = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fatiga, sueno, dolor, estres, fecha } = req.body;

    // Validar valores entre 1 y 5
    const valores = [fatiga, sueno, dolor, estres];
    for (const valor of valores) {
      if (valor < 1 || valor > 5) {
        return res.status(400).json({ error: 'Los valores deben estar entre 1 y 5' });
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
      `INSERT INTO wellness_entries (usuario_id, fatiga, sueno, dolor, estres, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, fatiga, sueno, dolor, estres, timestamp]
    );

    res.status(201).json({
      message: 'Entrada de wellness guardada exitosamente',
      wellness: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear wellness:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener wellness del usuario
const getWellness = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT * FROM wellness_entries 
       WHERE usuario_id = $1 
       ORDER BY timestamp DESC
       LIMIT 7`,
      [userId]
    );

    res.json({ wellness: result.rows });
  } catch (error) {
    console.error('Error al obtener wellness:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener wellness de hoy
const getWellnessToday = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toDateString();

    const result = await db.query(
      `SELECT * FROM wellness_entries 
       WHERE usuario_id = $1 
       AND DATE(timestamp) = DATE($2)
       LIMIT 1`,
      [userId, new Date()]
    );

    res.json({ wellness: result.rows[0] || null });
  } catch (error) {
    console.error('Error al obtener wellness de hoy:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  createWellness,
  getWellness,
  getWellnessToday,
};
