// backend/controllers/oportunidades.controller.js
const { Oportunidad } = require('../models');

// Datos de ejemplo
const oportunidadesData = [
    {
        nombre: 'Beca 18',
        tipo: 'beca',
        entidad: 'PRONABEC',
        descripcion: 'Beca para estudiantes de alto rendimiento con recursos limitados',
        requisitos: ['Promedio mínimo 14', 'Condición socioeconómica', 'Dedicación exclusiva'],
        beneficios: ['Cobertura total de estudios', 'Mantenimiento mensual'],
        monto: 'S/ 20,000',
        fecha_inicio: '2024-02-01',
        fecha_fin: '2024-12-31',
        url: 'https://www.pronabec.gob.pe/beca-18',
        nivel: 'Nacional',
        categoria: 'Educación Superior'
    },
    {
        nombre: 'Beca Vocación Maestro',
        tipo: 'beca',
        entidad: 'Minedu',
        descripcion: 'Beca para futuros docentes con vocación de servicio',
        requisitos: ['Estudiar pedagogía', 'Interés en educación', 'Compromiso social'],
        beneficios: ['Cobertura de estudios', 'Prácticas preprofesionales'],
        monto: 'S/ 15,000',
        fecha_inicio: '2024-03-01',
        fecha_fin: '2024-11-30',
        url: 'https://www.minedu.gob.pe/beca-vocacion-maestro',
        nivel: 'Nacional',
        categoria: 'Educación'
    },
    {
        nombre: 'Programa de Liderazgo Joven',
        tipo: 'programa',
        entidad: 'Fundación BBVA',
        descripcion: 'Programa de desarrollo de liderazgo para jóvenes talentos',
        requisitos: ['Liderazgo demostrado', 'Proyecto social', 'Excelencia académica'],
        beneficios: ['Mentoría', 'Networking', 'Certificación'],
        monto: 'Gratuito',
        fecha_inicio: '2024-04-01',
        fecha_fin: '2024-09-30',
        url: 'https://www.fundacionbbva.pe/liderazgo',
        nivel: 'Privado',
        categoria: 'Liderazgo'
    },
    {
        nombre: 'Hackathon Educativo Nacional',
        tipo: 'concurso',
        entidad: 'Ministerio de Educación',
        descripcion: 'Competencia de innovación educativa con IA',
        requisitos: ['Equipo de 3-5 estudiantes', 'Proyecto innovador', 'Presentación de prototipo'],
        beneficios: ['Premios en efectivo', 'Incubación', 'Visibilidad'],
        monto: 'S/ 10,000',
        fecha_inicio: '2024-05-01',
        fecha_fin: '2024-07-31',
        url: 'https://www.minedu.gob.pe/hackathon',
        nivel: 'Nacional',
        categoria: 'Innovación'
    }
];

exports.getOportunidades = async (req, res) => {
    try {
        const oportunidades = await Oportunidad.findAll();
        if (oportunidades.length === 0) {
            // Crear datos de ejemplo
            await Oportunidad.bulkCreate(oportunidadesData);
            const nuevas = await Oportunidad.findAll();
            return res.json({
                success: true,
                data: nuevas
            });
        }
        res.json({
            success: true,
            data: oportunidades
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getOportunidadById = async (req, res) => {
    try {
        const { id } = req.params;
        const oportunidad = await Oportunidad.findByPk(id);
        if (!oportunidad) {
            return res.status(404).json({
                success: false,
                error: 'Oportunidad no encontrada'
            });
        }
        res.json({
            success: true,
            data: oportunidad
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getOportunidadesByTipo = async (req, res) => {
    try {
        const { tipo } = req.params;
        const oportunidades = await Oportunidad.findAll({
            where: { tipo }
        });
        res.json({
            success: true,
            data: oportunidades
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.postularOportunidad = async (req, res) => {
    try {
        const { oportunidadId, estudianteId, datos } = req.body;
        // Simular postulación
        res.json({
            success: true,
            message: 'Postulación exitosa',
            data: {
                oportunidad_id: oportunidadId,
                estudiante_id: estudianteId,
                fecha_postulacion: new Date().toISOString(),
                estado: 'En revisión'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};