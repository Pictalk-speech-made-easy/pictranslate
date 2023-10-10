<template>
    <div class="menu menu-compact mt-16 h-full">
        <div class="divider my-1"></div>
        <select v-model="locale" class="select bg-indigo-100 dark:bg-indigo-900">
            <option value="en">{{ getEmoji('en-US') }}</option>
            <option value="fr">{{ getEmoji('fr-FR') }}</option>
        </select>
        <div class="flex flex-col rounded-lg p-2">
            <button @click="logout()" class="btn btn-ghost btn-circle">
                <svg class="h-6 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>logout</title>
                    <path
                        d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                </svg>
            </button>
        </div>
        <div class="tooltip tooltip-bottom mt-1 flex w-40" data-tip="Changer de thème">
            <label class="swap swap-rotate ml-2">
                <input v-model="toggle" type="checkbox" class="toggle" aria-label="togglePageTheme" />
                
                <!-- sun icon -->
                <svg class="swap-off -mt-2 ml-14 fill-yellow-400 w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z">
                    </path>
                </svg>

                <!-- moon icon -->
                <svg class="swap-on -mt-2 ml-14 fill-primary w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z">
                    </path>
                </svg>
            </label>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
import { useAuth } from "~/store/auth";
import { getEmoji } from '~/utils/emoji';
const { locale } = useI18n();
const { logout } = useAuth();
const toggle = ref(false);
const options = useOptions();
watch(toggle, () => {
    switchColorTheme();
});
function switchColorTheme() {
    const HTML = document.querySelector("html.bg-fixed");  // else it grabs the 'devtools' html element from Nuxt3
    if (HTML) {
        if (toggle.value) {
            options.theme = 'dark';
            HTML.setAttribute("data-theme", "dark");
            HTML.classList.add('dark');
        } else {
            options.theme = 'light';
            HTML.setAttribute("data-theme", "light");
            HTML.classList.remove('dark');
        }
    }

}
</script>