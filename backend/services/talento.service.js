// backend/services/talento.service.js
class TalentoService {
    constructor() {
        this.patronesTalento = {
            investigador: {
                keywords: ['investigación', 'laboratorio', 'tesis', 'publicación', 'artículo'],
                habilidades: ['Análisis crítico', 'Pensamiento lógico', 'Curiosidad científica'],
                recomendaciones: ['Postular a becas de investigación', 'Participar en congresos', 'Publicar artículos']
            },
            emprendedor: {
                keywords: ['emprendimiento', 'startup', 'innovación', 'negocio', 'liderazgo'],
                habilidades: ['Visión estratégica', 'Toma de decisiones', 'Comunicación efectiva'],
                recomendaciones: ['Incubadoras de startups', 'Cursos de emprendimiento', 'Networking empresarial']
            },
            ingeniero: {
                keywords: ['programación', 'algoritmos', 'sistemas', 'redes', 'datos'],
                habilidades: ['Resolución de problemas', 'Pensamiento sistémico', 'Programación'],
                recomendaciones: ['Hackathons', 'Certificaciones técnicas', 'Proyectos open source']
            },
            lider: {
                keywords: ['liderazgo', 'equipo', 'proyecto', 'dirección', 'organización'],
                habilidades: ['Comunicación asertiva', 'Trabajo en equipo', 'Planificación estratégica'],
                recomendaciones: ['Talleres de liderazgo', 'Programas de mentoría', 'Voluntariado']
            }
        };

        this.niveles = ['Principiante', 'Intermedio', 'Avanzado', 'Destacado', 'Excepcional'];
    }

    // Analizar perfil del estudiante y detectar talentos
    async detectarTalento(estudianteId, datos) {
        try {
            // Simulación de análisis de talento
            const talentosDetectados = [];
            const puntuaciones = {};

            // Analizar cada patrón
            for (const [tipo, patron] of Object.entries(this.patronesTalento)) {
                let puntuacion = 0;
                
                // Analizar keywords en los datos del estudiante
                const textoCompleto = `${datos.descripcion || ''} ${datos.cursos || ''} ${datos.intereses || ''}`.toLowerCase();
                for (const keyword of patron.keywords) {
                    if (textoCompleto.includes(keyword)) {
                        puntuacion += 15;
                    }
                }

                // Analizar habilidades
                if (datos.habilidades) {
                    for (const habilidad of patron.habilidades) {
                        if (datos.habilidades.some(h => h.toLowerCase().includes(habilidad.toLowerCase()))) {
                            puntuacion += 10;
                        }
                    }
                }

                // Factor de rendimiento académico
                if (datos.promedio && datos.promedio > 15) {
                    puntuacion += 5;
                }

                // Factor de participación en actividades
                if (datos.actividades && datos.actividades.length > 0) {
                    puntuacion += datos.actividades.length * 3;
                }

                puntuaciones[tipo] = Math.min(100, puntuacion);
                
                if (puntuacion > 40) {
                    const nivel = this._determinarNivel(puntuacion);
                    talentosDetectados.push({
                        tipo: tipo,
                        nombre: this._getNombreTalento(tipo),
                        puntuacion: Math.round(puntuacion),
                        nivel: nivel,
                        habilidades: patron.habilidades,
                        recomendaciones: patron.recomendaciones,
                        potencial: this._calcularPotencial(puntuacion)
                    });
                }
            }

            // Ordenar por puntuación
            talentosDetectados.sort((a, b) => b.puntuacion - a.puntuacion);

            // Seleccionar los mejores talentos (máximo 3)
            const topTalentos = talentosDetectados.slice(0, 3);

            return {
                estudiante_id: estudianteId,
                talentos_detectados: topTalentos,
                talento_principal: topTalentos.length > 0 ? topTalentos[0] : null,
                nivel_potencial_general: this._calcularPotencialGeneral(talentosDetectados),
                recomendaciones_generales: this._generarRecomendacionesGenerales(topTalentos),
                fecha_analisis: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error detectando talento:', error);
            throw error;
        }
    }

    // Determinar nivel según puntuación
    _determinarNivel(puntuacion) {
        if (puntuacion >= 80) return 'Excepcional';
        if (puntuacion >= 65) return 'Destacado';
        if (puntuacion >= 50) return 'Avanzado';
        if (puntuacion >= 40) return 'Intermedio';
        return 'Principiante';
    }

    // Obtener nombre amigable del talento
    _getNombreTalento(tipo) {
        const nombres = {
            investigador: '🔬 Investigador',
            emprendedor: '🚀 Emprendedor',
            ingeniero: '💻 Ingeniero',
            lider: '👥 Líder'
        };
        return nombres[tipo] || tipo;
    }

    // Calcular potencial (0-100)
    _calcularPotencial(puntuacion) {
        return Math.min(100, puntuacion + 15);
    }

    // Calcular potencial general
    _calcularPotencialGeneral(talentos) {
        if (talentos.length === 0) return 'Bajo';
        const promedio = talentos.reduce((sum, t) => sum + t.puntuacion, 0) / talentos.length;
        if (promedio >= 70) return 'Alto';
        if (promedio >= 50) return 'Medio';
        return 'Bajo';
    }

    // Generar recomendaciones generales
    _generarRecomendacionesGenerales(talentos) {
        const recomendaciones = new Set();
        
        for (const talento of talentos) {
            for (const rec of talento.recomendaciones) {
                recomendaciones.add(rec);
            }
        }

        // Agregar recomendaciones generales
        recomendaciones.add('Desarrollar habilidades blandas');
        recomendaciones.add('Participar en proyectos interdisciplinarios');
        recomendaciones.add('Buscar mentorías especializadas');

        return Array.from(recomendaciones).slice(0, 5);
    }

    // Analizar grupo de estudiantes (para universidades)
    async analizarGrupo(estudiantesIds, datos) {
        try {
            const resultados = [];
            
            for (const id of estudiantesIds) {
                const talento = await this.detectarTalento(id, datos[id] || {});
                resultados.push(talento);
            }

            // Estadísticas del grupo
            const estadisticas = {
                total_analizados: resultados.length,
                talentos_principales: this._agruparTalentos(resultados),
                promedio_potencial: resultados.reduce((sum, r) => {
                    const niveles = { 'Bajo': 1, 'Medio': 2, 'Alto': 3 };
                    return sum + (niveles[r.nivel_potencial_general] || 0);
                }, 0) / resultados.length,
                recomendaciones_grupo: this._generarRecomendacionesGrupo(resultados)
            };

            return {
                resultados_individuales: resultados,
                estadisticas_grupo: estadisticas
            };
        } catch (error) {
            console.error('Error analizando grupo:', error);
            throw error;
        }
    }

    // Agrupar talentos por tipo
    _agruparTalentos(resultados) {
        const agrupados = {};
        const tipos = ['investigador', 'emprendedor', 'ingeniero', 'lider'];
        
        for (const tipo of tipos) {
            const nombre = this._getNombreTalento(tipo);
            const count = resultados.filter(r => 
                r.talentos_detectados.some(t => t.tipo === tipo)
            ).length;
            if (count > 0) {
                agrupados[nombre] = count;
            }
        }
        
        return agrupados;
    }

    // Generar recomendaciones para el grupo
    _generarRecomendacionesGrupo(resultados) {
        const recomendaciones = [];
        const count = resultados.length;

        if (count > 10) {
            recomendaciones.push('Crear programas de talento especializados');
        }

        const talentosPrincipales = this._agruparTalentos(resultados);
        const topTalento = Object.entries(talentosPrincipales).sort((a, b) => b[1] - a[1])[0];
        
        if (topTalento) {
            recomendaciones.push(`Fortalecer programas para ${topTalento[0]}s (${topTalento[1]} estudiantes)`);
        }

        return recomendaciones;
    }
}

module.exports = new TalentoService();