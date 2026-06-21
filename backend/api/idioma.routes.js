// backend/api/idioma.routes.js
const express = require('express');
const router = express.Router();
const IdiomaController = require('../controllers/idioma.controller');

// Obtener todos los idiomas
router.get('/', IdiomaController.getIdiomas);

// Obtener estadísticas
router.get('/estadisticas', IdiomaController.getEstadisticas);

// Obtener traducciones de un idioma
router.get('/:idioma', IdiomaController.getTraducciones);

// Cambiar idioma actual
router.post('/cambiar', IdiomaController.setIdioma);

// Traducir contenido
router.post('/traducir', IdiomaController.traducirContenido);

// Agregar traducción (admin)
router.post('/agregar', IdiomaController.agregarTraduccion);

module.exports = router;