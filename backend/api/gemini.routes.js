// backend/api/gemini.routes.js
const express = require('express');
const router = express.Router();
const GeminiService = require('../services/gemini.service');

// Chat del tutor
router.post('/chat', async (req, res) => {
    try {
        const { mensaje, contexto } = req.body;
        const resultado = await GeminiService.chatTutor(mensaje, contexto);
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
});

// Predicción de riesgo
router.post('/predecir-riesgo', async (req, res) => {
    try {
        const datos = req.body;
        const resultado = await GeminiService.predecirRiesgo(datos);
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
});

// Detección de talento
router.post('/detectar-talento', async (req, res) => {
    try {
        const datos = req.body;
        const resultado = await GeminiService.detectarTalento(datos);
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
});

// Traducción a lenguas originarias
router.post('/traducir', async (req, res) => {
    try {
        const { texto, idioma_destino } = req.body;
        const resultado = await GeminiService.traducirContenido(texto, idioma_destino);
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
});

// Simular escenario (gemelo digital)
router.post('/simular-escenario', async (req, res) => {
    try {
        const { estudiante, escenario } = req.body;
        const resultado = await GeminiService.simularEscenario(estudiante, escenario);
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
});

// Detectar crisis
router.post('/detectar-crisis', async (req, res) => {
    try {
        const { estudiantes } = req.body;
        const resultado = await GeminiService.detectarCrisis(estudiantes);
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
});

module.exports = router;