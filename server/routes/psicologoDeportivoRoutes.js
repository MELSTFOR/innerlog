const express = require('express');
const router = express.Router();
const psicologoController = require('../controllers/psicologoDeportivoController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas del psicólogo deportivo
// GET - Obtener atletas asignados
router.get('/atletas', psicologoController.getAtletasAsignados);

// GET - Obtener atletas inactivos
router.get('/atletasInactivos', psicologoController.getAtletasInactivos);

// GET - Obtener intervenciones asignadas
router.get('/intervenciones', psicologoController.getIntervencionesAsignadas);

// GET - Obtener resumen de un atleta específico
router.get('/atleta/:id', psicologoController.getResumenAtleta);

// GET - Obtener estadísticas generales
router.get('/estadisticas', psicologoController.getEstadisticas);

// POST - Asignar intervención a un atleta
router.post('/asignar-intervencion', psicologoController.asignarIntervencion);

module.exports = router;
