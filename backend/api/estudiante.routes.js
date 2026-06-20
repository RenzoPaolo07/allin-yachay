// backend/api/estudiante.routes.js
const express = require('express');
const router = express.Router();
const EstudianteController = require('../controllers/estudiante.controller');
const { validateEstudiante } = require('../middleware/validators');

router.get('/', EstudianteController.getAll);
router.get('/:id', EstudianteController.getById);
router.post('/', validateEstudiante, EstudianteController.create);
router.put('/:id', EstudianteController.update);
router.delete('/:id', EstudianteController.delete);
router.get('/:id/riesgo', EstudianteController.getRiesgo);

module.exports = router;