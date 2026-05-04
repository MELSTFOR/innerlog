const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// Todas las rutas requieren autenticación y rol de entrenador
router.use(authMiddleware);
router.use(requireRole(['entrenador']));

// GET - Obtener equipo con readiness
router.get('/equipo', entrenadorController.getEquipo);

// GET - Obtener historial de un atleta
router.get('/atleta/:id', entrenadorController.getAtletaHistorial);

// GET - Obtener tendencia del equipo
router.get('/tendencia', entrenadorController.getEquipoTendencia);

module.exports = router;
