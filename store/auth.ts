import Keycloak, { KeycloakInitOptions, KeycloakProfile } from 'keycloak-js';
import axios from 'axios';
const keycloakConfig = {
        url: 'https://auth.picmind.org',
        realm: 'master',
        clientId: 'pictime',
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
                                // User is authenticated
                                if (this.davUsername === undefined || this.davPassword === undefined) {
                                        const userProfile: KeycloakProfile = await keycloak.loadUserProfile()
                                        if (userProfile.email && userProfile.attributes.pictime_password) {
                                                this.davUsername = userProfile.email;
                                                this.davPassword = userProfile.attributes.pictime_password;
                                        } else {
                                                const response = await axios.post('https://api.pictime.org', undefined, {
                                                        headers: {
                                                                "Authorization": `Bearer ${keycloak.token}`,
                                                        },
                                                });
                                                if (response.status === 201) {
                                                        // Create CalDAV account with the parameters
                                                        this.davUsername = userProfile.email!;
                                                        this.davPassword = response.data.pictime_password;
                                                }
                                        }
                                }
                        } else {
                                // User is not authenticated
                                keycloak.login(); // Redirect to the login page if needed
                        }
                },
                async logout() {
                        console.log("logging out of keycloak");
                        await keycloak.logout();
                        this.davUsername = '';
                        this.davPassword = '';
                },
        },
});

