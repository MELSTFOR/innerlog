const db = require('../config/db');

// Enviar kudo a un compañero
const sendKudo = async (req, res) => {
  try {
    const deUsuarioId = req.user.id;
    const { a_usuario_id, mensaje } = req.body;

    // Validar que no sea a sí mismo
    if (deUsuarioId === parseInt(a_usuario_id)) {
      return res.status(400).json({ error: 'No puedes enviar kudos a ti mismo' });
    }

    // Validar que el receptor exista y esté en el mismo equipo
    const receptorResult = await db.query(
      `SELECT u1.equipo_id FROM usuarios u1
       WHERE u1.id = $1
       AND u1.equipo_id = (SELECT u2.equipo_id FROM usuarios u2 WHERE u2.id = $2)`,
      [a_usuario_id, deUsuarioId]
    );

    if (receptorResult.rows.length === 0) {
      return res.status(403).json({ error: 'El usuario no está en tu equipo' });
    }

    // Insertar kudo
    const result = await db.query(
      `INSERT INTO kudos (de_usuario_id, a_usuario_id, mensaje)
       VALUES ($1, $2, $3)
       RETURNING id, timestamp`,
      [deUsuarioId, a_usuario_id, mensaje || null]
    );

    res.json({
      success: true,
      kudo: result.rows[0],
    });
  } catch (error) {
    console.error('Error al enviar kudo:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener kudos recibidos (últimos 10)
const getKudosRecibidos = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT 
         k.id,
         u.id as de_usuario_id,
         u.nombre as de_usuario_nombre,
         k.mensaje,
         k.timestamp
       FROM kudos k
       JOIN usuarios u ON k.de_usuario_id = u.id
       WHERE k.a_usuario_id = $1
       ORDER BY k.timestamp DESC
       LIMIT 10`,
      [userId]
    );

    res.json({ kudos: result.rows });
  } catch (error) {
    console.error('Error al obtener kudos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener ranking de kudos del equipo
const getKudosRanking = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener equipo_id
    const userResult = await db.query(
      'SELECT equipo_id FROM usuarios WHERE id = $1',
      [userId]
    );

    if (!userResult.rows[0]?.equipo_id) {
      return res.json({ ranking: [] });
    }

    const equipoId = userResult.rows[0].equipo_id;

    // Contar kudos por usuario
    const result = await db.query(
      `SELECT 
         u.id,
         u.nombre,
         COUNT(k.id) as kudos_recibidos,
         ROW_NUMBER() OVER (ORDER BY COUNT(k.id) DESC) as posicion
       FROM usuarios u
       LEFT JOIN kudos k ON u.id = k.a_usuario_id
       WHERE u.equipo_id = $1 AND u.rol = 'atleta'
       GROUP BY u.id, u.nombre
       ORDER BY kudos_recibidos DESC`,
      [equipoId]
    );

    res.json({ ranking: result.rows });
  } catch (error) {
    console.error('Error al obtener ranking de kudos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  sendKudo,
  getKudosRecibidos,
  getKudosRanking,
};
