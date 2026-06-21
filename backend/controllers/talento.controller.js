// backend/controllers/talento.controller.js
const TalentoService = require('../services/talento.service');

exports.detectarTalento = async (req, res) => {
    try {
        const { estudianteId } = req.params;
        const datos = req.body;

        const resultado = await TalentoService.detectarTalento(
            parseInt(estudianteId),
            datos
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

exports.analizarGrupo = async (req, res) => {
    try {
        const { estudiantesIds, datos } = req.body;

        const resultado = await TalentoService.analizarGrupo(
            estudiantesIds,
            datos
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

exports.getTiposTalento = async (req, res) => {
    try {
        const tipos = [
            { id: 'investigador', nombre: '🔬 Investigador', descripcion: 'Habilidad para la investigación científica' },
            { id: 'emprendedor', nombre: '🚀 Emprendedor', descripcion: 'Visión para crear y liderar proyectos' },
            { id: 'ingeniero', nombre: '💻 Ingeniero', descripcion: 'Capacidad técnica y resolución de problemas' },
            { id: 'lider', nombre: '👥 Líder', descripcion: 'Habilidad para guiar y motivar equipos' }
        ];

        res.json({
            success: true,
            data: tipos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};