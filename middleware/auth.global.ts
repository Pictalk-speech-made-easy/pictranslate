
import { useAuth } from "~/store/auth";

export default defineNuxtRouteMiddleware(async () => {
    const AuthStore = useAuth();
    await AuthStore.login();
});