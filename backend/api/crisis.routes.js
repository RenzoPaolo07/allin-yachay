// backend/api/crisis.routes.js
const express = require('express');
const router = express.Router();
const CrisisController = require('../controllers/crisis.controller');

router.post('/detectar', CrisisController.detectarCrisis);
router.get('/alertas/:universidadId', CrisisController.getAlertasTempranas);

module.exports = router;