// backend/services/crisis.service.js
class CrisisService {
    constructor() {
        this.umbrales = {
            estres: 65,
            desercion: 40,
            academico: 12,
            asistencia: 60
        };

        this.nivelesCrisis = ['Normal', 'Alerta', 'Crítico', 'Emergencia'];
    }

    // Detectar crisis educativas en una población
    async detectarCrisis(estudiantes, config) {
        try {
            const analisis = [];
            const alertas = [];
            const metricas = {
                total_estudiantes: estudiantes.length,
                en_riesgo: 0,
                estres_alto: 0,
                desercion_posible: 0,
                crisis_detectadas: []
            };

            for (const estudiante of estudiantes) {
                const analisisIndividual = this._analizarEstudiante(estudiante);
                analisis.push(analisisIndividual);

                // Actualizar métricas
                if (analisisIndividual.nivel_crisis !== 'Normal') {
                    metricas.en_riesgo++;
                }
                if (analisisIndividual.estres > 70) {
                    metricas.estres_alto++;
                }
                if (analisisIndividual.probabilidad_desercion > 60) {
                    metricas.desercion_posible++;
                }

                // Generar alertas si es necesario
                if (analisisIndividual.nivel_crisis === 'Crítico' || analisisIndividual.nivel_crisis === 'Emergencia') {
                    alertas.push({
                        estudiante_id: estudiante.id,
                        nivel: analisisIndividual.nivel_crisis,
                        motivo: analisisIndividual.motivos_principales,
                        recomendacion: analisisIndividual.recomendaciones
                    });
                }
            }

            // Detectar crisis a nivel de grupo
            const crisisGrupo = this._detectarCrisisGrupo(analisis);

            return {
                analisis_individual: analisis,
                alertas: alertas,
                metricas: metricas,
                crisis_grupo: crisisGrupo,
                recomendaciones_generales: this._generarRecomendacionesGenerales(metricas),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error detectando crisis:', error);
            throw error;
        }
    }

    // Analizar estudiante individual
    _analizarEstudiante(estudiante) {
        // Simular análisis basado en datos
        const estres = this._simularEstres(estudiante);
        const desercion = this._simularDesercion(estudiante);
        const academico = estudiante.promedio || 14;
        const asistencia = estudiante.asistencia || 85;

        let nivel_crisis = 'Normal';
        const motivos = [];
        const recomendaciones = [];

        // Evaluar factores
        if (estres > 80) {
            nivel_crisis = 'Emergencia';
            motivos.push('Nivel crítico de estrés');
            recomendaciones.push('Derivar a apoyo psicológico urgente');
        } else if (estres > 65) {
            if (nivel_crisis === 'Normal') nivel_crisis = 'Alerta';
            motivos.push('Alto nivel de estrés');
            recomendaciones.push('Recomendar técnicas de manejo de estrés');
        }

        if (desercion > 70) {
            nivel_crisis = 'Crítico';
            motivos.push('Alta probabilidad de deserción');
            recomendaciones.push('Intervención inmediata con tutoría personalizada');
        } else if (desercion > 50) {
            if (nivel_crisis === 'Normal') nivel_crisis = 'Alerta';
            motivos.push('Riesgo moderado de deserción');
            recomendaciones.push('Programa de seguimiento académico');
        }

        if (academico < 12) {
            motivos.push('Rendimiento académico bajo');
            recomendaciones.push('Refuerzo académico en áreas críticas');
        }

        if (asistencia < 60) {
            motivos.push('Baja asistencia a clases');
            recomendaciones.push('Investigar causas de inasistencia');
        }

        return {
            estudiante_id: estudiante.id,
            nivel_crisis: nivel_crisis,
            estres: Math.round(estres),
            probabilidad_desercion: Math.round(desercion),
            promedio: academico,
            asistencia: asistencia,
            motivos_principales: motivos.slice(0, 3),
            recomendaciones: recomendaciones.slice(0, 3)
        };
    }

    // Simular nivel de estrés
    _simularEstres(estudiante) {
        const base = 30;
        const variacion = Math.random() * 50;
        
        // Factores que aumentan estrés
        if (estudiante.promedio && estudiante.promedio < 13) variacion += 10;
        if (estudiante.carga_horaria && estudiante.carga_horaria > 25) variacion += 8;
        if (estudiante.trabaja) variacion += 12;
        if (estudiante.distancia_casa > 2) variacion += 5;

        return Math.min(100, base + variacion);
    }

    // Simular probabilidad de deserción
    _simularDesercion(estudiante) {
        const base = 10;
        const variacion = Math.random() * 40;
        
        if (estudiante.promedio && estudiante.promedio < 11) variacion += 20;
        if (estudiante.asistencia && estudiante.asistencia < 50) variacion += 15;
        if (estudiante.motivacion && estudiante.motivacion < 3) variacion += 10;
        if (estudiante.apoyo_familiar === false) variacion += 10;

        return Math.min(95, base + variacion);
    }

    // Detectar crisis a nivel de grupo
    _detectarCrisisGrupo(analisis) {
        const total = analisis.length;
        const crisis = [];

        // Detectar crisis académica
        const academicosBajos = analisis.filter(a => a.promedio < 12).length;
        if (academicosBajos > total * 0.3) {
            crisis.push({
                tipo: 'Académica',
                nivel: academicosBajos > total * 0.5 ? 'Crítico' : 'Alerta',
                descripcion: `${Math.round((academicosBajos/total)*100)}% de estudiantes con bajo rendimiento`,
                estudiantes_afectados: academicosBajos
            });
        }

        // Detectar crisis de estrés
        const estresAlto = analisis.filter(a => a.estres > 70).length;
        if (estresAlto > total * 0.2) {
            crisis.push({
                tipo: 'Estrés',
                nivel: estresAlto > total * 0.35 ? 'Crítico' : 'Alerta',
                descripcion: `${Math.round((estresAlto/total)*100)}% de estudiantes con alto estrés`,
                estudiantes_afectados: estresAlto
            });
        }

        // Detectar crisis de deserción
        const desercionAlta = analisis.filter(a => a.probabilidad_desercion > 60).length;
        if (desercionAlta > total * 0.15) {
            crisis.push({
                tipo: 'Deserción',
                nivel: desercionAlta > total * 0.25 ? 'Crítico' : 'Alerta',
                descripcion: `${Math.round((desercionAlta/total)*100)}% de estudiantes en riesgo de deserción`,
                estudiantes_afectados: desercionAlta
            });
        }

        return crisis;
    }

    // Generar recomendaciones generales
    _generarRecomendacionesGenerales(metricas) {
        const recomendaciones = [];

        if (metricas.estres_alto > metricas.total_estudiantes * 0.25) {
            recomendaciones.push('Implementar programa de bienestar estudiantil');
        }

        if (metricas.desercion_posible > metricas.total_estudiantes * 0.15) {
            recomendaciones.push('Activar protocolo de retención estudiantil');
        }

        if (metricas.en_riesgo > metricas.total_estudiantes * 0.3) {
            recomendaciones.push('Realizar evaluación institucional de factores de riesgo');
        }

        return recomendaciones;
    }

    // Obtener alertas tempranas (para dashboard)
    async obtenerAlertasTempranas(universidadId) {
        // Simulación de alertas
        return {
            universidad_id: universidadId,
            fecha: new Date().toISOString(),
            alertas: [
                {
                    nivel: 'Alta',
                    tipo: 'Estrés',
                    mensaje: 'Los estudiantes de primer ciclo muestran niveles elevados de estrés',
                    estudiantes_afectados: 45,
                    accion: 'Implementar taller de manejo de estrés'
                },
                {
                    nivel: 'Media',
                    tipo: 'Académica',
                    mensaje: 'Bajo rendimiento en el curso de Cálculo I',
                    estudiantes_afectados: 28,
                    accion: 'Reforzar con tutorías adicionales'
                }
            ],
            recomendaciones: [
                'Crear comité de bienestar estudiantil',
                'Implementar sistema de alerta temprana',
                'Realizar encuestas de clima académico'
            ]
        };
    }
}

module.exports = new CrisisService();