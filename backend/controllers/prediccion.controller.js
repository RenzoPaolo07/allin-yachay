// backend/controllers/prediccion.controller.js
const { Estudiante, Calificacion } = require('../models');

exports.getPrediccion = async (req, res) => {
    try {
        const { estudianteId } = req.params;
        
        // Datos simulados de predicción
        const niveles = ['Bajo', 'Medio', 'Alto'];
        const nivel = niveles[Math.floor(Math.random() * 3)];
        
        const colores = {
            'Bajo': '#00c853',
            'Medio': '#ffab00',
            'Alto': '#d50000'
        };

        const prediccion = {
            estudiante_id: estudianteId,
            nivel_riesgo: nivel,
            color: colores[nivel],
            probabilidad_abandono: (Math.random() * 40 + 5).toFixed(2),
            factores: {
                rendimiento_academico: (Math.random() * 40 + 60).toFixed(1),
                asistencia: (Math.random() * 30 + 70).toFixed(1),
                participacion: (Math.random() * 40 + 60).toFixed(1),
                estado_emocional: (Math.random() * 40 + 60).toFixed(1),
                horas_estudio: (Math.random() * 20 + 10).toFixed(1)
            },
            metricas_detalladas: {
                promedio_notas: (Math.random() * 5 + 10).toFixed(1),
                cursos_aprobados: Math.floor(Math.random() * 15 + 5),
                cursos_desaprobados: Math.floor(Math.random() * 3),
                asistencias_total: Math.floor(Math.random() * 40 + 20),
                faltas_totales: Math.floor(Math.random() * 10)
            },
            recomendaciones: [
                'Reforzar temas de Cálculo I con ejercicios prácticos',
                'Participar en tutorías grupales los días martes',
                'Establecer horario de estudio de 2 horas diarias',
                'Unirse al grupo de estudio de la carrera',
                'Revisar material complementario en la biblioteca virtual'
            ],
            fecha_prediccion: new Date().toISOString()
        };

        res.json({ success: true, data: prediccion });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.analizarEstudiante = async (req, res) => {
    try {
        const { estudiante_id, data } = req.body;
        
        const analisis = {
            estudiante_id,
            estado_actual: 'En seguimiento',
            puntos_fuertes: ['Lógica matemática', 'Comprensión lectora'],
            areas_mejora: ['Física', 'Expresión oral'],
            recomendaciones: [
                'Tomar curso de física básica',
                'Participar en talleres de oratoria',
                'Practicar ejercicios de razonamiento matemático'
            ],
            nivel_potencial: 'Alto'
        };

        res.json({ success: true, data: analisis });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.detectarTalento = async (req, res) => {
    try {
        const { estudianteId } = req.params;
        
        const talentos = [
            {
                area: 'Programación',
                nivel: 'Destacado',
                evidencias: ['Proyectos en Python', 'Lógica algorítmica avanzada'],
                recomendaciones: [
                    'Participar en hackathons nacionales',
                    'Contribuir a proyectos open source',
                    'Aplicar a becas de tecnología'
                ]
            },
            {
                area: 'Matemáticas',
                nivel: 'Sobresaliente',
                evidencias: ['Promedio 18 en cálculo', 'Participación en olimpiadas'],
                recomendaciones: [
                    'Unirse al club de matemáticas',
                    'Participar en concursos internacionales',
                    'Asistir a seminarios de investigación'
                ]
            }
        ];

        const resumen = {
            estudiante_id: estudianteId,
            talentos_detectados: talentos,
            potencial_general: 'Excepcional',
            areas_recomendadas: ['Ingeniería de Software', 'Ciencia de Datos'],
            recomendaciones_generales: [
                'Postular a programas de intercambio internacional',
                'Aplicar a becas de investigación',
                'Participar en proyectos de innovación tecnológica',
                'Desarrollar portafolio de proyectos'
            ]
        };

        res.json({ success: true, data: resumen });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};