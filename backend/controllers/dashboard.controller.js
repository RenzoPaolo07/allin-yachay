// backend/controllers/dashboard.controller.js
const { Estudiante, Curso, Calificacion } = require('../models');

exports.getDashboardData = async (req, res) => {
    try {
        // Datos simulados para la demo
        const totalEstudiantes = 1250;
        const activos = 1120;
        const enRiesgo = 95;
        const abandonaron = 35;

        const cursosPopulares = [
            { nombre: 'Programación', estudiantes: 450 },
            { nombre: 'Matemáticas', estudiantes: 380 },
            { nombre: 'Física', estudiantes: 320 }
        ];

        const universidades = [
            { nombre: 'UNSAAC - Cusco', estudiantes: 450 },
            { nombre: 'UNMSM - Lima', estudiantes: 350 },
            { nombre: 'PUCP - Lima', estudiantes: 250 },
            { nombre: 'UNI - Lima', estudiantes: 200 }
        ];

        const predicciones = {
            bajo_riesgo: 720,
            riesgo_medio: 285,
            alto_riesgo: 95
        };

        res.json({
            success: true,
            data: {
                total_estudiantes: totalEstudiantes,
                activos: activos,
                en_riesgo: enRiesgo,
                abandonaron: abandonaron,
                tasa_permanencia: ((activos / totalEstudiantes) * 100).toFixed(2),
                cursos_populares: cursosPopulares,
                universidades: universidades,
                predicciones: predicciones
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getEstadisticas = async (req, res) => {
    try {
        const estadisticas = {
            mensual: {
                enero: 85,
                febrero: 88,
                marzo: 92,
                abril: 87,
                mayo: 90,
                junio: 89
            },
            por_carrera: {
                'Ing. Sistemas': 92,
                'Ing. Civil': 85,
                'Medicina': 95,
                'Derecho': 78,
                'Administración': 82
            }
        };
        res.json({ success: true, data: estadisticas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getTendencias = async (req, res) => {
    try {
        const tendencias = {
            abandonos: [12, 15, 8, 20, 10, 5],
            inscripciones: [45, 52, 48, 60, 55, 70]
        };
        res.json({ success: true, data: tendencias });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};