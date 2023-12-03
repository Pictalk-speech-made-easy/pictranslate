import Keycloak, { KeycloakInitOptions } from 'keycloak-js';
const keycloakConfig = {
        url: 'https://auth.picmind.org',
        realm: 'master',
        clientId: 'pictranslate',
};

const initOptions: KeycloakInitOptions = {
        flow: 'implicit',
        onLoad: 'check-sso',
};

export const useAuth = defineStore('authentication', {
        state: () => ({
                davUsername: undefined as string | undefined,
                davPassword: undefined as string | undefined,
                isAuthenticated: false,
                keycloak: undefined as Keycloak | undefined,
        }),
        persist: {
                storage: persistedState.localStorage,
        },
        actions: {
                async login() {
                        if (this.isAuthenticated || !navigator.onLine) {
                                return;
                        } else {
                                this.keycloak = new Keycloak(keycloakConfig);
                                this.isAuthenticated = await this.keycloak.init(initOptions);
                                // TODO Popup showing login advantages
                                //keycloak.login(); // Redirect to the login page if needed
                        }
                },
                async logout() {
                        if (this.isAuthenticated && navigator.onLine && this.keycloak) {
                                console.debug("logging out of keycloak");
                                await this.keycloak.logout();
                        } else {
                                return;
                        }
                },
                getAuthenticated() {
                        return this.isAuthenticated;
                }
        },
});

