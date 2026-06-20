// backend/controllers/tutor.controller.js
const respuestasIA = {
    matematicas: [
        'Para dominar matemáticas, te recomiendo practicar 30 minutos diarios. ¿Qué tema específico te gustaría repasar?',
        'Las derivadas son fundamentales. Te sugiero empezar con ejercicios de derivación básica y luego avanzar a aplicaciones.',
        '¡Excelente! Las integrales tienen muchas aplicaciones. ¿Quieres practicar con ejercicios de integración por partes?'
    ],
    programacion: [
        'La programación se aprende haciendo. Te recomiendo resolver problemas en plataformas como HackerRank o LeetCode.',
        'Para Python, es clave dominar listas y diccionarios. ¿Has practicado con ejercicios de manipulación de datos?',
        'Buen tema. La programación orientada a objetos es fundamental. Te recomiendo crear pequeñas clases para practicar.'
    ],
    fisica: [
        'En física, la comprensión conceptual es más importante que las fórmulas. ¿Qué fenómeno te gustaría entender mejor?',
        'La cinemática es la base. Practica con problemas de movimiento rectilíneo uniforme y variado.',
        'La dinámica y las leyes de Newton son esenciales. Te sugiero hacer ejercicios de diagramas de cuerpo libre.'
    ],
    comunicacion: [
        'La comunicación efectiva se mejora practicando. Te recomiendo escribir resúmenes de tus clases.',
        'La estructura de un texto argumentativo es clave: tesis, argumentos y conclusión.',
        'Para mejorar tu expresión oral, practica explicando temas complejos en voz alta.'
    ],
    default: [
        'Entiendo tu consulta. Te recomiendo revisar los conceptos básicos y practicar con ejercicios. ¿Quieres que profundice en algún tema?',
        'Buena pregunta. Te sugiero buscar ejemplos prácticos y aplicaciones reales de este tema.',
        'Interesante punto. Podemos abordarlo desde varios ángulos. ¿Qué enfoque prefieres?'
    ]
};

exports.preguntar = async (req, res) => {
    try {
        const { pregunta, curso, estudiante_id } = req.body;
        
        if (!pregunta) {
            return res.status(400).json({ 
                success: false, 
                error: 'La pregunta es requerida' 
            });
        }

        // Determinar el área del curso
        let area = 'default';
        const cursoLower = (curso || '').toLowerCase();
        if (cursoLower.includes('matem') || cursoLower.includes('calculo') || cursoLower.includes('algebra')) {
            area = 'matematicas';
        } else if (cursoLower.includes('progra') || cursoLower.includes('java') || cursoLower.includes('python')) {
            area = 'programacion';
        } else if (cursoLower.includes('fisica') || cursoLower.includes('mecanica')) {
            area = 'fisica';
        } else if (cursoLower.includes('comunica') || cursoLower.includes('redaccion') || cursoLower.includes('escritura')) {
            area = 'comunicacion';
        }

        // Seleccionar respuesta aleatoria
        const respuestas = respuestasIA[area] || respuestasIA.default;
        const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];

        // Guardar interacción (simulado)
        const interaccion = {
            id: Math.floor(Math.random() * 10000),
            estudiante_id,
            pregunta,
            respuesta,
            curso,
            fecha: new Date().toISOString()
        };

        res.json({
            success: true,
            data: {
                respuesta,
                pregunta_original: pregunta,
                curso: curso || 'General',
                area_detectada: area,
                timestamp: new Date().toISOString(),
                id_interaccion: interaccion.id
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getHistorial = async (req, res) => {
    try {
        const { estudianteId } = req.params;
        
        const historial = [
            { pregunta: '¿Cómo resuelvo derivadas?', respuesta: 'Las derivadas se resuelven aplicando reglas...', fecha: '2024-10-15' },
            { pregunta: '¿Qué es un array en Python?', respuesta: 'Un array es una estructura de datos...', fecha: '2024-10-14' },
            { pregunta: '¿Cómo estudiar para Física?', respuesta: 'Te recomiendo practicar ejercicios...', fecha: '2024-10-13' }
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
            { titulo: 'Curso de Derivadas - Nivel Básico', url: '#', duracion: '2 horas' },
            { titulo: 'Introducción a la Programación', url: '#', duracion: '4 horas' },
            { titulo: 'Física: Leyes de Newton', url: '#', duracion: '3 horas' },
            { titulo: 'Redacción Académica', url: '#', duracion: '2 horas' }
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