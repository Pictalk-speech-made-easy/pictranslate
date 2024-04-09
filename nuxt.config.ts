// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  alias: {
    assets: "/<rootDir>/assets",
  },
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
  runtimeConfig: {
    public: {
      clientVersion: process.env.npm_package_version,
      pictohub: {
        PICTOHUB_API_KEY: process.env.PICTOHUB_API_KEY,
        PICTOHUB_API_URL: process.env.PICTOHUB_API_URL,
        PICTOHUB_TAGS_URL: process.env.PICTOHUB_TAGS_URL,
        PICTOHUB_DB_URL: process.env.PICTOHUB_DB_URL,
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
      link: [ { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }, { rel: 'apple-touch-icon', sizes: "180x180", href: '/apple-touch-icon.png' }, {rel:"mask-icon", href:"/safari-pinned-tab.svg", color:"#6A97DF"}, { rel:"icon", type:"image/png", sizes:"32x32", href:"/favicon-32x32.png"}, { rel:"icon", type:"image/png", sizes:"16x16", href:"/favicon-16x16.png"}, {
        rel: 'canonical',
        href: 'https://www.pictranslate.org'
      } ],
      meta: [
        { hid: 'url', name: 'url', content: 'https://www.pictranslate.org' },
        { hid: 'keywords', name: 'keywords', content: 'AAC,autism,pictograms,speech,text-to-speech,communication,online,translate,sentences,free,open-source' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'msapplication-TileColor', content: '#6A97DF' },
        { name: 'theme-color', content: '#6A97DF' },
        { hid: 'image', name: 'image', content: 'https://www.pictranslate.org/android-chrome-512x512.png' },
        { hid: 'og-type', property: 'og:type', content: 'website' },
        { hid: 'og-url', property: 'og:url', content: 'https://www.pictranslate.org' },
        { hid: 'og-image', property: 'og:image', content: 'https://www.pictranslate.org/android-chrome-512x512.png' },
        { hid: 'author', name: 'author', content: 'Alexandros & Adrianos SIDIRAS GALANTE' },
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
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    debug: true,
    storage: 'localStorage'
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
      protocol_handlers: [
        {
          protocol: 'web+pictranslate',
          url: '/?url=%s',
        },
      ],
      prefer_related_applications: false,
      dir: 'ltr',
      related_applications: [
        {
          platform: 'web',
          url: 'https://www.pictranslate.org',
        }/* ,
        {
          platform: 'play',
          url: 'https://play.google.com/store/apps/details?id=org.pictranslate.www.twa',
        },
        {
          platform: 'itunes',
          url: 'https://apps.apple.com/us/app/pictranslate-aac/id1586091798',
        } */
      ],
      shortcuts: [
        { name: 'Pictranslate', short_name: 'Pictranslate', url: '/', icons: [{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }] },
      ],
      id: 'org.pictranslate.www.twa',
      categories: ['education', 'productivity', 'utilities', 'communication', 'social'],
      name: 'Pictranslate AAC',
      short_name: 'Pictranslate',
      theme_color: '#6A97DF',
      orientation: "any",
      display: 'standalone',
      display_override: ['standalone'],
      lang: 'en',
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
      background_color: '#ffffff',
      description: 'Pictranslate is an online tool to translate sentences into pictograms.',
      screenshots: [
        {
          src: "https://www.pictranslate.org/screenshots/screenshot1.png",
          sizes: "360x740",
          type: "image/png"
        },
        {
          src: "https://www.pictranslate.org/screenshots/screenshot2.png",
          sizes: "360x740",
          type: "image/png"
        },
        {
          src: "https://www.pictranslate.org/screenshots/screenshot3.png",
          sizes: "360x740",
          type: "image/png"
        },
      ]
    },
    workbox: {
      importScripts: ['gram-db.worker.js', 'minified-pictohub.worker.js', 'images-pictohub.worker.js'],
      runtimeCaching: [
        {
          urlPattern: new RegExp(`^https://pictohub-api.gandi.asidiras.dev/collection/keyword*`, 'i'),
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
          urlPattern: new RegExp(`^https://images.pictohub.org/*`, 'i'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-pictohub',
            cacheableResponse: {
              statuses: [0, 200],
            },
            matchOptions: {
              ignoreVary: true,
              ignoreSearch: true
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
  },
  i18n: {
    strategy: 'no_prefix',
    lazy: false,
    baseUrl: 'https://www.pictranslate.org',
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
      },
      {
        code: 'es',
        iso: 'es-ES',
        file: 'es.json'
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
