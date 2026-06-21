// backend/models/Estudiante.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

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
    descripcion: DataTypes.TEXT
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Estudiante;