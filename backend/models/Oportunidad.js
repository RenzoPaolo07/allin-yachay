// backend/models/Oportunidad.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

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

module.exports = Oportunidad;