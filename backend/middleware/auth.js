// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Acceso no autorizado'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'allinyachay2024');
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Token inválido'
        });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'No autenticado'
            });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permisos para acceder'
            });
        }

        next();
    };
};