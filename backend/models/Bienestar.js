// backend/models/Bienestar.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

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

module.exports = Bienestar;