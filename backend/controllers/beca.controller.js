// backend/controllers/beca.controller.js
const becasData = [
    {
        id: 1,
        nombre: 'Beca 18',
        entidad: 'PRONABEC',
        monto: 'S/ 20,000',
        requisitos: ['Dedicación exclusiva', 'Promedio mínimo 14', 'Condición socioeconómica'],
        fecha_inicio: '2024-02-01',
        fecha_fin: '2024-12-31',
        url: 'https://www.pronabec.gob.pe/beca-18',
        nivel: 'Nacional'
    },
    {
        id: 2,
        nombre: 'Beca Vocación Maestro',
        entidad: 'Minedu',
        monto: 'S/ 15,000',
        requisitos: ['Estudiar pedagogía', 'Interés en educación', 'Compromiso social'],
        fecha_inicio: '2024-03-01',
        fecha_fin: '2024-11-30',
        url: 'https://www.minedu.gob.pe/beca-vocacion-maestro',
        nivel: 'Nacional'
    },
    {
        id: 3,
        nombre: 'Beca Líderes del Mañana',
        entidad: 'Fundación BBVA',
        monto: 'S/ 25,000',
        requisitos: ['Excelencia académica', 'Liderazgo demostrado', 'Proyecto social'],
        fecha_inicio: '2024-02-15',
        fecha_fin: '2024-10-15',
        url: 'https://www.fundacionbbva.pe/becas',
        nivel: 'Privado'
    },
    {
        id: 4,
        nombre: 'Beca Huawei ICT',
        entidad: 'Huawei',
        monto: 'S/ 18,000',
        requisitos: ['Estudios en tecnología', 'Conocimiento en redes', 'Inglés intermedio'],
        fecha_inicio: '2024-04-01',
        fecha_fin: '2024-08-31',
        url: 'https://www.huawei.com/pe/becas',
        nivel: 'Internacional'
    }
];

exports.getRecomendadas = async (req, res) => {
    try {
        const { estudianteId } = req.params;
        
        // Simular recomendación basada en perfil del estudiante
        const recomendadas = becasData
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        res.json({
            success: true,
            data: {
                estudiante_id: estudianteId,
                becas_recomendadas: recomendadas,
                total_becas_disponibles: becasData.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                becas: becasData,
                total: becasData.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.postular = async (req, res) => {
    try {
        const { beca_id, estudiante_id, datos_adicionales } = req.body;
        
        res.json({
            success: true,
            message: 'Postulación registrada exitosamente',
            data: {
                beca_id,
                estudiante_id,
                fecha_postulacion: new Date().toISOString(),
                estado: 'En revisión'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};