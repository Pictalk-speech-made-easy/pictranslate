<template>
    <div class="text-sm font-light font-mono px-4">
        <p>app : {{ version }}</p>
    </div>
    <button class="btn btn-primary btn-ghost underline justify-start lowercase" @click="openModal()">{{ $t('menu.debug.label') }}</button>
</template>
<script setup lang="ts">
import { useStore } from '~/store/index';
const store = useStore();
const version = useRuntimeConfig().public.clientVersion;
function openModal() {
    window.history.pushState('popup', "");
    store.modal.debug = true;
}
</script>