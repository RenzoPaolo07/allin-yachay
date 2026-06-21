// backend/services/gemini.service.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
        this.modoSimulacion = true;
        this.model = null;
        this.inicializado = false;
        
        console.log('🔍 Inicializando Gemini Service...');
        console.log(`📌 API Key: ${this.apiKey ? 'Configurada ✅' : 'No configurada ❌'}`);
        console.log(`📌 Modelo solicitado: ${this.modelName}`);

        if (!this.apiKey || this.apiKey === 'TU_API_KEY_AQUI') {
            console.warn('⚠️ API Key no configurada. Usando modo simulación.');
            return;
        }

        // Iniciar inicialización asíncrona
        this.inicializar();
    }

    // ============ INICIALIZACIÓN ASÍNCRONA ============
    async inicializar() {
        try {
            this.genAI = new GoogleGenerativeAI(this.apiKey);
            
            // Lista de modelos para probar (del más nuevo al más antiguo)
            const modelosPosibles = [
                'gemini-3.5-flash',      // NUEVO
                'gemini-3.0-flash',      // NUEVO
                'gemini-2.5-flash',      // NUEVO
                'gemini-2.0-flash',
                'gemini-2.0-flash-lite',
                'gemini-1.5-flash',
                'gemini-1.5-flash-8b',
                'gemini-pro'
            ];
            
            // Intentar con el modelo especificado primero
            let modeloEncontrado = await this._probarModelo(this.modelName);
            
            if (!modeloEncontrado) {
                console.log('🔄 Intentando con modelos alternativos...');
                for (const modelo of modelosPosibles) {
                    if (modelo === this.modelName) continue;
                    modeloEncontrado = await this._probarModelo(modelo);
                    if (modeloEncontrado) {
                        this.modelName = modelo;
                        break;
                    }
                }
            }
            
            if (modeloEncontrado) {
                this.modoSimulacion = false;
                this.inicializado = true;
                console.log(`✅ Gemini inicializado correctamente con modelo: ${this.modelName}`);
                console.log('🤖 Modelo listo para usar');
            } else {
                console.warn('⚠️ No se encontró ningún modelo disponible. Usando modo simulación.');
                this.modoSimulacion = true;
            }
        } catch (error) {
            console.error('❌ Error inicializando Gemini:', error.message);
            this.modoSimulacion = true;
        }
    }

    // ============ PROBAR UN MODELO ============
    async _probarModelo(modelName) {
        try {
            console.log(`🔍 Probando modelo: ${modelName}...`);
            const testModel = this.genAI.getGenerativeModel({ 
                model: modelName,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 50,
                }
            });
            // Probar el modelo con una consulta simple
            const testResult = await testModel.generateContent('Hola');
            await testResult.response;
            this.model = testModel;
            console.log(`✅ Modelo ${modelName} disponible`);
            return true;
        } catch (error) {
            // Si el error es 429 (quota), no intentar más modelos
            if (error.message.includes('429')) {
                console.log(`⚠️ Cuota excedida para ${modelName}, esperando...`);
                return false;
            }
            console.log(`❌ Modelo ${modelName} no disponible: ${error.message}`);
            return false;
        }
    }

    // ============ CHAT DEL TUTOR IA ============
    async chatTutor(mensaje, contexto = {}) {
        console.log(`📨 Mensaje: "${mensaje.substring(0, 50)}..."`);
        
        // Esperar a que termine la inicialización si está en proceso
        if (!this.inicializado && !this.modoSimulacion) {
            console.log('⏳ Esperando inicialización de Gemini...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            if (!this.inicializado) {
                console.log('⚠️ Gemini no inicializado, usando simulación');
                return this._simularRespuesta(mensaje);
            }
        }
        
        if (this.modoSimulacion || !this.model) {
            console.log('⚠️ Usando modo simulación');
            return this._simularRespuesta(mensaje);
        }

        try {
            const { estudiante, curso, idioma } = contexto;
            
            // Construir prompt
            let prompt = `Eres un tutor académico experto y amigable llamado "ALLIN YACHAY" (que significa "Buen Conocimiento" en quechua). 
                        Tu misión es ayudar a estudiantes peruanos a no abandonar sus estudios.
                        Responde en ${idioma || 'español'} de forma clara, didáctica y con ejemplos prácticos.
                        Si el estudiante pregunta algo que no sabes, admítelo y sugiere dónde buscar información.
                        Sé cálido, motivador y usa un lenguaje cercano.`;

            if (estudiante) {
                prompt += `\n\nEstás ayudando a ${estudiante.nombre || 'un estudiante'}.`;
                if (estudiante.carrera) prompt += ` Estudia ${estudiante.carrera}.`;
                if (estudiante.semestre) prompt += ` Está en ${estudiante.semestre}° semestre.`;
                if (estudiante.promedio) prompt += ` Su promedio actual es ${estudiante.promedio}.`;
            }

            if (curso) {
                prompt += `\n\nEl tema de la consulta es: ${curso}.`;
            }

            prompt += `\n\n📝 Pregunta del estudiante: ${mensaje}\n\n💡 Respuesta del tutor:`;

            console.log(`🔄 Enviando consulta a Gemini (${this.modelName})...`);
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const texto = response.text();

            console.log(`✅ Respuesta recibida de Gemini (${this.modelName})`);

            return {
                exito: true,
                respuesta: texto,
                mensaje_original: mensaje,
                contexto: contexto,
                timestamp: new Date().toISOString(),
                modo: 'gemini',
                modelo: this.modelName
            };

        } catch (error) {
            console.error('❌ Error en Gemini:', error.message);
            
            // Si es error de cuota, esperar y reintentar
            if (error.message.includes('429')) {
                console.log('⏳ Cuota excedida, esperando 60 segundos...');
                await new Promise(resolve => setTimeout(resolve, 60000));
                try {
                    const result = await this.model.generateContent(
                        `Eres un tutor académico. Responde en español: ${mensaje}`
                    );
                    const response = await result.response;
                    return {
                        exito: true,
                        respuesta: response.text(),
                        mensaje_original: mensaje,
                        modo: 'gemini-retry',
                        modelo: this.modelName
                    };
                } catch (retryError) {
                    console.error('❌ Reintento falló:', retryError.message);
                }
            }
            
            return {
                exito: false,
                error: error.message,
                respuesta: this._simularRespuesta(mensaje).respuesta,
                modo: 'fallback'
            };
        }
    }

    // ============ MÉTODOS DE SIMULACIÓN ============
    _simularRespuesta(mensaje) {
        const respuestas = [
            '¡Excelente pregunta! Te recomiendo empezar por los fundamentos. ¿Has revisado los conceptos básicos de este tema?',
            'Entiendo tu consulta. Te sugiero practicar con ejercicios similares para reforzar el aprendizaje. ¿Quieres que te proponga algunos?',
            'Buena pregunta. La clave está en entender la relación entre estos conceptos. ¿Te gustaría que te explique cómo se conectan?',
            'Interesante punto. Podemos abordarlo desde varios ángulos. ¿Qué enfoque prefieres que use para explicarte?',
            'Para entender esto mejor, te recomiendo ver ejemplos prácticos. ¿Tienes algún caso concreto en mente?',
            '¡Qué buena consulta! Te sugiero consultar los recursos adicionales en nuestra plataforma. ¿Necesitas ayuda con algún tema específico?',
            'Entiendo lo que preguntas. Este es un tema importante en tu carrera. ¿Quieres que profundice en algún aspecto particular?'
        ];
        
        return {
            exito: true,
            respuesta: respuestas[Math.floor(Math.random() * respuestas.length)],
            mensaje_original: mensaje,
            simulacion: true,
            modo: 'simulado'
        };
    }

    // ============ OTROS MÉTODOS ============
    async predecirRiesgo(datosEstudiante) {
        if (this.modoSimulacion || !this.model) return this._simularPrediccion(datosEstudiante);
        try {
            const prompt = `Analiza estos datos y predice riesgo de abandono: ${JSON.stringify(datosEstudiante)}. Responde en JSON: {nivel_riesgo, probabilidad_abandono, factores, recomendaciones}`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const texto = response.text();
            const jsonMatch = texto.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return { exito: true, ...JSON.parse(jsonMatch[0]) };
            }
            return this._simularPrediccion(datosEstudiante);
        } catch (error) {
            return this._simularPrediccion(datosEstudiante);
        }
    }

    _simularPrediccion(datos) {
        const niveles = ['Bajo', 'Medio', 'Alto'];
        return {
            exito: true,
            nivel_riesgo: niveles[Math.floor(Math.random() * 3)],
            probabilidad_abandono: Math.floor(Math.random() * 40 + 10),
            factores: ['Rendimiento académico', 'Asistencia', 'Motivación'],
            recomendaciones: ['Reforzar estudio', 'Participar en tutorías', 'Buscar apoyo']
        };
    }

    async detectarTalento(datosEstudiante) {
        if (this.modoSimulacion || !this.model) return this._simularTalento(datosEstudiante);
        try {
            const prompt = `Detecta talentos en: ${JSON.stringify(datosEstudiante)}. Responde en JSON: {talentos: [{tipo, nivel, puntuacion, habilidades, recomendaciones}], potencial_general, recomendaciones}`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const texto = response.text();
            const jsonMatch = texto.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return { exito: true, ...JSON.parse(jsonMatch[0]) };
            }
            return this._simularTalento(datosEstudiante);
        } catch (error) {
            return this._simularTalento(datosEstudiante);
        }
    }

    _simularTalento(datos) {
        return {
            exito: true,
            talentos: [{
                tipo: 'investigador',
                nivel: 'Destacado',
                puntuacion: 85,
                habilidades: ['Análisis crítico', 'Pensamiento lógico'],
                recomendaciones: ['Postular a becas', 'Participar en congresos']
            }],
            potencial_general: 'Alto',
            recomendaciones: ['Explorar áreas de interés', 'Desarrollar habilidades blandas']
        };
    }

    async traducirContenido(texto, idiomaDestino) {
        if (this.modoSimulacion || !this.model) return this._simularTraduccion(texto, idiomaDestino);
        try {
            const idiomas = { 'qu': 'Quechua', 'ay': 'Aymara', 'as': 'Asháninka' };
            const prompt = `Traduce al ${idiomas[idiomaDestino] || idiomaDestino}: "${texto}"`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return {
                exito: true,
                texto_original: texto,
                texto_traducido: response.text(),
                idioma_destino: idiomaDestino
            };
        } catch (error) {
            return this._simularTraduccion(texto, idiomaDestino);
        }
    }

    _simularTraduccion(texto, idioma) {
        const traducciones = {
            'qu': `(Quechua) ${texto}`,
            'ay': `(Aymara) ${texto}`,
            'as': `(Asháninka) ${texto}`
        };
        return {
            exito: true,
            texto_original: texto,
            texto_traducido: traducciones[idioma] || texto,
            idioma_destino: idioma
        };
    }

    async simularEscenario(estudiante, escenario) {
        if (this.modoSimulacion || !this.model) return this._simularEscenario(estudiante, escenario);
        try {
            const prompt = `Simula: ${escenario.descripcion} para estudiante con promedio ${estudiante.promedio || 14}. Responde en JSON: {nuevo_promedio, nuevos_creditos, probabilidad_graduacion, nueva_fecha_estimada, recomendaciones}`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const texto = response.text();
            const jsonMatch = texto.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return { exito: true, ...JSON.parse(jsonMatch[0]) };
            }
            return this._simularEscenario(estudiante, escenario);
        } catch (error) {
            return this._simularEscenario(estudiante, escenario);
        }
    }

    _simularEscenario(estudiante, escenario) {
        return {
            exito: true,
            nuevo_promedio: (estudiante.promedio || 14) + (Math.random() * 2 - 0.5),
            nuevos_creditos: (estudiante.creditos_aprobados || 0) + 5,
            probabilidad_graduacion: Math.floor(Math.random() * 30 + 60),
            nueva_fecha_estimada: '2028-06',
            recomendaciones: ['Mantener ritmo de estudio', 'Participar en tutorías']
        };
    }

    async detectarCrisis(estudiantes) {
        if (this.modoSimulacion || !this.model) return this._simularCrisis(estudiantes);
        try {
            const prompt = `Detecta crisis en: ${JSON.stringify(estudiantes)}. Responde en JSON: {crisis_detectadas, metricas, recomendaciones_generales}`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const texto = response.text();
            const jsonMatch = texto.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return this._simularCrisis(estudiantes);
        } catch (error) {
            return this._simularCrisis(estudiantes);
        }
    }

    _simularCrisis(estudiantes) {
        return {
            crisis_detectadas: [{
                tipo: 'Académica',
                nivel: 'Alerta',
                descripcion: 'Bajo rendimiento general detectado',
                estudiantes_afectados: estudiantes.slice(0, 3).map(e => e.id),
                recomendacion: 'Implementar programa de refuerzo'
            }],
            metricas: {
                total_estudiantes: estudiantes.length,
                en_riesgo: Math.floor(estudiantes.length * 0.3),
                estres_alto: Math.floor(estudiantes.length * 0.15)
            },
            recomendaciones_generales: ['Evaluar factores de riesgo', 'Implementar programa de bienestar']
        };
    }
}

module.exports = new GeminiService();