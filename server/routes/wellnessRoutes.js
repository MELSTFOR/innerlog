const express = require('express');
const router = express.Router();
const wellnessController = require('../controllers/wellnessController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST - Crear entrada de wellness
router.post('/', wellnessController.createWellness);

// GET - Obtener wellness (últimas 7 entradas)
router.get('/', wellnessController.getWellness);

// GET - Obtener wellness de hoy
router.get('/today', wellnessController.getWellnessToday);

module.exports = router;
