<template>
    <div id="app-navbar" class="navbar backdrop-blur-sm bg-base-100 bg-opacity-80 px-1 py-0 top-0">
        <div class="navbar-center">
            <NuxtImg
                src="/images/logo-full.png"
                sizes="30vw sm:30vw md:300px"
                class="rounded"
            />
        </div>
        <select v-model="locale" class="select">
            <option value="en">{{ getEmoji('en-US') }}</option>
            <option value="fr">{{ getEmoji('fr-FR') }}</option>
        </select>
    </div>
</template>
<script setup lang="ts">
import { getEmoji } from '~/utils/emoji';
const { locale } = useI18n()
</script>