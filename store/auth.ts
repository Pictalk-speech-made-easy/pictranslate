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
                        

                        // Use Dexie to clear the database
                        await useMiniPictohubDatabase().deleteDatabase();
                        await useHistoryDatabase().deleteDatabase();
                        await useStimulusDatabase().deleteDatabase();

                        usePreferences().$reset();
                        useMiniPictohubDatabase().$reset();
                        useOptions().$reset();
                        useHistoryDatabase().$reset();
                        useStimulusDatabase().$reset();
                        // Clear all caches
                        await caches.delete('images-pictohub');

                        if (this.isAuthenticated && navigator.onLine && this.keycloak) {
                                console.debug("logging out of keycloak");
                                await this.keycloak.logout();
                        }

                        this.$reset();
                },
                getAuthenticated() {
                        return this.isAuthenticated;
                }
        },
});

