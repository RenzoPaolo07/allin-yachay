// frontend/js/i18n.js
class I18n {
    constructor() {
        this.idiomaActual = localStorage.getItem('allin_idioma') || 'es';
        this.traducciones = {};
        this.cargado = false;
        this.callbacks = [];
        this.observers = [];
    }

    // Cargar traducciones desde el archivo JSON
    async cargarTraducciones() {
        try {
            const response = await fetch('/data/traducciones.json');
            if (!response.ok) throw new Error('No se pudo cargar el archivo de traducciones');
            this.traducciones = await response.json();
            this.cargado = true;
            console.log('✅ Traducciones cargadas:', Object.keys(this.traducciones));
            this.aplicarIdioma(this.idiomaActual);
            return true;
        } catch (error) {
            console.error('Error cargando traducciones:', error);
            // Fallback: cargar traducciones inline
            this.traducciones = this._getTraduccionesFallback();
            this.cargado = true;
            this.aplicarIdioma(this.idiomaActual);
            return false;
        }
    }

    // Fallback en caso de error
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
                    "nav_idiomas": "Idiomas",
                    "dashboard_titulo": "Dashboard",
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
                    "nav_idiomas": "Simikuna",
                    "dashboard_titulo": "Tawllikuna",
                    "sidebar_estudiantes": "Yachachiqkuna",
                    "sidebar_predicciones": "Ñawpaqmanta willay",
                    "sidebar_tutor_ia": "Yanapakuq IA",
                    "sidebar_becas": "Yanapakuykuna",
                    "sidebar_cursos": "Yachaykuna",
                    "sidebar_calendario": "P'unchawkuna",
                    "sidebar_configuracion": "Wakichiy",
                    "sidebar_ayuda": "Yanapay"
                }
            },
            "ay": {
                "nombre": "Aymara",
                "flag": "🇵🇪",
                "traducciones": {
                    "app_nombre": "ALLIN YACHAY",
                    "app_slogan": "Janiw estudiante qhipar purkiti",
                    "nav_inicio": "Qalltaña",
                    "nav_dashboard": "Uñacht'awi",
                    "nav_modulos": "Rakina",
                    "nav_idiomas": "Aru",
                    "dashboard_titulo": "Uñacht'awi",
                    "sidebar_estudiantes": "Yatichirinaka",
                    "sidebar_predicciones": "Nayrapacha yatiyawi",
                    "sidebar_tutor_ia": "Yanapiri IA",
                    "sidebar_becas": "Yanapawi",
                    "sidebar_cursos": "Yatichawinaka",
                    "sidebar_calendario": "Pacha",
                    "sidebar_configuracion": "Wakichawi",
                    "sidebar_ayuda": "Yanapa"
                }
            },
            "as": {
                "nombre": "Asháninka",
                "flag": "🇵🇪",
                "traducciones": {
                    "app_nombre": "ALLIN YACHAY",
                    "app_slogan": "Nokima estudiante tsikari",
                    "nav_inicio": "Péroni",
                    "nav_dashboard": "Kantsiki",
                    "nav_modulos": "Kantsikini",
                    "nav_idiomas": "Ampari",
                    "dashboard_titulo": "Kantsiki",
                    "sidebar_estudiantes": "Yachitavetzi",
                    "sidebar_predicciones": "Tsinaneki",
                    "sidebar_tutor_ia": "Yanapava IA",
                    "sidebar_becas": "Yanapavatsi",
                    "sidebar_cursos": "Yachitavetzi",
                    "sidebar_calendario": "Kamantatsi",
                    "sidebar_configuracion": "Kantankitsi",
                    "sidebar_ayuda": "Yanapatsi"
                }
            },
            "en": {
                "nombre": "English",
                "flag": "🇬🇧",
                "traducciones": {
                    "app_nombre": "ALLIN YACHAY",
                    "app_slogan": "No student left behind",
                    "nav_inicio": "Home",
                    "nav_dashboard": "Dashboard",
                    "nav_modulos": "Modules",
                    "nav_idiomas": "Languages",
                    "dashboard_titulo": "Dashboard",
                    "sidebar_estudiantes": "Students",
                    "sidebar_predicciones": "Predictions",
                    "sidebar_tutor_ia": "AI Tutor",
                    "sidebar_becas": "Scholarships",
                    "sidebar_cursos": "Courses",
                    "sidebar_calendario": "Calendar",
                    "sidebar_configuracion": "Settings",
                    "sidebar_ayuda": "Help"
                }
            }
        };
    }

    // Obtener traducción de una clave
    t(clave, params = {}) {
        if (!this.cargado) {
            // Intentar cargar si no está cargado
            this.cargarTraducciones();
            return clave;
        }
        
        const idiomaData = this.traducciones[this.idiomaActual];
        if (!idiomaData) return clave;

        let traduccion = idiomaData.traducciones[clave];
        if (!traduccion) {
            // Buscar en el idioma por defecto (español)
            const esData = this.traducciones['es'];
            if (esData && esData.traducciones[clave]) {
                traduccion = esData.traducciones[clave];
            } else {
                // Buscar en cualquier idioma
                for (const [key, data] of Object.entries(this.traducciones)) {
                    if (data.traducciones[clave]) {
                        traduccion = data.traducciones[clave];
                        break;
                    }
                }
                if (!traduccion) return clave;
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

    // Cambiar idioma y actualizar TODO
    cambiarIdioma(idioma) {
        if (!this.traducciones[idioma]) {
            console.warn(`Idioma "${idioma}" no disponible`);
            return false;
        }
        
        this.idiomaActual = idioma;
        localStorage.setItem('allin_idioma', idioma);
        
        // Aplicar a toda la página
        this.aplicarIdioma(idioma);
        
        // Notificar a los callbacks
        this.callbacks.forEach(cb => cb(idioma));
        
        console.log(`✅ Idioma cambiado a: ${idioma}`);
        return true;
    }

    // Aplicar idioma a TODA la página (MÉTODO PRINCIPAL)
    aplicarIdioma(idioma) {
        if (!this.cargado) {
            setTimeout(() => this.aplicarIdioma(idioma), 200);
            return;
        }

        console.log(`🔄 Aplicando idioma: ${idioma}`);
        
        // ============ ACTUALIZAR TODOS LOS ELEMENTOS CON data-i18n ============
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const clave = el.getAttribute('data-i18n');
            const traduccion = this.t(clave);
            if (traduccion && traduccion !== el.textContent) {
                el.textContent = traduccion;
            }
        });

        // ============ ACTUALIZAR PLACEHOLDERS ============
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const clave = el.getAttribute('data-i18n-placeholder');
            const traduccion = this.t(clave);
            if (traduccion && traduccion !== el.placeholder) {
                el.placeholder = traduccion;
            }
        });

        // ============ ACTUALIZAR TÍTULOS ============
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const clave = el.getAttribute('data-i18n-title');
            const traduccion = this.t(clave);
            if (traduccion && traduccion !== el.title) {
                el.title = traduccion;
            }
        });

        // ============ ACTUALIZAR VALORES DE INPUTS ============
        document.querySelectorAll('[data-i18n-value]').forEach(el => {
            const clave = el.getAttribute('data-i18n-value');
            const traduccion = this.t(clave);
            if (traduccion && traduccion !== el.value) {
                el.value = traduccion;
            }
        });

        // ============ ACTUALIZAR DATASET ============
        document.querySelectorAll('[data-i18n-dataset]').forEach(el => {
            const clave = el.getAttribute('data-i18n-dataset');
            const traduccion = this.t(clave);
            if (traduccion) {
                el.dataset.i18nTranslated = traduccion;
            }
        });

        // ============ ACTUALIZAR EL TÍTULO DE LA PÁGINA ============
        const titleClave = document.querySelector('title')?.getAttribute('data-i18n');
        if (titleClave) {
            const traduccion = this.t(titleClave);
            if (traduccion) {
                document.title = traduccion;
            }
        }

        // ============ ACTUALIZAR EL SELECTOR DE IDIOMA ============
        this._actualizarSelectorIdioma(idioma);
        
        // ============ DISPARAR EVENTO PERSONALIZADO ============
        document.dispatchEvent(new CustomEvent('idiomaCambiado', { 
            detail: { idioma: idioma } 
        }));

        console.log(`✅ Idioma aplicado correctamente: ${idioma}`);
    }

    // Actualizar selector de idioma visualmente
    _actualizarSelectorIdioma(idioma) {
        document.querySelectorAll('.idioma-option, .idioma-card').forEach(el => {
            const elIdioma = el.dataset.idioma || el.getAttribute('data-idioma');
            if (elIdioma) {
                el.classList.toggle('active', elIdioma === idioma);
                el.classList.toggle('seleccionado', elIdioma === idioma);
            }
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

// ============ INSTANCIA GLOBAL ============
const i18n = new I18n();

// ============ FUNCIONES GLOBALES ============
function __(clave, params = {}) {
    return i18n.t(clave, params);
}

function cambiarIdioma(idioma) {
    const resultado = i18n.cambiarIdioma(idioma);
    if (resultado) {
        // Mostrar notificación
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: '🌍 Idioma cambiado',
                text: `La página está ahora en ${i18n.traducciones[idioma]?.nombre || idioma}`,
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#3b82f6',
                timer: 2000,
                showConfirmButton: false
            });
        }
    }
    return resultado;
}

function getIdiomaActual() {
    return i18n.getIdiomaActual();
}

function getIdiomasDisponibles() {
    return i18n.getIdiomasDisponibles();
}

// ============ INICIALIZACIÓN AUTOMÁTICA ============
document.addEventListener('DOMContentLoaded', async function() {
    // Cargar traducciones
    await i18n.cargarTraducciones();
    
    // Aplicar idioma guardado
    const idiomaGuardado = localStorage.getItem('allin_idioma') || 'es';
    i18n.aplicarIdioma(idiomaGuardado);
    
    console.log(`🌍 ALLIN YACHAY - Idioma actual: ${idiomaGuardado}`);
});

// ============ EXPORTAR PARA MÓDULOS ============
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { i18n, __, cambiarIdioma, getIdiomaActual, getIdiomasDisponibles };
}