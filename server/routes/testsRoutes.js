const express = require('express');
const router = express.Router();
const testsController = require('../controllers/testsController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST - Crear resultado de test
router.post('/', testsController.createTestSession);

// GET - Obtener todos los tests del usuario
router.get('/', testsController.getTestSessions);

// GET - Obtener tests por tipo (stroop, pvt-b, msit)
router.get('/:tipo', testsController.getTestByType);

module.exports = router;
