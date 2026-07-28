/**
 * Configuración - Fraccionamiento San Pedro
 * Sistema de Venta de Lotes
 */
const CONFIG = {
    APP_NAME: 'Fraccionamiento San Pedro',
    APP_PREFIX: 'lotes',

    // ✅ URL REAL del Google Apps Script
    BACKEND_URL: (() => {
        const params = new URLSearchParams(location.search);
        return params.get('backend')
            || localStorage.getItem('lotes_backend')
            || 'https://script.google.com/macros/s/AKfycbyEsQ878-r8KeLeZ4dOvHPN0bCohS23G-KM2ckDy-MjWLsyr8tvN2jPNiaTQycG3Ws/exec';
    })(),

    // Tiempos de sesión
    SESSION_TIMEOUT: 30 * 60 * 1000,        // 30 minutos
    INACTIVITY_WARNING: 28 * 60 * 1000,      // Aviso a los 28 min
    MAGIC_CODE_LENGTH: 8,
    MAGIC_CODE_TTL_MINUTES: 15,

    // Páginas del sistema
    PAGES: {
        LOGIN: 'index.html',
        ADMIN: 'admin.html',
    },
};
