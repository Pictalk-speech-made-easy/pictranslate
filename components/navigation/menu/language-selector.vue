<template>
    <details class="dropdown no-animation" ref="languageSelector">
        <summary class="m-1 btn bg-base-100 w-full rounded-lg justify-start" @click="dropdownState = !dropdownState">
            <img :src="getFlag(options.locale)" class="h-4 rounded-sm" />
            {{ getLanguageName(options.locale) }}
            <label class="swap swap-rotate ml-auto pointer-events-none">
                <input v-model="dropdownState" type="checkbox" aria-label="togglePageTheme" />
                <svg class="swap-off h-6" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path class="fill-gray-600 dark:fill-gray-200" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z" />
                </svg>
                <svg class="swap-on h-6" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path class="fill-gray-600 dark:fill-gray-200" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6l1.41 1.41Z" />
                </svg>
            </label>
        </summary>
        <div class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-lg w-full">
            <div v-for="localeISO in (options.availableLocales.filter((locale) => locale !== options.locale) as typeof options.availableLocales[number])">
                <button @click="setLanguage(localeISO)" class="btn btn-ghost btn-sm w-full justify-start">
                    <img :src="getFlag(localeISO)" class="h-4 rounded-sm" />
                    {{ getLanguageName(localeISO) }}
                </button>
            </div>
        </div>
    </details>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
const { locale } = useI18n();
const options = useOptions();
const languageSelector = ref(null);
const dropdownState = ref(false);
onBeforeMount(() => {
    locale.value = options.locale;
});
function setLanguage(localeISO: 'en' | 'fr') {
    options.locale = localeISO;
    locale.value = localeISO;
    dropdownState.value = false;
    if (!languageSelector.value) return;
    (languageSelector.value as any).open = false;

}
function getFlag(path: string): string {
    const flags = import.meta.glob('~/lang/flags/bitmap/*', {
        eager: true,
        import: 'default',
    })
    // @ts-expect-error: wrong type info
    return flags['/lang/flags/bitmap/' + path + '.png'];
}
function getLanguageName(languageCode: string) {
        const languageNames = new Intl.DisplayNames([languageCode], { type: 'language' });
        return languageNames.of(languageCode);
}
</script>