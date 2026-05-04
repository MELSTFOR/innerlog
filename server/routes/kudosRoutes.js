const express = require('express');
const router = express.Router();
const kudosController = require('../controllers/kudosController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST - Enviar kudo
router.post('/', kudosController.sendKudo);

// GET - Kudos recibidos
router.get('/recibidos', kudosController.getKudosRecibidos);

// GET - Ranking de kudos del equipo
router.get('/ranking', kudosController.getKudosRanking);

module.exports = router;
