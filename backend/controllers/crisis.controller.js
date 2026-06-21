// backend/controllers/crisis.controller.js
const CrisisService = require('../services/crisis.service');

exports.detectarCrisis = async (req, res) => {
    try {
        const { estudiantes } = req.body;
        const config = req.body.config || {};

        const resultado = await CrisisService.detectarCrisis(estudiantes, config);

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

exports.getAlertasTempranas = async (req, res) => {
    try {
        const { universidadId } = req.params;
        const alertas = await CrisisService.obtenerAlertasTempranas(parseInt(universidadId));
        res.json({
            success: true,
            data: alertas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};