<template>
  <html data-theme="light" class="h-screen bg-white flex justify-center items-center overflow-x-hiden">
  <div class="container prose prose-lg lg:prose-xl px-2">
          <h1 class="text-center">{{ $t('error.crash', { 'error': error?.statusCode }) }}</h1>
          <div class="flex flex-col items-center md:flex-row justify-center not-prose gap-2">
                  <img class="max-h-64 p-4 object-contain" src="~/assets/error.webp">
                  <div
                          class="hidden md:block mockup-code max-w-full max-h-64 px-4 overflow-y-auto bg-gray-900 text-base shadow-xl my-8">
                          <button @click="copyError()" class="btn btn-circle btn-ghost absolute top-1 right-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-gray-100" viewBox="0 0 24 24">
                                          <path
                                                  d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z" />
                                  </svg>
                          </button>
                          <pre v-for="key of Object.keys(error as any).filter((err) => err != 'cause')"
                                  data-prefix=">"
                                  class="text-error"><code>{{ key }} : {{ (error as any)[key] }}</code></pre>
                  </div>
          </div>
          <p class="text-sm text-center">{{ $t('error.automatic_report') }}</p>
          <div class="flex items-end gap-1 mt-12 justify-center w-11/12 mx-auto">
                  <button class="btn btn-lg btn-primary flex-1 max-w-lg text-xl h-full" @click="emptyCache()">{{
                  $t('error.clear_cache.label') }}</button>
                  <div class="tooltip tooltip-bottom before:bg-gray-200 before:text-black before:w-64 before:-translate-x-56"
                          :data-tip="$t('error.clear_cache.tooltip')">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                  class="stroke-info shrink-0 w-6 h-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                  </div>
          </div>
  </div>

  </html>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import { onMounted } from 'vue';

onMounted(() => {
  const HTML = document.querySelector("html");
  if (HTML) {
          HTML.setAttribute("data-theme", "light");
  }
});
const props = defineProps({
  error: Object as () => NuxtError
})
function copyError() {
  const keys = Object.keys(props.error as any)
  const error = keys.map(key => `${key} : ${JSON.stringify((props.error as any)[key], null, 2)}`).join('\n')
  navigator.clipboard.writeText(error);
}
async function emptyCache() {
  if ('caches' in window) {
          const names = await window.caches.keys();
          await Promise.all(names.map(name => window.caches.delete(name)));
  }
  if ('localStorage' in window) {
          window.localStorage.clear();
  }
  const dbNames = await window.indexedDB.databases();
  await Promise.all(dbNames.map(db => window.indexedDB.deleteDatabase(db.name ?? '')));
  window.location.href = '/';
}
</script>