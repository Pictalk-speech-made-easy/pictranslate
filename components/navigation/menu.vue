<template>
    <div class="menu  h-screen grid overflow-clip">
        <label tabindex="0" for="menu-drawer" class="btn btn-ghost btn-circle drawer-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path class="fill-primary"
                    d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12q0-.2.063-.375T4.7 11.3l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12q0 .425-.288.713T19 13z" />
            </svg>
        </label>
        <div class="flex flex-col overflow-x-hidden overflow-y-auto">
            <div class="divider mt-0">{{ $t('menu.language.label') }} & {{ $t('menu.theme.label') }}</div>
            <LanguageSelector class="my-4" />
            <ThemeSwitch class="my-4" />
            <div class="divider mt-0">{{ $t('menu.filters.label') }}</div>
            <SearchFiltersSelectors class="my-4" />
            <div class="divider mt-0">{{ $t('menu.translation.label') }}</div>
            <div class="my-4">
                <SimpleTranslation />
                <PrepositionSelector />
            </div>
            <div class="mt-auto">
                <LicenceViewer class="my-4" />
                <Versioning />
                <button @click="logout()" class="btn btn-ghost justify-start">
                    <svg class="h-6 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>{{ $t('menu.logout') }}</title>
                        <path
                            d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                    </svg>
                    <div v-if="isAuthenticated">{{ $t('menu.logout') }}</div>
                    <div v-else>{{ $t('menu.erase') }}</div>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import Versioning from './menu/versioning.vue';
import LanguageSelector from './menu/language-selector.vue';
import ThemeSwitch from './menu/theme-switch.vue';
import SearchFiltersSelectors from './menu/search-filters-selectors.vue';
import SimpleTranslation from './menu/simple-translation.vue';
import LicenceViewer from './menu/licences-viewer.vue';
import PrepositionSelector from './menu/prepositions-selector.vue';
import UpdatePwa from './menu/update-pwa.vue';
import { useAuth } from "~/store/auth";
const { logout, isAuthenticated } = useAuth();
</script>