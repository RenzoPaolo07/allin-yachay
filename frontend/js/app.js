// frontend/js/app.js
// Configuración global
const API_URL = 'http://localhost:3000/api';

// Inicializar AOS
AOS.init({
    duration: 800,
    once: true
});

// Cargar datos de estadísticas
async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}/dashboard`);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalEstudiantes').textContent = data.data.total_estudiantes;
            document.getElementById('tasaPermanencia').textContent = data.data.tasa_permanencia;
            document.getElementById('totalUniversidades').textContent = data.data.universidades.length;
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

// Cargar módulos
function cargarModulos() {
    const modulos = [
        {
            icon: 'fa-brain',
            titulo: 'IA Predictiva',
            descripcion: 'Analiza notas, asistencia, participación y estado emocional para predecir riesgo de abandono.',
            badge: 'Bajo Riesgo',
            badgeClass: 'badge-bajo'
        },
        {
            icon: 'fa-graduation-cap',
            titulo: 'Tutor IA Adaptativo',
            descripcion: 'Enseña Matemática, Física, Programación y Comunicación con un enfoque personalizado.',
            badge: 'Adaptativo',
            badgeClass: 'badge-medio'
        },
        {
            icon: 'fa-language',
            titulo: 'Soporte en Quechua',
            descripcion: 'Contenido educativo en Español y Quechua para estudiantes de comunidades andinas.',
            badge: 'Inclusivo',
            badgeClass: 'badge-bajo'
        },
        {
            icon: 'fa-heart',
            titulo: 'Detector Emocional',
            descripcion: 'Identifica estrés, desmotivación y riesgo académico a través del análisis de texto.',
            badge: 'Alerta',
            badgeClass: 'badge-alto'
        },
        {
            icon: 'fa-user-tie',
            titulo: 'Mentor Inteligente',
            descripcion: 'Alertas personalizadas: "Has bajado 20% en Física, te recomiendo reforzar derivadas."',
            badge: 'Mentor',
            badgeClass: 'badge-bajo'
        },
        {
            icon: 'fa-route',
            titulo: 'Orientación Vocacional',
            descripcion: 'Analiza gustos, habilidades y rendimiento para sugerir carreras y certificaciones.',
            badge: 'Vocacional',
            badgeClass: 'badge-medio'
        }
    ];

    const grid = document.getElementById('modulosGrid');
    if (grid) {
        grid.innerHTML = modulos.map((modulo, index) => `
            <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                <div class="module-card">
                    <span class="badge-risgo ${modulo.badgeClass}">
                        <i class="fas fa-check-circle me-1"></i> ${modulo.badge}
                    </span>
                    <i class="icon fas ${modulo.icon}"></i>
                    <h5 class="fw-bold">${modulo.titulo}</h5>
                    <p class="text-muted">${modulo.descripcion}</p>
                    <div class="mt-2">
                        <span class="badge bg-primary me-1">Activo</span>
                        <span class="badge bg-secondary">24/7</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Función para el chat del tutor
let chatHistorial = [];

async function enviarPregunta() {
    const input = document.getElementById('preguntaInput');
    const mensajes = document.getElementById('chatMessages');
    const pregunta = input.value.trim();
    
    if (!pregunta) return;
    
    // Agregar mensaje del usuario
    const userMsg = document.createElement('div');
    userMsg.className = 'text-end mb-2';
    userMsg.innerHTML = `<span class="badge bg-primary p-2">${pregunta}</span>`;
    mensajes.appendChild(userMsg);
    
    input.value = '';
    mensajes.scrollTop = mensajes.scrollHeight;
    
    // Mostrar loading
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'text-start mb-2';
    loadingMsg.id = 'loadingMsg';
    loadingMsg.innerHTML = `<span class="badge bg-secondary p-2"><i class="fas fa-spinner fa-spin"></i> Pensando...</span>`;
    mensajes.appendChild(loadingMsg);
    mensajes.scrollTop = mensajes.scrollHeight;
    
    try {
        const response = await fetch(`${API_URL}/tutor/preguntar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pregunta: pregunta,
                curso: 'matemáticas',
                estudiante_id: 1
            })
        });
        
        const data = await response.json();
        
        // Remover loading
        document.getElementById('loadingMsg')?.remove();
        
        if (data.success) {
            const botMsg = document.createElement('div');
            botMsg.className = 'text-start mb-2';
            botMsg.innerHTML = `<span class="badge bg-success p-2" style="white-space: normal; text-align: left; max-width: 80%;">${data.data.respuesta}</span>`;
            mensajes.appendChild(botMsg);
            mensajes.scrollTop = mensajes.scrollHeight;
        } else {
            throw new Error('Error en la respuesta');
        }
    } catch (error) {
        document.getElementById('loadingMsg')?.remove();
        const errorMsg = document.createElement('div');
        errorMsg.className = 'text-start mb-2';
        errorMsg.innerHTML = `<span class="badge bg-danger p-2">❌ Error: ${error.message}</span>`;
        mensajes.appendChild(errorMsg);
        mensajes.scrollTop = mensajes.scrollHeight;
    }
}

function preguntaEjemplo(pregunta) {
    document.getElementById('preguntaInput').value = pregunta;
    enviarPregunta();
}

// Función para analizar riesgo
async function analizarRiesgo() {
    const resultado = document.getElementById('prediccionResultado');
    const btn = document.getElementById('analizarRiesgoBtn');
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analizando...';
    
    try {
        const response = await fetch(`${API_URL}/prediccion/1`);
        const data = await response.json();
        
        if (data.success) {
            const pred = data.data;
            const colores = {
                'Bajo': 'success',
                'Medio': 'warning',
                'Alto': 'danger'
            };
            
            resultado.innerHTML = `
                <div class="p-3">
                    <div class="display-6 mb-2 text-${colores[pred.nivel_riesgo]}">
                        ${pred.nivel_riesgo}
                    </div>
                    <div class="mb-3">
                        <div class="d-flex justify-content-between">
                            <span>Probabilidad de abandono</span>
                            <span class="fw-bold">${pred.probabilidad_abandono}%</span>
                        </div>
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar bg-${colores[pred.nivel_riesgo]}" 
                                 style="width: ${pred.probabilidad_abandono}%"></div>
                        </div>
                    </div>
                    <div class="text-start">
                        <small class="text-muted">Factores:</small>
                        <div class="row g-1 mt-1">
                            <div class="col-6"><small>Rendimiento: ${pred.factores.rendimiento_academico}%</small></div>
                            <div class="col-6"><small>Asistencia: ${pred.factores.asistencia}%</small></div>
                            <div class="col-6"><small>Participación: ${pred.factores.participacion}%</small></div>
                            <div class="col-6"><small>Motivación: ${pred.factores.estado_emocional}%</small></div>
                        </div>
                    </div>
                    <div class="mt-2 text-start">
                        <small class="text-muted">Recomendaciones:</small>
                        <ul class="small mb-0">
                            ${pred.recomendaciones.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        resultado.innerHTML = `
            <div class="text-danger">
                <i class="fas fa-exclamation-circle fa-2x"></i>
                <p class="mt-2">Error al analizar</p>
            </div>
        `;
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sync me-2"></i>Analizar Estudiante';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    cargarEstadisticas();
    cargarModulos();
    
    // Botón enviar pregunta
    document.getElementById('enviarPreguntaBtn')?.addEventListener('click', enviarPregunta);
    document.getElementById('preguntaInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') enviarPregunta();
    });
    
    // Botón analizar riesgo
    document.getElementById('analizarRiesgoBtn')?.addEventListener('click', analizarRiesgo);
    
    // Ejecutar análisis inicial
    setTimeout(analizarRiesgo, 1000);
});