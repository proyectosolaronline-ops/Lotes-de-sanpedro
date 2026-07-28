/**
 * Inicialización del sistema
 */
const App = {
    async init() {
        if (SessionManager.isActive()) {
            const isValid = await this.validateSession();
            if (isValid) {
                if (window.location.pathname.includes('index.html') ||
                    window.location.pathname === '/' ||
                    window.location.pathname.endsWith('/')) {
                    this.goToAdmin();
                }
                return;
            } else {
                SessionManager.destroy();
            }
        }

        if (window.location.pathname.includes('admin.html')) {
            if (!SessionManager.isActive()) {
                window.location.href = CONFIG.PAGES.LOGIN;
            }
        }
    },

    async validateSession() {
        try {
            const response = await ApiClient.post(
                { action: 'session.validate' },
                { requiresAuth: true }
            );
            return response.ok === true;
        } catch {
            return false;
        }
    },

    handleLoginSuccess(data) {
        SessionManager.save({
            token: data.token,
            userId: data.userId,
            role: data.role,
            name: data.name,
        });

        InactivityTimer.start(
            () => this.showInactivityWarning(),
            () => AuthService.logout()
        );

        this.goToAdmin();
    },

    goToAdmin() {
        window.location.href = CONFIG.PAGES.ADMIN;
    },

    showInactivityWarning() {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;';
        overlay.innerHTML = `
            <div style="background:#fff;padding:24px;border-radius:4px;text-align:center;max-width:320px;font-family:Inter,sans-serif;">
                <p style="font-size:18px;margin-bottom:8px;">⏳ Sesión por expirar</p>
                <p style="font-size:14px;color:#666;margin-bottom:16px;">Tu sesión expirará en 2 minutos por inactividad.</p>
                <button id="extendSessionBtn" style="padding:10px 20px;background:#1B2A4A;color:#fff;border:none;border-radius:3px;cursor:pointer;font-weight:600;">Continuar sesión</button>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('extendSessionBtn').addEventListener('click', function() {
            overlay.remove();
            InactivityTimer.extend(
                () => App.showInactivityWarning(),
                () => AuthService.logout()
            );
        });
    },
};

window.addEventListener('load', () => App.init());
