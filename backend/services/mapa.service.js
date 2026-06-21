// backend/services/mapa.service.js
const Region = require('../models/Region');

// Datos simulados de regiones del Perú
const regionesData = [
    { 
        nombre: 'Cusco', 
        departamento: 'Cusco', 
        latitud: -13.5319, 
        longitud: -71.9675,
        total_estudiantes: 25000,
        tasa_riesgo: 15.5,
        tasa_desercion: 8.2,
        universidades: 8,
        carreras_dominantes: ['Ingeniería', 'Turismo', 'Arqueología'],
        recursos_disponibles: ['Beca 18', 'Pronabec', 'Programas sociales']
    },
    { 
        nombre: 'Lima', 
        departamento: 'Lima', 
        latitud: -12.0464, 
        longitud: -77.0428,
        total_estudiantes: 180000,
        tasa_riesgo: 22.3,
        tasa_desercion: 12.7,
        universidades: 45,
        carreras_dominantes: ['Administración', 'Ingeniería', 'Derecho'],
        recursos_disponibles: ['Beca 18', 'Beca Vocación Maestro', 'Beca Líderes']
    },
    { 
        nombre: 'Arequipa', 
        departamento: 'Arequipa', 
        latitud: -16.3988, 
        longitud: -71.5369,
        total_estudiantes: 45000,
        tasa_riesgo: 18.2,
        tasa_desercion: 9.8,
        universidades: 12,
        carreras_dominantes: ['Ingeniería', 'Arquitectura', 'Medicina'],
        recursos_disponibles: ['Pronabec', 'Beca 18']
    },
    { 
        nombre: 'Puno', 
        departamento: 'Puno', 
        latitud: -15.8402, 
        longitud: -70.0219,
        total_estudiantes: 18000,
        tasa_riesgo: 32.5,
        tasa_desercion: 18.3,
        universidades: 5,
        carreras_dominantes: ['Educación', 'Ingeniería', 'Agronomía'],
        recursos_disponibles: ['Beca 18', 'Pronabec']
    },
    { 
        nombre: 'Ayacucho', 
        departamento: 'Ayacucho', 
        latitud: -13.1588, 
        longitud: -74.2233,
        total_estudiantes: 12000,
        tasa_riesgo: 28.7,
        tasa_desercion: 15.2,
        universidades: 4,
        carreras_dominantes: ['Educación', 'Ingeniería', 'Ciencias Sociales'],
        recursos_disponibles: ['Beca 18']
    }
];

class MapaService {
    // Obtener todas las regiones
    async obtenerRegiones() {
        try {
            const regiones = await Region.findAll();
            if (regiones.length === 0) {
                // Si no hay datos, crear desde el seed
                await this.inicializarRegiones();
                return await Region.findAll();
            }
            return regiones;
        } catch (error) {
            console.error('Error en obtenerRegiones:', error);
            return regionesData;
        }
    }

    // Inicializar regiones
    async inicializarRegiones() {
        try {
            await Region.bulkCreate(regionesData.map(r => ({
                ...r,
                estudiantes_activos: Math.floor(r.total_estudiantes * (1 - r.tasa_desercion / 100)),
                estudiantes_riesgo: Math.floor(r.total_estudiantes * r.tasa_riesgo / 100)
            })));
            return true;
        } catch (error) {
            console.error('Error inicializando regiones:', error);
            return false;
        }
    }

    // Obtener estadísticas nacionales
    async obtenerEstadisticasNacionales() {
        const regiones = await this.obtenerRegiones();
        const total = regiones.reduce((sum, r) => sum + r.total_estudiantes, 0);
        const riesgoTotal = regiones.reduce((sum, r) => sum + r.estudiantes_riesgo, 0);
        const desercionTotal = regiones.reduce((sum, r) => sum + (r.total_estudiantes * r.tasa_desercion / 100), 0);
        
        return {
            total_estudiantes: total,
            total_riesgo: Math.floor(riesgoTotal),
            total_desercion: Math.floor(desercionTotal),
            tasa_promedio_riesgo: ((riesgoTotal / total) * 100).toFixed(2),
            regiones_analizadas: regiones.length,
            universidades_totales: regiones.reduce((sum, r) => sum + r.universidades, 0),
            regiones_criticas: regiones.filter(r => r.tasa_riesgo > 25).map(r => r.nombre)
        };
    }

    // Obtener regiones con mayor riesgo
    async obtenerRegionesCriticas() {
        const regiones = await this.obtenerRegiones();
        return regiones
            .sort((a, b) => b.tasa_riesgo - a.tasa_riesgo)
            .slice(0, 5)
            .map(r => ({
                nombre: r.nombre,
                tasa_riesgo: r.tasa_riesgo,
                total_estudiantes: r.total_estudiantes,
                estudiantes_riesgo: r.estudiantes_riesgo
            }));
    }

    // Simular actualización de datos en tiempo real
    async actualizarDatosTiempoReal() {
        // Simulación de actualización de datos
        const regiones = await this.obtenerRegiones();
        const actualizadas = regiones.map(r => {
            const variacion = (Math.random() - 0.5) * 2;
            const nuevaTasaRiesgo = Math.max(5, Math.min(45, r.tasa_riesgo + variacion));
            return {
                ...r,
                tasa_riesgo: parseFloat(nuevaTasaRiesgo.toFixed(2)),
                estudiantes_riesgo: Math.floor(r.total_estudiantes * nuevaTasaRiesgo / 100)
            };
        });
        
        // Actualizar en BD
        for (const r of actualizadas) {
            await Region.update(
                { 
                    tasa_riesgo: r.tasa_riesgo, 
                    estudiantes_riesgo: r.estudiantes_riesgo,
                    updated_at: new Date()
                },
                { where: { id: r.id } }
            );
        }
        return actualizadas;
    }
}

module.exports = new MapaService();