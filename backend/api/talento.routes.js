// backend/api/talento.routes.js
const express = require('express');
const router = express.Router();
const TalentoController = require('../controllers/talento.controller');

router.post('/detectar/:estudianteId', TalentoController.detectarTalento);
router.post('/analizar-grupo', TalentoController.analizarGrupo);
router.get('/tipos', TalentoController.getTiposTalento);

module.exports = router;