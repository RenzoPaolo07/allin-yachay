// backend/api/tutor.routes.js
const express = require('express');
const router = express.Router();
const TutorController = require('../controllers/tutor.controller');

router.post('/preguntar', TutorController.preguntar);
router.get('/historial/:estudianteId', TutorController.getHistorial);
router.post('/recomendar', TutorController.recomendarCurso);

module.exports = router;