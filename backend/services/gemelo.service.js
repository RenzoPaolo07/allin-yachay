// backend/services/gemelo.service.js
const GemeloDigital = require('../models/GemeloDigital');

class GemeloDigitalService {
    // Crear gemelo digital de un estudiante
    async crearGemelo(estudianteId, datos) {
        try {
            const gemelo = await GemeloDigital.create({
                estudiante_id: estudianteId,
                nombre: datos.nombre || 'Estudiante',
                fecha_creacion: new Date(),
                ultima_actualizacion: new Date(),
                promedio_actual: datos.promedio_actual || 14,
                creditos_aprobados: datos.creditos_aprobados || 0,
                creditos_totales: datos.creditos_totales || 200,
                semestre_actual: datos.semestre_actual || 1,
                semestres_totales: datos.semestres_totales || 10,
                probabilidad_graduacion: 85,
                fecha_estimada_graduacion: new Date(new Date().setFullYear(new Date().getFullYear() + 4)),
                escenarios: [],
                factores_riesgo: ['Poco tiempo de estudio'],
                fortalezas: ['Lógica matemática', 'Comprensión lectora'],
                debilidades: ['Física', 'Expresión oral'],
                recomendaciones: []
            });
            return gemelo;
        } catch (error) {
            console.error('Error creando gemelo:', error);
            throw error;
        }
    }

    // Simular escenarios
    async simularEscenario(estudianteId, escenario) {
        try {
            const gemelo = await GemeloDigital.findOne({ 
                where: { estudiante_id: estudianteId } 
            });
            
            if (!gemelo) {
                throw new Error('Gemelo no encontrado');
            }

            // Crear simulación basada en el escenario
            const simulacion = {
                fecha: new Date(),
                escenario: escenario,
                resultados: this._calcularResultados(gemelo, escenario)
            };

            // Actualizar el gemelo
            const escenariosActuales = gemelo.escenarios || [];
            escenariosActuales.push(simulacion);
            
            await gemelo.update({
                escenarios: escenariosActuales,
                ultima_actualizacion: new Date()
            });

            return {
                ...simulacion,
                recomendaciones: this._generarRecomendaciones(gemelo, simulacion.resultados)
            };
        } catch (error) {
            console.error('Error simulando escenario:', error);
            throw error;
        }
    }

    // Calcular resultados de la simulación
    _calcularResultados(gemelo, escenario) {
        const base = parseFloat(gemelo.promedio_actual) || 14;
        const creditos = parseInt(gemelo.creditos_aprobados) || 0;
        const totalCreditos = parseInt(gemelo.creditos_totales) || 200;
        
        let nuevoPromedio = base;
        let nuevosCreditos = creditos;
        let nuevaProbabilidad = parseFloat(gemelo.probabilidad_graduacion) || 85;
        let nuevaFecha = new Date(gemelo.fecha_estimada_graduacion);

        switch(escenario.tipo) {
            case 'mas_estudio':
                nuevoPromedio = Math.min(20, base + 2.5);
                nuevosCreditos = Math.min(totalCreditos, creditos + (escenario.horas || 2) * 2);
                nuevaProbabilidad = Math.min(98, nuevaProbabilidad + 8);
                break;
            case 'menos_estudio':
                nuevoPromedio = Math.max(0, base - 2);
                nuevosCreditos = Math.max(0, creditos - (escenario.horas || 2) * 1);
                nuevaProbabilidad = Math.max(10, nuevaProbabilidad - 12);
                nuevaFecha.setFullYear(nuevaFecha.getFullYear() + 1);
                break;
            case 'tutorias':
                nuevoPromedio = Math.min(20, base + 1.5);
                nuevaProbabilidad = Math.min(95, nuevaProbabilidad + 5);
                break;
            case 'reprobar':
                nuevoPromedio = Math.max(0, base - 3);
                nuevosCreditos = Math.max(0, creditos - 3);
                nuevaProbabilidad = Math.max(15, nuevaProbabilidad - 15);
                nuevaFecha.setFullYear(nuevaFecha.getFullYear() + 1);
                break;
            case 'beca':
                nuevaProbabilidad = Math.min(99, nuevaProbabilidad + 10);
                break;
            default:
                nuevoPromedio = base + (Math.random() - 0.5) * 2;
                nuevaProbabilidad = Math.min(98, Math.max(10, nuevaProbabilidad + (Math.random() - 0.5) * 5));
        }

        return {
            promedio: parseFloat(nuevoPromedio.toFixed(2)),
            creditos_aprobados: Math.min(totalCreditos, nuevosCreditos),
            probabilidad_graduacion: parseFloat(nuevaProbabilidad.toFixed(2)),
            fecha_estimada: nuevaFecha,
            porcentaje_avance: parseFloat(((nuevosCreditos / totalCreditos) * 100).toFixed(1))
        };
    }

    // Generar recomendaciones
    _generarRecomendaciones(gemelo, resultados) {
        const recomendaciones = [];
        
        if (resultados.promedio < 12) {
            recomendaciones.push({
                area: 'Rendimiento',
                mensaje: 'Tu promedio está por debajo de lo esperado. Te recomendamos reforzar con tutorías.'
            });
        }

        if (resultados.probabilidad_graduacion < 60) {
            recomendaciones.push({
                area: 'Graduación',
                mensaje: 'Alto riesgo de no graduarte a tiempo. Considera reducir tu carga académica o buscar apoyo.'
            });
        }

        if (resultados.porcentaje_avance < 30) {
            recomendaciones.push({
                area: 'Avance',
                mensaje: 'Llevas poco avance en tu carrera. Te sugerimos revisar tu plan de estudios.'
            });
        }

        if (recomendaciones.length === 0) {
            recomendaciones.push({
                area: 'Éxito',
                mensaje: '¡Vas por buen camino! Sigue así para alcanzar tus metas académicas.'
            });
        }

        return recomendaciones;
    }

    // Obtener gemelo por estudiante
    async obtenerGemelo(estudianteId) {
        try {
            const gemelo = await GemeloDigital.findOne({
                where: { estudiante_id: estudianteId }
            });

            if (!gemelo) {
                // Crear gemelo por defecto
                return await this.crearGemelo(estudianteId, {
                    nombre: 'Estudiante',
                    promedio_actual: 14,
                    semestre_actual: 1
                });
            }

            return gemelo;
        } catch (error) {
            console.error('Error obteniendo gemelo:', error);
            throw error;
        }
    }
}

module.exports = new GemeloDigitalService();