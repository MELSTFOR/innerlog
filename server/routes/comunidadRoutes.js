const express = require('express');
const router = express.Router();
const comunidadController = require('../controllers/comunidadController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET - Feed de actividad
router.get('/feed', comunidadController.getFeed);

// GET - Reto semanal
router.get('/reto', comunidadController.getRetoSemanal);

// GET - Leaderboard por racha
router.get('/leaderboard', comunidadController.getLeaderboard);

module.exports = router;
