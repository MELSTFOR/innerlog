const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/me', authMiddleware, authController.getMe);

// Actualizar actividad del usuario
router.post('/update-activity', authMiddleware, authController.updateActivity);

module.exports = router;
