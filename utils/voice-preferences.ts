interface VoicePreferences {
        [os: string]: {
                default?: { [locale: string]: string }; // default setting for OSes that should ignore the browser, but consider locale
                [browser: string]: { [locale: string]: string } | undefined; // the name for each locale
        } | undefined;
}

export const preferedVoices: VoicePreferences = {
        "Windows": {
                default: {
                        'fr' : "Microsoft Julie - French (France)",
                        'en' : "Microsoft Mark - English (United States)",
                },
                "Chrome": {
                        'fr' : "Google français",
                        'en' : "Google UK English Female",
                },
        },
        "macOS": {
                "Safari": {
                        'en': "Samantha",
                        'fr': "Amelie",
                },
        },
        // other OS...
        "": {
                "": undefined, // if OS and browser are not identified or irrelevant
        }
};
