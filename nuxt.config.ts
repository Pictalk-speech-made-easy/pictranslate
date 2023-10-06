// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  alias: {
    assets: "/<rootDir>/assets",
  },
  runtimeConfig: {
    public: {
      pictohub: {
        PICTOHUB_API_KEY: process.env.PICTOHUB_API_KEY,
        PICTOHUB_API_URL: process.env.PICTOHUB_API_URL,
      },
      sentry: {
        dsn: 'https://94cd8599e4797300f9151e648d73de13@o1135783.ingest.sentry.io/4505997994164224',
        environment: 'development',
      }
    }
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Pictranslate',
      link: [ { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }, { rel: 'apple-touch-icon', sizes: "180x180", href: '/apple-touch-icon.png' }, {rel:"mask-icon", href:"/safari-pinned-tab.svg", color:"#8296ff"}, { rel:"icon", type:"image/png", sizes:"32x32", href:"/favicon-32x32.png"}, { rel:"icon", type:"image/png", sizes:"16x16", href:"/favicon-16x16.png"} ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'msapplication-TileColor', content: '#8296FF' },
        { name: 'theme-color', content: '#8296FF' },
      ],
      noscript: [
        {
          innerHTML: 'This website requires JavaScript.',
          body: true,
        },
      ],
      base: { href: '/' },
    }
  },
  plugins: [
    { src: '~/plugins/matomo-plugin.js', ssr: false },
    { src: '~/plugins/sentry-plugin.js', ssr: false },
  ],
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
    // SEO '@nuxtseo/module',
    '@nuxtjs/i18n',
    'nuxt-proxy',
    '@nuxt/image'
  ],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
      'storeToRefs'
    ],
  },
  imports: {
    dirs: ['./store'],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  pwa: {
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Pictranslate AAC',
      short_name: 'Pictranslate',
      theme_color: '#8296FF',
      icons: [
        {
          src: 'android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: 'android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      // Register the stimulus-db.worker.js file in the service worker
      importScripts: ['stimulus-db.worker.js'],
      runtimeCaching: [
        {
          urlPattern: new RegExp(`^https://pictohub-api.gandi.asidiras.dev/collection/search*`, 'i'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'pictohub-api-cache',
            expiration: {
              maxEntries: 5000,
              maxAgeSeconds: 10 * 24 * 60 * 60
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: new RegExp(`^https://api.arasaac.org/api/pictograms/*`, 'i'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'arasaac-pictos-cache',
            expiration: {
              maxEntries: 5000,
              maxAgeSeconds: 10 * 24 * 60 * 60
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
  i18n: {
    strategy: 'no_prefix',
    lazy: true,
    baseUrl: 'https://pictime.org',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.json'
      },
      {
        code: 'fr',
        iso: 'fr-FR',
        file: 'fr-FR.json'
      }
    ],
    langDir: 'lang',
    defaultLocale: 'fr',    // default locale of your project for Nuxt pages and routings
    detectBrowserLanguage: {
      alwaysRedirect: true, // recommended
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',  // recommended
    }
  },
})
