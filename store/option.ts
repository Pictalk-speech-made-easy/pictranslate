import { ImageSource, type MiniDatabaseInformations } from "./store-types";

export const useOptions = defineStore('options', {
    state: () => ({
        theme: 'light' as 'light' | 'dark',
        availableLocales: ['fr', 'en', 'es'],
        locale: 'fr' as 'fr' | 'en' | 'es',
        TTSVoice: undefined as SpeechSynthesisVoice | undefined,
        TTSRate: 1 as number,
        TTSPitch: 1 as number,
        sexFilter: true as Boolean,
        violenceFilter: true as Boolean,
        simplifyTranslation: true as Boolean,
        removePrepositions: true as Boolean,
        preferredSources: 'arasaac' as typeof ImageSource[number],
    }),
    persist: {
        storage: persistedState.localStorage,
    },
    actions: {
    },
});

