// backend/services/bienestar.service.js
class BienestarService {
    constructor() {
        this.umbrales = {
            ansiedad: 60,
            depresion: 50,
            motivacion: 40,
            apoyo_social: 30
        };

        this.nivelesBienestar = ['Saludable', 'Riesgo Leve', 'Riesgo Moderado', 'Riesgo Alto'];
        this.recursos = {
            psicologico: [
                'Centro de salud mental universitario',
                'Línea de apoyo psicológico: 0800-123-456',
                'Aplicación de mindfulness gratuita'
            ],
            academico: [
                'Tutorías personalizadas',
                'Grupos de estudio',
                'Talleres de técnicas de estudio'
            ],
            social: [
                'Grupos de apoyo entre pares',
                'Actividades recreativas',
                'Clubes estudiantiles'
            ],
            economico: [
                'Fondo de apoyo económico',
                'Becas de emergencia',
                'Programa de empleo estudiantil'
            ]
        };
    }

    // Evaluar bienestar de un estudiante
    async evaluarBienestar(estudianteId, datos) {
        try {
            // Simular evaluación de bienestar
            const ansiedad = this._simularNivel(datos, 'ansiedad');
            const depresion = this._simularNivel(datos, 'depresion');
            const motivacion = this._simularNivel(datos, 'motivacion');
            const apoyoSocial = this._simularNivel(datos, 'apoyo_social');
            const saludFisica = this._simularNivel(datos, 'salud_fisica');

            const nivelGeneral = this._calcularNivelGeneral({
                ansiedad,
                depresion,
                motivacion,
                apoyoSocial,
                saludFisica
            });

            const recomendaciones = this._generarRecomendacionesBienestar({
                ansiedad,
                depresion,
                motivacion,
                apoyoSocial
            });

            return {
                estudiante_id: estudianteId,
                evaluacion: {
                    ansiedad: Math.round(ansiedad),
                    depresion: Math.round(depresion),
                    motivacion: Math.round(motivacion),
                    apoyo_social: Math.round(apoyoSocial),
                    salud_fisica: Math.round(saludFisica)
                },
                nivel_general: nivelGeneral,
                recomendaciones: recomendaciones,
                recursos_recomendados: this._seleccionarRecursos(nivelGeneral, recomendaciones),
                fecha_evaluacion: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error evaluando bienestar:', error);
            throw error;
        }
    }

    // Simular nivel de un factor
    _simularNivel(datos, factor) {
        const base = 30 + Math.random() * 40;
        let ajuste = 0;

        // Factores específicos
        if (datos[factor]) {
            ajuste += datos[factor] * 0.3;
        }

        // Factores contextuales
        if (datos.carga_horaria && datos.carga_horaria > 25) {
            if (factor === 'ansiedad') ajuste += 10;
            if (factor === 'motivacion') ajuste -= 5;
        }

        if (datos.apoyo_familiar === true) {
            if (factor === 'apoyo_social') ajuste += 15;
            if (factor === 'depresion') ajuste -= 10;
        }

        if (datos.actividad_fisica === true) {
            if (factor === 'salud_fisica') ajuste += 20;
            if (factor === 'ansiedad') ajuste -= 8;
        }

        return Math.min(100, Math.max(0, base + ajuste));
    }

    // Calcular nivel general de bienestar
    _calcularNivelGeneral(factores) {
        const promedio = (factores.ansiedad + factores.depresion + 
                         (100 - factores.motivacion) + (100 - factores.apoyoSocial) + 
                         (100 - factores.saludFisica)) / 5;

        if (promedio < 30) return 'Saludable';
        if (promedio < 50) return 'Riesgo Leve';
        if (promedio < 70) return 'Riesgo Moderado';
        return 'Riesgo Alto';
    }

    // Generar recomendaciones de bienestar
    _generarRecomendacionesBienestar(factores) {
        const recomendaciones = [];

        if (factores.ansiedad > 60) {
            recomendaciones.push({
                area: 'Ansiedad',
                mensaje: 'Nivel elevado de ansiedad detectado',
                acciones: ['Técnicas de respiración', 'Terapia cognitivo-conductual', 'Reducir carga académica']
            });
        }

        if (factores.depresion > 50) {
            recomendaciones.push({
                area: 'Depresión',
                mensaje: 'Señales de posible depresión',
                acciones: ['Apoyo psicológico profesional', 'Grupos de apoyo', 'Actividades placenteras']
            });
        }

        if (factores.motivacion < 40) {
            recomendaciones.push({
                area: 'Motivación',
                mensaje: 'Baja motivación académica',
                acciones: ['Establecer metas claras', 'Reconocer logros', 'Buscar actividades inspiradoras']
            });
        }

        if (factores.apoyoSocial < 30) {
            recomendaciones.push({
                area: 'Apoyo Social',
                mensaje: 'Red de apoyo limitada',
                acciones: ['Unirse a grupos estudiantiles', 'Participar en actividades sociales', 'Fortalecer vínculos familiares']
            });
        }

        return recomendaciones;
    }

    // Seleccionar recursos según nivel y recomendaciones
    _seleccionarRecursos(nivel, recomendaciones) {
        const recursosSeleccionados = [];

        if (nivel === 'Riesgo Alto' || nivel === 'Riesgo Moderado') {
            recursosSeleccionados.push(...this.recursos.psicologico.slice(0, 2));
            recursosSeleccionados.push(...this.recursos.academico);
        }

        if (nivel === 'Riesgo Leve') {
            recursosSeleccionados.push(this.recursos.psicologico[2]);
            recursosSeleccionados.push(...this.recursos.social);
        }

        // Recursos económicos si hay recomendaciones de apoyo
        if (recomendaciones.some(r => r.area === 'Economía')) {
            recursosSeleccionados.push(...this.recursos.economico);
        }

        return recursosSeleccionados.slice(0, 5);
    }

    // Obtener estadísticas de bienestar de una población
    async obtenerEstadisticasBienestar(estudiantesIds) {
        try {
            const resultados = [];
            const niveles = {
                'Saludable': 0,
                'Riesgo Leve': 0,
                'Riesgo Moderado': 0,
                'Riesgo Alto': 0
            };

            for (const id of estudiantesIds) {
                const evaluacion = await this.evaluarBienestar(id, {});
                resultados.push(evaluacion);
                niveles[evaluacion.nivel_general]++;
            }

            const total = resultados.length;

            return {
                total_estudiantes: total,
                distribucion_niveles: niveles,
                porcentajes: {
                    saludable: (niveles['Saludable'] / total * 100).toFixed(1),
                    riesgo_leve: (niveles['Riesgo Leve'] / total * 100).toFixed(1),
                    riesgo_moderado: (niveles['Riesgo Moderado'] / total * 100).toFixed(1),
                    riesgo_alto: (niveles['Riesgo Alto'] / total * 100).toFixed(1)
                },
                promedio_ansiedad: (resultados.reduce((sum, r) => sum + r.evaluacion.ansiedad, 0) / total).toFixed(1),
                promedio_depresion: (resultados.reduce((sum, r) => sum + r.evaluacion.depresion, 0) / total).toFixed(1),
                recomendaciones_generales: [
                    'Implementar programa de bienestar estudiantil',
                    'Crear red de apoyo entre pares',
                    'Ofrecer talleres de manejo de estrés'
                ],
                fecha_analisis: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            throw error;
        }
    }
}

module.exports = new BienestarService();