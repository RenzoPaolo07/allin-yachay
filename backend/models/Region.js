// backend/models/Region.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Region = sequelize.define('Region', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    departamento: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    provincia: {
        type: DataTypes.STRING(100)
    },
    latitud: DataTypes.DECIMAL(10, 8),
    longitud: DataTypes.DECIMAL(11, 8),
    total_estudiantes: DataTypes.INTEGER,
    tasa_riesgo: DataTypes.DECIMAL(5, 2),
    tasa_desercion: DataTypes.DECIMAL(5, 2),
    nivel_educativo: DataTypes.STRING(50),
    estudiantes_activos: DataTypes.INTEGER,
    estudiantes_riesgo: DataTypes.INTEGER,
    universidades: DataTypes.INTEGER,
    carreras_dominantes: DataTypes.JSON,
    recursos_disponibles: DataTypes.JSON,
    updated_at: DataTypes.DATE
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Region;