// backend/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

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
        timezone: '-05:00'
    }
);

// Definir modelos
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
    descripcion: DataTypes.TEXT
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
    nota: DataTypes.DECIMAL(5, 2),
    ciclo: DataTypes.STRING(10),
    fecha_registro: DataTypes.DATEONLY
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relaciones
Estudiante.hasMany(Calificacion, { foreignKey: 'estudiante_id' });
Calificacion.belongsTo(Estudiante, { foreignKey: 'estudiante_id' });
Curso.hasMany(Calificacion, { foreignKey: 'curso_id' });
Calificacion.belongsTo(Curso, { foreignKey: 'curso_id' });

module.exports = {
    sequelize,
    Estudiante,
    Curso,
    Calificacion
};