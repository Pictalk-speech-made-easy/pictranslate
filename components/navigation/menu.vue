<template>
    <div class="menu menu-compact mt-16 h-full">
        <div class="flex flex-col h-full rounded-lg p-2">
            <LanguageSelector class="my-4" />
            <ThemeSwitch class="my-4" />
            <div class="divider mb-0 mt-auto"></div>
            <button @click="logout()" class="btn btn-ghost justify-start">
                <svg class="h-6 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>{{ $t('menu.logout') }}</title>
                    <path
                        d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                </svg> {{ $t('menu.logout') }}
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import LanguageSelector from './menu/language-selector.vue';
import ThemeSwitch from './menu/theme-switch.vue';
import { useOptions } from '~/store/option';
import { useAuth } from "~/store/auth";
const { logout } = useAuth();
const options = useOptions();
</script>