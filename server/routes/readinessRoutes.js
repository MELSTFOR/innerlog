const express = require('express');
const router = express.Router();
const readinessController = require('../controllers/readinessController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET - Calcular y obtener readiness de hoy
router.get('/hoy', readinessController.calculateReadinessToday);

// GET - Obtener tendencia de últimos 7 días
router.get('/tendencia', readinessController.getReadinessTrend);

// GET - Obtener readiness de un usuario específico
router.get('/usuario/:userId', readinessController.getUserReadiness);

module.exports = router;
