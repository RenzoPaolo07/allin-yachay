// backend/api/bienestar.routes.js
const express = require('express');
const router = express.Router();
const BienestarController = require('../controllers/bienestar.controller');

router.post('/evaluar/:estudianteId', BienestarController.evaluarBienestar);
router.post('/estadisticas', BienestarController.getEstadisticasBienestar);

module.exports = router;