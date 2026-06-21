// backend/models/Talento.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

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

module.exports = Talento;