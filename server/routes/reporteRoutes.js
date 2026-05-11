const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getWeeklyReport } = require('../controllers/reporteController');

// Obtener reporte semanal
router.get('/semana', authMiddleware, getWeeklyReport);

module.exports = router;
