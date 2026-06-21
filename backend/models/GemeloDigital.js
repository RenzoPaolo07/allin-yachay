// backend/models/GemeloDigital.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const GemeloDigital = sequelize.define('GemeloDigital', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estudiante_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: DataTypes.STRING(100),
    fecha_creacion: DataTypes.DATE,
    ultima_actualizacion: DataTypes.DATE,
    promedio_actual: DataTypes.DECIMAL(5, 2),
    creditos_aprobados: DataTypes.INTEGER,
    creditos_totales: DataTypes.INTEGER,
    semestre_actual: DataTypes.INTEGER,
    semestres_totales: DataTypes.INTEGER,
    probabilidad_graduacion: DataTypes.DECIMAL(5, 2),
    fecha_estimada_graduacion: DataTypes.DATE,
    escenarios: DataTypes.JSON, // Guarda los escenarios simulados
    factores_riesgo: DataTypes.JSON,
    fortalezas: DataTypes.JSON,
    debilidades: DataTypes.JSON,
    recomendaciones: DataTypes.JSON
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = GemeloDigital;