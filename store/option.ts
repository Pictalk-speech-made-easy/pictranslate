import { ImageSource, type MiniDatabaseInformations } from "./store-types";

export const availableLocales = ['fr', 'en', 'es'] as const;
export const useOptions = defineStore('options', {
    state: () => ({
        theme: 'light' as 'light' | 'dark',
        interfaceSize: 'normal' as 'normal' | 'big' | 'xl',
        availableLocales: availableLocales,
        locale: 'fr' as typeof availableLocales[number],
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

