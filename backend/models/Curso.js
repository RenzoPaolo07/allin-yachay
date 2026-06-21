// backend/models/Curso.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

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

module.exports = Curso;