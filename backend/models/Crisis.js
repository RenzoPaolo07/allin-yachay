// backend/models/Crisis.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

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

module.exports = Crisis;