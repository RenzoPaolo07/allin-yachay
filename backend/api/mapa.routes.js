// backend/api/mapa.routes.js
const express = require('express');
const router = express.Router();
const MapaController = require('../controllers/mapa.controller');

router.get('/regiones', MapaController.getRegiones);
router.get('/estadisticas', MapaController.getEstadisticasNacionales);
router.get('/criticas', MapaController.getRegionesCriticas);
router.get('/tiempo-real', MapaController.actualizarTiempoReal);

module.exports = router;