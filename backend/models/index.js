// backend/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Crear instancia de Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME || 'allin_yachay',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            dateStrings: true,
            typeCast: true
        },
        timezone: '-05:00',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Definir modelos AQUÍ MISMO (evitando imports circulares)
const Estudiante = sequelize.define('Estudiante', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dni: {
        type: DataTypes.STRING(8),
        unique: true,
        allowNull: false
    },
    nombres: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    telefono: DataTypes.STRING(15),
    fecha_nacimiento: DataTypes.DATEONLY,
    direccion: DataTypes.TEXT,
    universidad: DataTypes.STRING(100),
    carrera: DataTypes.STRING(100),
    semestre_actual: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activo'
    },
    promedio: DataTypes.DECIMAL(5, 2),
    asistencia: DataTypes.DECIMAL(5, 2),
    motivacion: DataTypes.INTEGER,
    carga_horaria: DataTypes.INTEGER,
    trabaja: DataTypes.BOOLEAN,
    apoyo_familiar: DataTypes.BOOLEAN,
    actividad_fisica: DataTypes.BOOLEAN,
    distancia_casa: DataTypes.DECIMAL(5, 2),
    intereses: DataTypes.JSON,
    habilidades: DataTypes.JSON,
    actividades: DataTypes.JSON,
    descripcion: DataTypes.TEXT,
    creditos_aprobados: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    creditos_totales: {
        type: DataTypes.INTEGER,
        defaultValue: 200
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const Curso = sequelize.define('Curso', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    codigo: {
        type: DataTypes.STRING(20),
        unique: true
    },
    creditos: DataTypes.INTEGER,
    area: DataTypes.STRING(50),
    descripcion: DataTypes.TEXT,
    nivel_dificultad: DataTypes.INTEGER,
    requisitos: DataTypes.JSON
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const Calificacion = sequelize.define('Calificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estudiante_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    curso_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nota: DataTypes.DECIMAL(5, 2),
    ciclo: DataTypes.STRING(10),
    fecha_registro: DataTypes.DATEONLY,
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'cursando'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const Talento = sequelize.define('Talento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estudiante_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre: DataTypes.STRING(100),
    puntuacion: DataTypes.DECIMAL(5, 2),
    nivel: DataTypes.STRING(50),
    habilidades: DataTypes.JSON,
    recomendaciones: DataTypes.JSON,
    potencial: DataTypes.DECIMAL(5, 2),
    fecha_deteccion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const Crisis = sequelize.define('Crisis', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    universidad_id: DataTypes.INTEGER,
    tipo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nivel: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    mensaje: DataTypes.TEXT,
    estudiantes_afectados: DataTypes.INTEGER,
    accion_recomendada: DataTypes.TEXT,
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activa'
    },
    fecha_deteccion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_resolucion: DataTypes.DATE,
    metricas: DataTypes.JSON
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const Bienestar = sequelize.define('Bienestar', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estudiante_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ansiedad: DataTypes.DECIMAL(5, 2),
    depresion: DataTypes.DECIMAL(5, 2),
    motivacion: DataTypes.DECIMAL(5, 2),
    apoyo_social: DataTypes.DECIMAL(5, 2),
    salud_fisica: DataTypes.DECIMAL(5, 2),
    nivel_general: DataTypes.STRING(50),
    recomendaciones: DataTypes.JSON,
    recursos_recomendados: DataTypes.JSON,
    estado_animo: DataTypes.STRING(50),
    nivel_estres: DataTypes.INTEGER,
    horas_sueno: DataTypes.DECIMAL(3, 1),
    actividad_fisica: DataTypes.BOOLEAN,
    notas: DataTypes.TEXT,
    fecha_evaluacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_registro: DataTypes.DATEONLY
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const Oportunidad = sequelize.define('Oportunidad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    entidad: DataTypes.STRING(100),
    descripcion: DataTypes.TEXT,
    requisitos: DataTypes.JSON,
    beneficios: DataTypes.JSON,
    monto: DataTypes.STRING(50),
    fecha_inicio: DataTypes.DATE,
    fecha_fin: DataTypes.DATE,
    url: DataTypes.STRING(255),
    nivel: DataTypes.STRING(50),
    categoria: DataTypes.STRING(50),
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activa'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// ============ RELACIONES ============
Estudiante.hasMany(Calificacion, { foreignKey: 'estudiante_id' });
Calificacion.belongsTo(Estudiante, { foreignKey: 'estudiante_id' });

Curso.hasMany(Calificacion, { foreignKey: 'curso_id' });
Calificacion.belongsTo(Curso, { foreignKey: 'curso_id' });

Estudiante.hasMany(Talento, { foreignKey: 'estudiante_id' });
Talento.belongsTo(Estudiante, { foreignKey: 'estudiante_id' });

Estudiante.hasMany(Bienestar, { foreignKey: 'estudiante_id' });
Bienestar.belongsTo(Estudiante, { foreignKey: 'estudiante_id' });

// ============ EXPORTAR ============
module.exports = {
    sequelize,
    Estudiante,
    Curso,
    Calificacion,
    Talento,
    Crisis,
    Bienestar,
    Oportunidad
};