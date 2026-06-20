// backend/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const usuarios = [
    {
        id: 1,
        username: 'renzo',
        password: '$2a$10$wRkxMZn6KPhHy9Z.KDn8nO8YlLQ6wMZvqY2D3CXi4Wv6CbN5R8r7O', // password: 123456
        nombre: 'Renzo Quispe',
        rol: 'estudiante'
    }
];

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Usuario y contraseña requeridos'
            });
        }

        // Buscar usuario (simulado)
        const usuario = usuarios.find(u => u.username === username);
        
        if (!usuario) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña (simulado)
        const passwordValida = password === '123456'; // Demo
        // const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = jwt.sign(
            { id: usuario.id, username: usuario.username, rol: usuario.rol },
            process.env.JWT_SECRET || 'allinyachay2024',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            data: {
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    username: usuario.username,
                    rol: usuario.rol
                }
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, password, nombre, email } = req.body;
        
        // Simular registro
        const nuevoUsuario = {
            id: usuarios.length + 1,
            username,
            nombre,
            email,
            rol: 'estudiante'
        };
        
        usuarios.push(nuevoUsuario);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: nuevoUsuario
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.logout = async (req, res) => {
    res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
    });
};

exports.verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'allinyachay2024');
        
        res.json({
            success: true,
            data: decoded
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Token inválido'
        });
    }
};