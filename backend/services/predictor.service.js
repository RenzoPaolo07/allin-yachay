// backend/services/predictor.service.js
class PredictorService {
    constructor() {
        this.modelos = {
            riesgo: this._modeloRiesgo,
            rendimiento: this._modeloRendimiento,
            desercion: this._modeloDesercion
        };
    }

    // Predecir riesgo de abandono
    async predecirRiesgo(estudiante) {
        try {
            const factores = {
                academico: this._calcularFactorAcademico(estudiante),
                asistencia: this._calcularFactorAsistencia(estudiante),
                emocional: this._calcularFactorEmocional(estudiante),
                socioeconomico: this._calcularFactorSocioeconomico(estudiante)
            };

            const riesgo = this._calcularRiesgo(factores);
            const nivel = this._determinarNivelRiesgo(riesgo);
            const recomendaciones = this._generarRecomendaciones(factores, nivel);

            return {
                estudiante_id: estudiante.id,
                nivel_riesgo: nivel,
                probabilidad: riesgo,
                factores: factores,
                recomendaciones: recomendaciones,
                fecha_prediccion: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error prediciendo riesgo:', error);
            throw error;
        }
    }

    _calcularFactorAcademico(estudiante) {
        const promedio = estudiante.promedio || 14;
        const creditos = estudiante.creditos_aprobados || 0;
        const totalCreditos = estudiante.creditos_totales || 200;

        let puntuacion = 50;
        if (promedio > 16) puntuacion += 20;
        else if (promedio > 14) puntuacion += 10;
        else if (promedio > 12) puntuacion -= 10;
        else puntuacion -= 20;

        if (creditos / totalCreditos > 0.5) puntuacion += 10;
        else puntuacion -= 10;

        return Math.min(100, Math.max(0, puntuacion));
    }

    _calcularFactorAsistencia(estudiante) {
        const asistencia = estudiante.asistencia || 85;
        let puntuacion = 50;
        if (asistencia > 90) puntuacion += 20;
        else if (asistencia > 80) puntuacion += 10;
        else if (asistencia > 70) puntuacion -= 10;
        else puntuacion -= 20;
        return Math.min(100, Math.max(0, puntuacion));
    }

    _calcularFactorEmocional(estudiante) {
        const motivacion = estudiante.motivacion || 50;
        let puntuacion = 50;
        if (motivacion > 70) puntuacion += 20;
        else if (motivacion > 50) puntuacion += 10;
        else if (motivacion > 30) puntuacion -= 10;
        else puntuacion -= 20;
        return Math.min(100, Math.max(0, puntuacion));
    }

    _calcularFactorSocioeconomico(estudiante) {
        let puntuacion = 50;
        if (estudiante.trabaja) puntuacion -= 10;
        if (!estudiante.apoyo_familiar) puntuacion -= 10;
        if (estudiante.distancia_casa > 2) puntuacion -= 5;
        return Math.min(100, Math.max(0, puntuacion));
    }

    _calcularRiesgo(factores) {
        const pesos = {
            academico: 0.35,
            asistencia: 0.25,
            emocional: 0.25,
            socioeconomico: 0.15
        };

        const riesgo = Object.entries(factores).reduce((sum, [key, value]) => {
            return sum + (100 - value) * pesos[key];
        }, 0);

        return Math.min(95, Math.max(5, riesgo));
    }

    _determinarNivelRiesgo(riesgo) {
        if (riesgo < 25) return 'Bajo';
        if (riesgo < 50) return 'Medio';
        if (riesgo < 75) return 'Alto';
        return 'Crítico';
    }

    _generarRecomendaciones(factores, nivel) {
        const recomendaciones = [];

        if (factores.academico < 50) {
            recomendaciones.push({
                area: 'Académico',
                mensaje: 'Rendimiento académico bajo',
                acciones: ['Reforzar áreas críticas', 'Buscar tutorías', 'Participar en grupos de estudio']
            });
        }

        if (factores.asistencia < 50) {
            recomendaciones.push({
                area: 'Asistencia',
                mensaje: 'Baja asistencia a clases',
                acciones: ['Identificar causas de inasistencia', 'Implementar sistema de seguimiento']
            });
        }

        if (factores.emocional < 50) {
            recomendaciones.push({
                area: 'Emocional',
                mensaje: 'Posible desmotivación',
                acciones: ['Apoyo psicológico', 'Actividades motivacionales', 'Talleres de bienestar']
            });
        }

        if (factores.socioeconomico < 50) {
            recomendaciones.push({
                area: 'Socioeconómico',
                mensaje: 'Dificultades económicas',
                acciones: ['Informar sobre becas', 'Programas de apoyo', 'Empleo estudiantil']
            });
        }

        return recomendaciones;
    }

    // Predecir rendimiento futuro
    async predecirRendimiento(estudianteId, datos) {
        try {
            const historial = datos.historial || [];
            const promedio = datos.promedio || 14;
            const tendencia = this._calcularTendencia(historial);
            
            let prediccion = promedio;
            if (tendencia > 0) prediccion += 1.5;
            else if (tendencia < 0) prediccion -= 1.5;

            const probabilidadAprobar = this._calcularProbabilidadAprobar(prediccion);

            return {
                estudiante_id: estudianteId,
                promedio_actual: promedio,
                prediccion_promedio: Math.min(20, Math.max(0, prediccion)),
                tendencia: tendencia,
                probabilidad_aprobar: probabilidadAprobar,
                fecha_prediccion: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error prediciendo rendimiento:', error);
            throw error;
        }
    }

    _calcularTendencia(historial) {
        if (!historial || historial.length < 2) return 0;
        const cambios = [];
        for (let i = 1; i < historial.length; i++) {
            cambios.push(historial[i] - historial[i-1]);
        }
        return cambios.reduce((sum, c) => sum + c, 0) / cambios.length;
    }

    _calcularProbabilidadAprobar(prediccion) {
        if (prediccion >= 14) return 85 + (prediccion - 14) * 5;
        if (prediccion >= 11) return 50 + (prediccion - 11) * 10;
        return 20 + (prediccion / 11) * 30;
    }
}

module.exports = new PredictorService();