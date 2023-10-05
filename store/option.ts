export const useOptions = defineStore('options', {
    state: () => ({
        theme: 'light' as 'light' | 'dark',
        locale: 'fr',
    }),
    persist: {
        storage: persistedState.localStorage,
    },
    actions: {
    },
});

