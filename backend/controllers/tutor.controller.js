// backend/controllers/tutor.controller.js
const GeminiService = require('../services/gemini.service');

const respuestasFallback = [
    '¡Excelente pregunta! Te recomiendo empezar por los fundamentos. ¿Has revisado los conceptos básicos de este tema?',
    'Entiendo tu consulta. Te sugiero practicar con ejercicios similares para reforzar el aprendizaje.',
    'Buena pregunta. La clave está en entender la relación entre estos conceptos.',
    'Interesante punto. Podemos abordarlo desde varios ángulos. ¿Qué enfoque prefieres?',
    'Para entender esto mejor, te recomiendo ver ejemplos prácticos.',
    '¡Qué buena consulta! Te sugiero consultar los recursos adicionales en nuestra plataforma.'
];

exports.preguntar = async (req, res) => {
    try {
        const { pregunta, curso, estudiante_id, idioma } = req.body;
        
        if (!pregunta) {
            return res.status(400).json({
                success: false,
                error: 'La pregunta es requerida'
            });
        }

        console.log(`📨 Nueva pregunta: "${pregunta.substring(0, 50)}..."`);
        console.log(`🔧 Gemini disponible: ${GeminiService.modoSimulacion ? 'NO ❌' : 'SÍ ✅'}`);
        console.log(`📌 Modelo actual: ${GeminiService.modelName || 'Ninguno'}`);

        let respuesta;
        let modo = 'fallback';

        if (!GeminiService.modoSimulacion && GeminiService.model) {
            try {
                const estudiante = {
                    id: estudiante_id || 1,
                    nombre: 'Renzo Quispe',
                    carrera: 'Ingeniería de Sistemas',
                    semestre: 5,
                    promedio: 16.5
                };

                const resultado = await GeminiService.chatTutor(pregunta, {
                    estudiante: estudiante,
                    curso: curso || 'general',
                    idioma: idioma || 'es'
                });

                // 🔥 VERIFICAR EXPLÍCITAMENTE LA RESPUESTA
                console.log(`📝 Respuesta RAW de Gemini: "${resultado.respuesta}"`);
                console.log(`📏 Longitud: ${resultado.respuesta?.length || 0} caracteres`);

                if (resultado.exito && resultado.respuesta && resultado.respuesta.length > 5) {
                    // 🔥 FORZAR LA RESPUESTA COMPLETA
                    respuesta = resultado.respuesta;
                    modo = `gemini (${resultado.modelo || GeminiService.modelName})`;
                    console.log(`✅ Respuesta generada con ${modo}`);
                    console.log(`📝 Respuesta completa: "${respuesta.substring(0, 200)}..."`);
                } else {
                    console.log('⚠️ Respuesta inválida de Gemini, usando fallback');
                    respuesta = respuestasFallback[Math.floor(Math.random() * respuestasFallback.length)];
                    modo = 'fallback';
                }
            } catch (error) {
                console.log('⚠️ Error con Gemini, usando fallback:', error.message);
                respuesta = respuestasFallback[Math.floor(Math.random() * respuestasFallback.length)];
                modo = 'fallback';
            }
        } else {
            console.log('⚠️ Gemini no disponible, usando fallback');
            respuesta = respuestasFallback[Math.floor(Math.random() * respuestasFallback.length)];
            modo = 'fallback';
        }

        // 🔥 ASEGURAR QUE LA RESPUESTA SEA COMPLETA
        const respuestaFinal = respuesta || 'Lo siento, no pude generar una respuesta.';
        
        console.log(`📤 Enviando al frontend: "${respuestaFinal.substring(0, 100)}..."`);

        res.json({
            success: true,
            data: {
                respuesta: respuestaFinal,
                pregunta_original: pregunta,
                curso: curso || 'General',
                modo: modo,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Error en tutor:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            data: {
                respuesta: 'Lo siento, hubo un error. Por favor, intenta de nuevo.',
                modo: 'error'
            }
        });
    }
};

exports.getHistorial = async (req, res) => {
    try {
        const { estudianteId } = req.params;
        const historial = [
            { id: 1, pregunta: '¿Cómo resuelvo derivadas?', respuesta: 'Las derivadas se resuelven aplicando reglas de derivación.', fecha: new Date().toISOString(), curso: 'Cálculo I' },
            { id: 2, pregunta: '¿Qué es un array en Python?', respuesta: 'Un array en Python es una estructura que almacena múltiples elementos.', fecha: new Date().toISOString(), curso: 'Programación' }
        ];
        res.json({ success: true, data: historial });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.recomendarCurso = async (req, res) => {
    try {
        const { estudianteId, area_interes } = req.body;
        const recursos = [
            { id: 1, titulo: 'Curso de Derivadas - Nivel Básico', url: '#', duracion: '2 horas', dificultad: 'Básico' },
            { id: 2, titulo: 'Introducción a la Programación con Python', url: '#', duracion: '4 horas', dificultad: 'Intermedio' }
        ];
        res.json({
            success: true,
            data: {
                recomendaciones: recursos,
                mensaje: 'Estos cursos te ayudarán a mejorar en tu área de interés'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};