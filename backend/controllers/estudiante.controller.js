// backend/controllers/estudiante.controller.js
const { Estudiante, Calificacion, Curso } = require('../models');

exports.getAll = async (req, res) => {
    try {
        const estudiantes = [
            {
                id: 1,
                nombres: 'Renzo',
                apellidos: 'Quispe Mamani',
                dni: '12345678',
                email: 'renzo@allinyachay.pe',
                universidad: 'UNSAAC',
                carrera: 'Ing. Sistemas',
                semestre: 5,
                estado: 'activo'
            },
            {
                id: 2,
                nombres: 'María',
                apellidos: 'Ccorahua Yucra',
                dni: '87654321',
                email: 'maria@allinyachay.pe',
                universidad: 'UNSAAC',
                carrera: 'Ing. Civil',
                semestre: 3,
                estado: 'riesgo'
            },
            {
                id: 3,
                nombres: 'Carlos',
                apellidos: 'Huamaní Quispe',
                dni: '56781234',
                email: 'carlos@allinyachay.pe',
                universidad: 'UNMSM',
                carrera: 'Medicina',
                semestre: 7,
                estado: 'activo'
            }
        ];
        
        res.json({ success: true, data: estudiantes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const estudiante = {
            id: id,
            nombres: 'Renzo',
            apellidos: 'Quispe Mamani',
            dni: '12345678',
            email: 'renzo@allinyachay.pe',
            telefono: '984123456',
            fecha_nacimiento: '2000-05-15',
            universidad: 'UNSAAC',
            carrera: 'Ing. Sistemas',
            semestre_actual: 5,
            estado: 'activo',
            cursos: [
                { nombre: 'Base de Datos', nota: 16, creditos: 4 },
                { nombre: 'Redes', nota: 14, creditos: 3 },
                { nombre: 'Ingeniería de Software', nota: 15, creditos: 4 }
            ]
        };
        
        res.json({ success: true, data: estudiante });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { dni, nombres, apellidos, email } = req.body;
        const nuevoEstudiante = {
            id: Math.floor(Math.random() * 1000),
            dni,
            nombres,
            apellidos,
            email,
            estado: 'activo'
        };
        
        res.status(201).json({ success: true, data: nuevoEstudiante });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        res.json({ 
            success: true, 
            message: 'Estudiante actualizado', 
            data: { id, ...updates }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ success: true, message: `Estudiante ${id} eliminado` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getRiesgo = async (req, res) => {
    try {
        const { id } = req.params;
        const riesgo = {
            nivel: ['Bajo', 'Medio', 'Alto'][Math.floor(Math.random() * 3)],
            probabilidad: (Math.random() * 40 + 5).toFixed(2),
            factores: {
                rendimiento: Math.random() * 100,
                asistencia: Math.random() * 100,
                participacion: Math.random() * 100,
                motivacion: Math.random() * 100
            },
            recomendaciones: [
                'Reforzar temas de Cálculo I',
                'Participar en tutorías grupales',
                'Establecer horario de estudio diario',
                'Unirse a grupo de estudio'
            ]
        };
        
        res.json({ success: true, data: riesgo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};