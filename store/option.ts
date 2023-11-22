import { MiniDatabaseInformations } from "./store-types";

export const useOptions = defineStore('options', {
    state: () => ({
        theme: 'light' as 'light' | 'dark',
        availableLocales: ['fr', 'en'],
        locale: 'fr' as 'fr' | 'en',
        TTSVoice: undefined as SpeechSynthesisVoice | undefined,
        TTSRate: 1 as number,
        TTSPitch: 1 as number,
        sexFilter: false as Boolean,
        violenceFilter: false as Boolean,
        simplifyTranslation: false as Boolean,
    }),
    persist: {
        storage: persistedState.localStorage,
    },
    actions: {
    },
});

