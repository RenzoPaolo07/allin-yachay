// backend/controllers/bienestar.controller.js
const BienestarService = require('../services/bienestar.service');

exports.evaluarBienestar = async (req, res) => {
    try {
        const { estudianteId } = req.params;
        const datos = req.body;

        const resultado = await BienestarService.evaluarBienestar(parseInt(estudianteId), datos);

        res.json({
            success: true,
            data: resultado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getEstadisticasBienestar = async (req, res) => {
    try {
        const { estudiantesIds } = req.body;
        const estadisticas = await BienestarService.obtenerEstadisticasBienestar(estudiantesIds);
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