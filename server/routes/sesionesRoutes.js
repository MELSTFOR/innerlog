const express = require('express');
const router = express.Router();
const sesionesController = require('../controllers/sesionesController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST - Crear nueva sesión
router.post('/', sesionesController.createSesion);

// GET - Obtener todas las sesiones del usuario
router.get('/', sesionesController.getSesiones);

// GET - Obtener una sesión específica
router.get('/:id', sesionesController.getSesionById);

// PATCH - Actualizar sesión
router.patch('/:id', sesionesController.updateSesion);

// DELETE - Eliminar sesión
router.delete('/:id', sesionesController.deleteSesion);

module.exports = router;
