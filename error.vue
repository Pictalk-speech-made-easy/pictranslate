<template>
    <div class="h-screen flex flex-col items-center justify-center bg-gray-100">
        <img class="max-h-64 object-contain flex mx-auto" src="~/assets/error.webp">
          <h2 class="card-title">{{ error.statusCode }}</h2>
          <p>{{ $t('error.crash') }}</p>
          <br>
          <button class="btn btn-primary" @click="emptyCache()">{{ $t('menu.debug.clear_cache') }}</button>
    </div>
  </template>

<script setup lang="ts">
import { useStore } from '~/store';
import { useOptions } from '~/store/option';
import type { NuxtError } from '#app'

const store = useStore();
const options = useOptions();

const props = defineProps({
  error: Object as () => NuxtError
})


async function emptyCache() {
    store.$reset();
    options.$reset();

    if ('caches' in window) {
        const names = await window.caches.keys();
        await Promise.all(names.map(name => window.caches.delete(name)));
    }

    if ('localStorage' in window) {
        window.localStorage.clear();
    }

    window.location.reload();
}
</script>

