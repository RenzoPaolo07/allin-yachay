// backend/api/tutor.routes.js
const express = require('express');
const router = express.Router();
const TutorController = require('../controllers/tutor.controller');

// ✅ Verificar que TutorController existe y tiene los métodos
console.log('📌 TutorController cargado:', Object.keys(TutorController));

router.post('/preguntar', TutorController.preguntar);
router.get('/historial/:estudianteId', TutorController.getHistorial);
router.post('/recomendar', TutorController.recomendarCurso);

module.exports = router;