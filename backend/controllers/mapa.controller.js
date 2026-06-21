// backend/controllers/mapa.controller.js
const MapaService = require('../services/mapa.service');

exports.getRegiones = async (req, res) => {
    try {
        const regiones = await MapaService.obtenerRegiones();
        res.json({
            success: true,
            data: regiones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getEstadisticasNacionales = async (req, res) => {
    try {
        const estadisticas = await MapaService.obtenerEstadisticasNacionales();
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

exports.getRegionesCriticas = async (req, res) => {
    try {
        const criticas = await MapaService.obtenerRegionesCriticas();
        res.json({
            success: true,
            data: criticas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.actualizarTiempoReal = async (req, res) => {
    try {
        const actualizadas = await MapaService.actualizarDatosTiempoReal();
        res.json({
            success: true,
            message: 'Datos actualizados en tiempo real',
            data: actualizadas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};