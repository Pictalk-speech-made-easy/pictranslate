<template>
    <html lang="fr"
      class="bg-fixed bg-gradient-to-b from-indigo-500 from-0% via-[#8397fe50] via-15% to-transparent to-45% min-h-screen">
  
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <meta name="generator" content="Nuxt3" />
      <title>Pictime</title>
    </head>
  
    <body>
      <slot />
    </body>
  
    </html>
  </template>
  <script setup lang="ts">
  import { onMounted } from "vue";
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
    