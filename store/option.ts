export const useOptions = defineStore('options', {
    state: () => ({
        theme: 'light' as 'light' | 'dark',
        availableLocales: ['fr', 'en'],
        locale: 'fr' as 'fr' | 'en',
        TTSVoice: undefined as SpeechSynthesisVoice | undefined,
        TTSRate: 1,
        TTSPitch: 1,
        sexFilter: false,
        violenceFilter: false,
    }),
    persist: {
        storage: persistedState.localStorage,
    },
    actions: {
    },
});

