/**
 * Control de inactividad
 */
const InactivityTimer = {
    warningTimer: null,
    logoutTimer: null,

    start(onWarning, onLogout) {
        this.stop();
        this.reset(onWarning, onLogout);
        const events = ['click', 'touchstart', 'keypress', 'scroll', 'mousemove'];
        events.forEach(event => {
            document.addEventListener(event, () => this.reset(onWarning, onLogout), true);
        });
    },

    reset(onWarning, onLogout) {
        clearTimeout(this.warningTimer);
        clearTimeout(this.logoutTimer);
        this.warningTimer = setTimeout(() => {
            if (onWarning) onWarning();
            this.logoutTimer = setTimeout(() => {
                if (onLogout) onLogout();
            }, CONFIG.SESSION_TIMEOUT - CONFIG.INACTIVITY_WARNING);
        }, CONFIG.INACTIVITY_WARNING);
    },

    extend(onWarning, onLogout) {
        this.reset(onWarning, onLogout);
    },

    stop() {
        clearTimeout(this.warningTimer);
        clearTimeout(this.logoutTimer);
    },
};
