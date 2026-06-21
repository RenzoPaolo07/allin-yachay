// frontend/js/i18n.js
class I18n {
    constructor() {
        this.idiomaActual = localStorage.getItem('allin_idioma') || 'es';
        this.traducciones = {};
        this.callbacks = [];
        this.cargado = false;
    }

    // Cargar traducciones desde el archivo JSON
    async cargarTraducciones() {
        try {
            const response = await fetch('/data/traducciones.json');
            if (!response.ok) throw new Error('No se pudo cargar el archivo de traducciones');
            this.traducciones = await response.json();
            this.cargado = true;
            this.aplicarIdioma(this.idiomaActual);
            return true;
        } catch (error) {
            console.error('Error cargando traducciones:', error);
            // Fallback: cargar desde el objeto inline
            this.traducciones = this._getTraduccionesFallback();
            this.cargado = true;
            this.aplicarIdioma(this.idiomaActual);
            return false;
        }
    }

    // Fallback en caso de que no se cargue el archivo JSON
    _getTraduccionesFallback() {
        return {
            "es": {
                "nombre": "Español",
                "flag": "🇪🇸",
                "traducciones": {
                    "app_nombre": "ALLIN YACHAY",
                    "app_slogan": "Ningún estudiante atrás",
                    "nav_inicio": "Inicio",
                    "nav_dashboard": "Dashboard",
                    "nav_modulos": "Módulos",
                    "nav_testimonios": "Testimonios",
                    "nav_becas": "Becas",
                    "nav_demo": "Demo",
                    "nav_idiomas": "Idiomas",
                    "nav_acerca": "Acerca",
                    "dashboard_titulo": "Dashboard",
                    "dashboard_estudiantes": "Estudiantes",
                    "dashboard_activos": "Activos",
                    "dashboard_riesgo": "En Riesgo",
                    "dashboard_abandonaron": "Abandonaron",
                    "sidebar_principal": "Principal",
                    "sidebar_gestion": "Gestión",
                    "sidebar_estudiantes": "Estudiantes",
                    "sidebar_predicciones": "Predicciones",
                    "sidebar_tutor_ia": "Tutor IA",
                    "sidebar_becas": "Becas",
                    "sidebar_cursos": "Cursos",
                    "sidebar_calendario": "Calendario",
                    "sidebar_configuracion": "Configuración",
                    "sidebar_ayuda": "Ayuda"
                }
            },
            "qu": {
                "nombre": "Quechua",
                "flag": "🇵🇪",
                "traducciones": {
                    "app_nombre": "ALLIN YACHAY",
                    "app_slogan": "Mana pipas estudiante qhipaman saqesqa",
                    "nav_inicio": "Qallariy",
                    "nav_dashboard": "Tawllikuna",
                    "nav_modulos": "Rakikuna",
                    "nav_testimonios": "Willakuykuna",
                    "nav_becas": "Yanapakuykuna",
                    "nav_demo": "Ruway rikuchiy",
                    "nav_idiomas": "Simikuna",
                    "nav_acerca": "Willay",
                    "dashboard_titulo": "Tawllikuna",
                    "dashboard_estudiantes": "Yachachiqkuna",
                    "dashboard_activos": "Kawsaqkuna",
                    "dashboard_riesgo": "Peligropi",
                    "dashboard_abandonaron": "Saqerqanku",
                    "sidebar_principal": "Ñawpaq",
                    "sidebar_gestion": "Kamachiy",
                    "sidebar_estudiantes": "Yachachiqkuna",
                    "sidebar_predicciones": "Ñawpaqmanta willay",
                    "sidebar_tutor_ia": "Yanapakuq IA",
                    "sidebar_becas": "Yanapakuykuna",
                    "sidebar_cursos": "Yachaykuna",
                    "sidebar_calendario": "P'unchawkuna",
                    "sidebar_configuracion": "Wakichiy",
                    "sidebar_ayuda": "Yanapay"
                }
            }
        };
    }

    // Obtener traducción de una clave
    t(clave, params = {}) {
        if (!this.cargado) return clave;
        
        const idiomaData = this.traducciones[this.idiomaActual];
        if (!idiomaData) return clave;

        let traduccion = idiomaData.traducciones[clave];
        if (!traduccion) {
            // Buscar en el idioma por defecto (español)
            const esData = this.traducciones['es'];
            if (esData && esData.traducciones[clave]) {
                traduccion = esData.traducciones[clave];
            } else {
                return clave;
            }
        }

        // Reemplazar parámetros
        for (const [key, value] of Object.entries(params)) {
            traduccion = traduccion.replace(`{${key}}`, value);
        }

        return traduccion;
    }

    // Obtener todas las traducciones de un idioma
    getTraducciones(idioma) {
        if (!this.cargado) return {};
        const data = this.traducciones[idioma || this.idiomaActual];
        return data ? data.traducciones : {};
    }

    // Cambiar idioma
    cambiarIdioma(idioma) {
        if (!this.traducciones[idioma]) {
            console.warn(`Idioma "${idioma}" no disponible`);
            return false;
        }
        
        this.idiomaActual = idioma;
        localStorage.setItem('allin_idioma', idioma);
        this.aplicarIdioma(idioma);
        return true;
    }

    // Aplicar idioma a toda la página
    aplicarIdioma(idioma) {
        if (!this.cargado) {
            setTimeout(() => this.aplicarIdioma(idioma), 100);
            return;
        }

        // Actualizar todos los elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const clave = el.getAttribute('data-i18n');
            const traduccion = this.t(clave);
            if (traduccion !== clave) {
                el.textContent = traduccion;
            }
        });

        // Actualizar placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const clave = el.getAttribute('data-i18n-placeholder');
            const traduccion = this.t(clave);
            if (traduccion !== clave) {
                el.placeholder = traduccion;
            }
        });

        // Actualizar títulos (tooltips)
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const clave = el.getAttribute('data-i18n-title');
            const traduccion = this.t(clave);
            if (traduccion !== clave) {
                el.title = traduccion;
            }
        });

        // Actualizar valores de inputs
        document.querySelectorAll('[data-i18n-value]').forEach(el => {
            const clave = el.getAttribute('data-i18n-value');
            const traduccion = this.t(clave);
            if (traduccion !== clave) {
                el.value = traduccion;
            }
        });

        // Ejecutar callbacks
        this.callbacks.forEach(cb => cb(idioma));

        // Actualizar el selector de idioma si existe
        this._actualizarSelectorIdioma(idioma);
    }

    // Actualizar selector de idioma visualmente
    _actualizarSelectorIdioma(idioma) {
        document.querySelectorAll('.idioma-option').forEach(el => {
            el.classList.toggle('active', el.dataset.idioma === idioma);
        });
    }

    // Registrar callback para cuando cambie el idioma
    onCambioIdioma(callback) {
        this.callbacks.push(callback);
        return () => {
            const index = this.callbacks.indexOf(callback);
            if (index > -1) this.callbacks.splice(index, 1);
        };
    }

    // Obtener idioma actual
    getIdiomaActual() {
        return this.idiomaActual;
    }

    // Obtener lista de idiomas disponibles
    getIdiomasDisponibles() {
        return Object.keys(this.traducciones).map(key => ({
            codigo: key,
            nombre: this.traducciones[key].nombre,
            flag: this.traducciones[key].flag
        }));
    }

    // Traducir un texto específico (para uso en JS)
    traducirTexto(texto, idiomaDestino = null) {
        const idioma = idiomaDestino || this.idiomaActual;
        const data = this.traducciones[idioma];
        if (!data) return texto;

        // Buscar el texto en las traducciones
        for (const [clave, valor] of Object.entries(data.traducciones)) {
            if (valor === texto) {
                return this.t(clave);
            }
        }

        return texto;
    }
}

// ============ INICIALIZAR Y EXPORTAR ============
const i18n = new I18n();

// Función global para traducción fácil
function __(clave, params = {}) {
    return i18n.t(clave, params);
}

// Función global para cambiar idioma
function cambiarIdioma(idioma) {
    return i18n.cambiarIdioma(idioma);
}

// Función global para obtener idioma actual
function getIdiomaActual() {
    return i18n.getIdiomaActual();
}

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    await i18n.cargarTraducciones();
    i18n.aplicarIdioma(i18n.getIdiomaActual());
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { i18n, __, cambiarIdioma, getIdiomaActual };
}