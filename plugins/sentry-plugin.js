import * as Sentry from '@sentry/vue'
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const { public: { sentry } } = useRuntimeConfig()
  if (!sentry.dsn || sentry.environment == 'development') {
    return
  }
  Sentry.init({
    app: nuxtApp.vueApp,
    dsn: sentry.dsn,
    environment: sentry.environment,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
      new Sentry.Replay(),
    ],
    // Configure this whole part as you need it!
    tracesSampleRate: 1, // Change in prod
    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', 'https://pictranslate.org'],
    replaysSessionSampleRate: 1.0, // Change in prod
    replaysOnErrorSampleRate: 1.0, // Change in prod if necessary
  })
})