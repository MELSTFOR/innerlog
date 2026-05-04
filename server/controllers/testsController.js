const db = require('../config/db');

// Crear resultado de test
const createTestSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      tipo_test,
      precision,
      tr_medio,
      tr_min,
      tr_max,
      lapses,
      anticipaciones,
      duracion,
    } = req.body;

    // Validar tipo_test
    const tiposValidos = ['stroop', 'pvt-b', 'msit'];
    if (!tiposValidos.includes(tipo_test.toLowerCase())) {
      return res.status(400).json({ error: 'Tipo de test inválido' });
    }

    const result = await db.query(
      `INSERT INTO test_sessions 
       (usuario_id, tipo_test, precision, tr_medio, tr_min, tr_max, lapses, anticipaciones, duracion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, tipo_test, precision, tr_medio, tr_min, tr_max, lapses || 0, anticipaciones || 0, duracion]
    );

    res.status(201).json({
      message: 'Resultado de test guardado exitosamente',
      test: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear test:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener tests del usuario
const getTestSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT * FROM test_sessions 
       WHERE usuario_id = $1 
       ORDER BY timestamp DESC`,
      [userId]
    );

    res.json({ tests: result.rows });
  } catch (error) {
    console.error('Error al obtener tests:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener tests por tipo
const getTestByType = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tipo } = req.params;

    const result = await db.query(
      `SELECT * FROM test_sessions 
       WHERE usuario_id = $1 AND tipo_test = $2
       ORDER BY timestamp DESC
       LIMIT 10`,
      [userId, tipo]
    );

    res.json({ tests: result.rows });
  } catch (error) {
    console.error('Error al obtener tests por tipo:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  createTestSession,
  getTestSessions,
  getTestByType,
};
