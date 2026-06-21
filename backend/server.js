// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/public')));

// backend/server.js - Agregar al inicio
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/data', express.static(path.join(__dirname, '../frontend/data')));

// Importar modelos
const { sequelize } = require('./models');

// Probar conexión a BD
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión a MySQL establecida');
        return sequelize.sync({ alter: false, force: false });
    })
    .then(() => {
        console.log('✅ Modelos sincronizados');
    })
    .catch(err => {
        console.error('❌ Error de conexión:', err.message);
        console.log('⚠️ Continuando sin base de datos...');
    });

// Importar rutas
const authRoutes = require('./api/auth.routes');
const estudianteRoutes = require('./api/estudiante.routes');
const tutorRoutes = require('./api/tutor.routes');
const prediccionRoutes = require('./api/prediccion.routes');
const becaRoutes = require('./api/beca.routes');
const dashboardRoutes = require('./api/dashboard.routes');
// Nuevos módulos
const mapaRoutes = require('./api/mapa.routes');
const talentoRoutes = require('./api/talento.routes');
const crisisRoutes = require('./api/crisis.routes');
const bienestarRoutes = require('./api/bienestar.routes');
const oportunidadesRoutes = require('./api/oportunidades.routes');
// backend/server.js - Agregar estas líneas
const idiomaRoutes = require('./api/idioma.routes');
// backend/server.js - Agregar
const geminiRoutes = require('./api/gemini.routes');

// Registrar rutas API
app.use('/api/auth', authRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/prediccion', prediccionRoutes);
app.use('/api/becas', becaRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Registrar nuevas rutas
app.use('/api/mapa', mapaRoutes);
app.use('/api/talento', talentoRoutes);
app.use('/api/crisis', crisisRoutes);
app.use('/api/bienestar', bienestarRoutes);
app.use('/api/oportunidades', oportunidadesRoutes);
// Registrar rutas
app.use('/api/idiomas', idiomaRoutes);
// Registrar rutas
app.use('/api/gemini', geminiRoutes);

// 🔥 RUTAS PARA EL FRONTEND - FORMA CORRECTA
// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Ruta para el dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/dashboard.html'));
});

// 🔥 IMPORTANTE: Para cualquier otra ruta, redirigir al index
// Usamos app.get con un parámetro opcional en lugar de *
app.get('/:page', (req, res) => {
    const page = req.params.page;
    // Si es una ruta de API, no la atrapamos
    if (page === 'api') {
        return res.status(404).json({ error: 'API endpoint no encontrado' });
    }
    // Si es una página HTML que existe, la servimos
    const filePath = path.join(__dirname, '../frontend/public', `${page}.html`);
    res.sendFile(filePath, (err) => {
        if (err) {
            // Si no existe, enviar el index (para SPA)
            res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
        }
    });
});

// Manejador de errores 404 para rutas no encontradas
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Manejador de errores general
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({
        error: 'Algo salió mal',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 ALLIN YACHAY corriendo en http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
});