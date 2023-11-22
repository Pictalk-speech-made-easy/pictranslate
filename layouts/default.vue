<template>
    <html lang="fr"
      class="bg-fixed min-h-screen">
    <body>
      <slot />
    </body>
      <div
        v-if="$pwa?.offlineReady || $pwa?.needRefresh"
        class="pwa-toast"
        role="alert"
      >
        <div class="message">
          <span v-if="$pwa.offlineReady">
            App ready to work offline
          </span>
          <span v-else>
            New content available, click on reload button to update.
          </span>
        </div>
        <button
          v-if="$pwa.needRefresh"
          @click="$pwa.updateServiceWorker()"
        >
          Reload
        </button>
        <button @click="$pwa.cancelPrompt()">
          Close
        </button>
      </div>
      <div
        v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
        class="pwa-toast"
        role="alert"
      >
        <div class="message">
          <span>
            Install PWA
          </span>
        </div>
        <button @click="$pwa.install()">
          Install
        </button>
        <button @click="$pwa.cancelInstall()">
          Cancel
        </button>
      </div>
    </html>
  </template>
  <script setup lang="ts">
  import { onMounted } from "vue";
  const { $pwa } = useNuxtApp()
  import { useOptions } from "~/store/option";
  const options = useOptions();
  const theme = options.theme === "dark" || 'light' ? options.theme : "light";
  onMounted(() => {
    const HTML = document.querySelector("html.bg-fixed"); // else it grabs the 'devtools' html element from Nuxt3
    if (HTML) {
      HTML.setAttribute("data-theme", theme);
      if (theme == "dark") {
        HTML.classList.add("dark");
      } else {
        HTML.classList.remove("dark");
      }
    }
  
  });
  </script>
  <style>
  :root {
    --accent: 124, 58, 237;
    --accent-gradient: linear-gradient(45deg, rgb(var(--accent)), #da62c4 30%, white 60%);
    --bg-dotted: radial-gradient(hsla(var(--bc)/0.1) 1px, hsla(var(--b2)/1) 1px)
  }
  
  .bg-dotted {
    background-image: var(--bg-dotted);
    background-size: 0.45rem 0.45rem;
  }
  
  html {
    font-family: system-ui, sans-serif;
    background-color: #F6F6F6;
  }
  
  code {
    font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
      Bitstream Vera Sans Mono, Courier New, monospace;
  }
  </style>
    