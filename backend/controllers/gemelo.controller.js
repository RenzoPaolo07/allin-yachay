// backend/controllers/gemelo.controller.js
const GemeloService = require('../services/gemelo.service');

exports.getGemelo = async (req, res) => {
    try {
        const { estudianteId } = req.params;
        const gemelo = await GemeloService.obtenerGemelo(parseInt(estudianteId));
        res.json({
            success: true,
            data: gemelo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.simularEscenario = async (req, res) => {
    try {
        const { estudianteId } = req.params;
        const { tipo, horas, descripcion } = req.body;
        
        const resultado = await GemeloService.simularEscenario(
            parseInt(estudianteId),
            { tipo, horas, descripcion }
        );
        
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

exports.obtenerEscenarios = async (req, res) => {
    try {
        const { estudianteId } = req.params;
        const gemelo = await GemeloService.obtenerGemelo(parseInt(estudianteId));
        
        res.json({
            success: true,
            data: gemelo.escenarios || []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};