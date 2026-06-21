// backend/api/oportunidades.routes.js
const express = require('express');
const router = express.Router();
const OportunidadesController = require('../controllers/oportunidades.controller');

router.get('/', OportunidadesController.getOportunidades);
router.get('/:id', OportunidadesController.getOportunidadById);
router.get('/tipo/:tipo', OportunidadesController.getOportunidadesByTipo);
router.post('/postular', OportunidadesController.postularOportunidad);

module.exports = router;