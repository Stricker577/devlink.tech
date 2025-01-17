import Vue from 'vue';
import createAuth0Client from '@auth0/auth0-spa-js';
import { getUser } from '@/services/UserService';


let instance;

export const getInstance = () => instance;

export const Auth0 = () => {
    if (instance) {
        return instance;
    }

    instance = new Vue({
        data() {
            return {
                loading: true,
                isAuthenticated: false,
                user: {},
                auth0Client: null,
                popupOpen: false,
                error: null
            };
        },
        async created() {
            this.auth0Client = await createAuth0Client({
                domain: process.env.VUE_APP_AUTH0_DOMAIN,
                client_id: process.env.VUE_APP_AUTH0_CLIENT_ID,
                audience: process.env.VUE_APP_AUTH0_API_AUDIENCE,
                redirect_uri: `${process.env.VUE_APP_BASE_URL}/authorized`
            });

            try {
                this.isAuthenticated = await this.auth0Client.isAuthenticated();
                if (this.isAuthenticated) {
                    await this._setUserState();
                }
            } catch (error) {
                this.logout()
            } finally {
                this.loading = false;
            }
        },
        methods: {
            /** Handles the callback when logging in using a redirect */
            async handleRedirectCallback(url) {
                try {
                    await this.auth0Client.handleRedirectCallback(url);
                    this.isAuthenticated = await this.auth0Client.isAuthenticated();
                    if (this.isAuthenticated) {
                        await this._setUserState();
                    }
                } catch (error) {
                    this.logout();
                } finally {
                    this.loading = false;
                }
            },
            async getTokenSilently() {
                return await this.auth0Client.getTokenSilently();
            },
            /** Authenticates the user using the redirect method */
            login() {
                return this.auth0Client.loginWithRedirect();
            },
            /** Logs the user out and removes their session on the authorization server */
            logout() {
                this.loading = true;
                return this.auth0Client.logout({ returnTo: `${process.env.VUE_APP_BASE_URL}/login` });
            },
            async _setUserState() {
                this.user = await this.auth0Client.getUser();

                const { data } = await getUser('current');
                const { auth0_id, email, ...user } = data;
                if (this.user.sub !== auth0_id) {
                    throw new Error('Failed to get correct user.')
                }
                this.user = { ...this.user, ...user }
            }
        }
    });

    return instance;
};
