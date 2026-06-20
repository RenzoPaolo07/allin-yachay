// backend/api/prediccion.routes.js
const express = require('express');
const router = express.Router();
const PrediccionController = require('../controllers/prediccion.controller');

router.get('/:estudianteId', PrediccionController.getPrediccion);
router.post('/analizar', PrediccionController.analizarEstudiante);
router.get('/:estudianteId/talento', PrediccionController.detectarTalento);

module.exports = router;