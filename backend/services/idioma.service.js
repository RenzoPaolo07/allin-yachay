// backend/services/idioma.service.js
const traducciones = require('../data/traducciones.json');
const fs = require('fs');
const path = require('path');

class IdiomaService {
    constructor() {
        this.idiomasDisponibles = {
            'es': { nombre: 'Español', flag: '🇪🇸', nativo: 'Español' },
            'qu': { nombre: 'Quechua', flag: '🇵🇪', nativo: 'Runasimi' },
            'ay': { nombre: 'Aymara', flag: '🇵🇪', nativo: 'Jaqi aru' },
            'as': { nombre: 'Asháninka', flag: '🇵🇪', nativo: 'Ampari' },
            'en': { nombre: 'English', flag: '🇬🇧', nativo: 'English' }
        };
        this.idiomaActual = 'es';
        this.traduccionesCache = traducciones;
    }

    // Obtener todos los idiomas disponibles
    getIdiomas() {
        return Object.entries(this.idiomasDisponibles).map(([key, value]) => ({
            codigo: key,
            ...value
        }));
    }

    // Obtener traducción en un idioma específico
    traducir(texto, idioma = 'es') {
        const idiomaData = this.traduccionesCache[idioma];
        if (!idiomaData) return texto;

        const traduccion = idiomaData.traducciones[texto];
        return traduccion || texto;
    }

    // Obtener todas las traducciones de un idioma
    getTraducciones(idioma = 'es') {
        const idiomaData = this.traduccionesCache[idioma];
        if (!idiomaData) return {};

        return {
            nombre: idiomaData.nombre,
            flag: idiomaData.flag,
            traducciones: idiomaData.traducciones
        };
    }

    // Cambiar idioma actual
    setIdiomaActual(idioma) {
        if (this.idiomasDisponibles[idioma]) {
            this.idiomaActual = idioma;
            return true;
        }
        return false;
    }

    // Obtener idioma actual
    getIdiomaActual() {
        return this.idiomaActual;
    }

    // Traducir texto con variables
    traducirConVariables(texto, variables = {}, idioma = 'es') {
        let traduccion = this.traducir(texto, idioma);
        for (const [key, value] of Object.entries(variables)) {
            traduccion = traduccion.replace(`{${key}}`, value);
        }
        return traduccion;
    }

    // Agregar nueva traducción (para expansión futura)
    agregarTraduccion(idioma, clave, valor) {
        if (!this.traduccionesCache[idioma]) {
            this.traduccionesCache[idioma] = {
                nombre: this.idiomasDisponibles[idioma]?.nombre || idioma,
                flag: this.idiomasDisponibles[idioma]?.flag || '🏳️',
                traducciones: {}
            };
        }
        this.traduccionesCache[idioma].traducciones[clave] = valor;
        
        // Guardar en archivo (opcional)
        try {
            fs.writeFileSync(
                path.join(__dirname, '../data/traducciones.json'),
                JSON.stringify(this.traduccionesCache, null, 2)
            );
        } catch (error) {
            console.error('Error guardando traducciones:', error);
        }
        return true;
    }

    // Obtener traducción para el frontend (API)
    getTraduccionesFrontend(idioma = 'es') {
        const data = this.getTraducciones(idioma);
        return {
            idioma: idioma,
            nombre: data.nombre,
            flag: data.flag,
            traducciones: data.traducciones
        };
    }

    // Traducir contenido educativo a lenguas originarias
    async traducirContenidoEducativo(texto, idiomaOrigen = 'es', idiomaDestino = 'qu') {
        // Simulación de traducción con IA
        // En producción, aquí se conectaría con una API de traducción (Google Translate, DeepL, etc.)
        const traduccionesBase = this.traduccionesCache[idiomaDestino];
        if (!traduccionesBase) return texto;

        // Buscar palabras clave en el texto
        let textoTraducido = texto;
        const palabras = texto.split(' ');
        
        for (const palabra of palabras) {
            const palabraLimpia = palabra.replace(/[.,!?]/g, '');
            const traduccion = traduccionesBase.traducciones[palabraLimpia.toLowerCase()];
            if (traduccion) {
                textoTraducido = textoTraducido.replace(palabra, traduccion);
            }
        }

        return textoTraducido;
    }

    // Obtener estadísticas de uso de idiomas
    getEstadisticasIdiomas() {
        return {
            total_idiomas: Object.keys(this.idiomasDisponibles).length,
            idiomas: this.getIdiomas(),
            idioma_actual: this.idiomaActual,
            idiomas_originarios: ['qu', 'ay', 'as'].filter(id => this.idiomasDisponibles[id])
        };
    }
}

module.exports = new IdiomaService();