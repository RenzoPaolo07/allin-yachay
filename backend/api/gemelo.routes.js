// backend/api/gemelo.routes.js
const express = require('express');
const router = express.Router();
const GemeloController = require('../controllers/gemelo.controller');

router.get('/:estudianteId', GemeloController.getGemelo);
router.post('/:estudianteId/simular', GemeloController.simularEscenario);
router.get('/:estudianteId/escenarios', GemeloController.obtenerEscenarios);

module.exports = router;