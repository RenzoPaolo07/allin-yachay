// backend/api/beca.routes.js
const express = require('express');
const router = express.Router();
const BecaController = require('../controllers/beca.controller');

router.get('/recomendadas/:estudianteId', BecaController.getRecomendadas);
router.get('/todas', BecaController.getAll);
router.post('/postular', BecaController.postular);

module.exports = router;