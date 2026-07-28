/**
 * Servicio de Autenticación - Venta de Lotes
 *
 * FLUJO 1: Dueño → Código mágico por email
 * FLUJO 2: Vendedor → Email + Contraseña + ID
 */
const AuthService = {
    /**
     * DUEÑO - Paso 1: Solicitar código mágico
     */
    async requestOwnerCode(email) {
        if (!email || !email.includes('@')) {
            return { success: false, error: 'Ingresa un email válido' };
        }
        try {
            const response = await ApiClient.post({
                action: 'owner.request.code',
                email: email,
            });
            if (!response.ok) {
                return { success: false, error: response.error || 'Email no encontrado' };
            }
            return {
                success: true,
                data: { userId: response.userId },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * DUEÑO - Paso 2: Verificar código mágico
     */
    async verifyOwnerCode(email, code, userId) {
        if (!code || code.length < CONFIG.MAGIC_CODE_LENGTH) {
            return { success: false, error: 'Ingresa el código completo de 8 dígitos' };
        }
        try {
            const response = await ApiClient.post({
                action: 'owner.verify.code',
                email: email,
                code: code.toUpperCase(),
                userId: userId,
            });
            if (!response.ok || !response.token) {
                return { success: false, error: response.error || 'Código incorrecto o expirado' };
            }
            return {
                success: true,
                data: {
                    token: response.token,
                    userId: response.userId || userId,
                    role: 'owner',
                    name: response.name || 'Dueño',
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * VENDEDOR - Login tradicional
     */
    async vendedorLogin(userId, email, password) {
        if (!userId || !email || !password) {
            return { success: false, error: 'Todos los campos son obligatorios' };
        }
        try {
            const response = await ApiClient.post({
                action: 'staff.login',
                userId: userId,
                email: email,
                password: password,
            });
            if (!response.ok || !response.token) {
                return { success: false, error: response.error || 'Credenciales inválidas' };
            }
            return {
                success: true,
                data: {
                    token: response.token,
                    userId: response.userId || userId,
                    role: 'vendedor',
                    name: response.name || 'Vendedor',
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Cerrar sesión
     */
    logout() {
        SessionManager.destroy();
        window.location.href = CONFIG.PAGES.LOGIN;
    },
};
