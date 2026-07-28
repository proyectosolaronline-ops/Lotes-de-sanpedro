/**
 * Manejo de sesión - Fraccionamiento San Pedro
 */
const SessionManager = {
    KEYS: {
        TOKEN: 'lotes_token',
        USER_ID: 'lotes_user_id',
        ROLE: 'lotes_role',
        USER_NAME: 'lotes_user_name',
        BACKEND: 'lotes_backend',
    },

    save({ token, userId, role, name }) {
        localStorage.setItem(this.KEYS.TOKEN, token);
        localStorage.setItem(this.KEYS.USER_ID, userId);
        localStorage.setItem(this.KEYS.ROLE, role);
        localStorage.setItem(this.KEYS.USER_NAME, name || '');
        localStorage.setItem(this.KEYS.BACKEND, CONFIG.BACKEND_URL);
    },

    get() {
        const token = localStorage.getItem(this.KEYS.TOKEN);
        if (!token) return null;
        return {
            token,
            userId: localStorage.getItem(this.KEYS.USER_ID),
            role: localStorage.getItem(this.KEYS.ROLE),
            name: localStorage.getItem(this.KEYS.USER_NAME),
        };
    },

    isActive() {
        return !!this.get();
    },

    getRole() {
        return localStorage.getItem(this.KEYS.ROLE);
    },

    destroy() {
        Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    },
};
