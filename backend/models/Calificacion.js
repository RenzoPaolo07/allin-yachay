// backend/models/Calificacion.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

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

module.exports = Calificacion;