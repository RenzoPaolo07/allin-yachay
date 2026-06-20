// backend/middleware/validators.js
const { body, validationResult } = require('express-validator');

exports.validateEstudiante = [
    body('dni').isLength({ min: 8, max: 8 }).withMessage('DNI debe tener 8 dígitos'),
    body('nombres').notEmpty().withMessage('Nombres es requerido'),
    body('apellidos').notEmpty().withMessage('Apellidos es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }
        next();
    }
];

exports.validateLogin = [
    body('username').notEmpty().withMessage('Usuario requerido'),
    body('password').isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }
        next();
    }
];