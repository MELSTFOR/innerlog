const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { analyzePatterns, getTeamPatterns } = require('../controllers/patronesController');

// Obtener patrones del usuario
router.get('/', authMiddleware, analyzePatterns);

// Obtener patrones del equipo (solo entrenador)
router.get('/equipo', authMiddleware, getTeamPatterns);

module.exports = router;
