// backend/api/dashboard.routes.js
const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');

router.get('/', DashboardController.getDashboardData);
router.get('/estadisticas', DashboardController.getEstadisticas);
router.get('/tendencias', DashboardController.getTendencias);

module.exports = router;