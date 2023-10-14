import Keycloak, { KeycloakInitOptions, KeycloakProfile } from 'keycloak-js';
const keycloakConfig = {
        url: 'https://auth.picmind.org',
        realm: 'master',
        clientId: 'pictranslate',
};
const keycloak = new Keycloak(keycloakConfig);
const initOptions = {
        flow: 'implicit',
        onLoad: 'check-sso',
};
const authenticated = keycloak.init(initOptions as KeycloakInitOptions);

export const useAuth = defineStore('authentication', {
        state: () => ({
                davUsername: undefined as string | undefined,
                davPassword: undefined as string | undefined,
        }),
        persist: {
                storage: persistedState.localStorage,
        },
        actions: {
                async login() {
                        if (await authenticated) {
                                return;
                        } else {
                                return;
                                // TODO Popup showing login advantages
                                //keycloak.login(); // Redirect to the login page if needed
                        }
                },
                async logout() {
                        if (await authenticated) {
                                console.log("logging out of keycloak");
                                await keycloak.logout();
                        } else {
                                return;
                        }
                },
                async getAuthenticated() {
                        return authenticated;
                }
        },
});

