const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { 
  getSuggestedIntervention,
  completeIntervention,
  getInterventionHistory,
  assignIntervention,
  getWeekCompletedInterventions,
  getPrescribedInterventions
} = require('../controllers/intervencionesController');

// Obtener intervención sugerida
router.get('/sugerida', authMiddleware, getSuggestedIntervention);

// Obtener intervenciones prescritas
router.get('/prescritas', authMiddleware, getPrescribedInterventions);

// Obtener historial de intervenciones
router.get('/historial', authMiddleware, getInterventionHistory);

// Marcar como completada
router.post('/:id/completar', authMiddleware, completeIntervention);

// Asignar intervención (entrenador)
router.post('/asignar', authMiddleware, assignIntervention);

// Obtener intervenciones completadas esta semana (entrenador)
router.get('/equipo/completadas', authMiddleware, getWeekCompletedInterventions);

module.exports = router;
