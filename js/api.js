/**
 * Cliente HTTP para Google Apps Script
 */
const ApiClient = {
    async post(payload, options = {}) {
        const { requiresAuth = false, timeout = 15000 } = options;

        if (requiresAuth) {
            const session = SessionManager.get();
            if (!session || !session.token) {
                throw new Error('No hay sesión activa');
            }
            payload.token = session.token;
            payload.userId = session.userId;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(CONFIG.BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            return data;

        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') throw new Error('Tiempo de espera agotado');
            if (error.message === 'Failed to fetch') throw new Error('Sin conexión con el servidor');
            throw error;
        }
    },
};
