// backend/controllers/idioma.controller.js
const IdiomaService = require('../services/idioma.service');

// Obtener todos los idiomas disponibles
exports.getIdiomas = (req, res) => {
    try {
        const idiomas = IdiomaService.getIdiomas();
        res.json({
            success: true,
            data: idiomas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Obtener traducciones de un idioma
exports.getTraducciones = (req, res) => {
    try {
        const { idioma } = req.params;
        const traducciones = IdiomaService.getTraducciones(idioma || 'es');
        res.json({
            success: true,
            data: traducciones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Cambiar idioma actual
exports.setIdioma = (req, res) => {
    try {
        const { idioma } = req.body;
        const resultado = IdiomaService.setIdiomaActual(idioma);
        if (resultado) {
            res.json({
                success: true,
                message: `Idioma cambiado a ${idioma}`,
                data: {
                    idioma_actual: idioma,
                    traducciones: IdiomaService.getTraducciones(idioma)
                }
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Idioma no soportado'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Traducir contenido educativo
exports.traducirContenido = async (req, res) => {
    try {
        const { texto, idioma_origen = 'es', idioma_destino } = req.body;
        
        if (!idioma_destino) {
            return res.status(400).json({
                success: false,
                error: 'Idioma destino requerido'
            });
        }

        const resultado = await IdiomaService.traducirContenidoEducativo(
            texto,
            idioma_origen,
            idioma_destino
        );

        res.json({
            success: true,
            data: {
                texto_original: texto,
                texto_traducido: resultado,
                idioma_origen,
                idioma_destino
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Obtener estadísticas de idiomas
exports.getEstadisticas = (req, res) => {
    try {
        const estadisticas = IdiomaService.getEstadisticasIdiomas();
        res.json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Agregar nueva traducción (solo para administradores)
exports.agregarTraduccion = (req, res) => {
    try {
        const { idioma, clave, valor } = req.body;
        
        if (!idioma || !clave || !valor) {
            return res.status(400).json({
                success: false,
                error: 'Idioma, clave y valor son requeridos'
            });
        }

        const resultado = IdiomaService.agregarTraduccion(idioma, clave, valor);
        
        res.json({
            success: true,
            message: 'Traducción agregada exitosamente',
            data: { idioma, clave, valor }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};