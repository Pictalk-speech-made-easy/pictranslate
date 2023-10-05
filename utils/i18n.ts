import { I18n } from "@nuxtjs/i18n/dist/runtime/composables";

const locale_iso = { "en": "en-US", "fr": "fr-FR" };

export const localeIso = (locale: string) => {
    return locale_iso[locale];
}
