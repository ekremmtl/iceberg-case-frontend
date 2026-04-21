export default defineNuxtConfig({
  compatibilityDate: "2026-04-16",
  devtools: { enabled: false },
  telemetry: false,

  devServer: {
    port: 7979,
  },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/i18n"],

  i18n: {
    locales: [
      { code: "tr", file: "tr.json", name: "Türkçe" },
      { code: "en", file: "en.json", name: "English" },
    ],
    defaultLocale: "en",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_locale",
      fallbackLocale: "en",
      redirectOn: "root",
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    },
  },

  typescript: {
    strict: true,
    shim: false,
  },

  app: {
    head: {
      title: "Iceberg Case",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
        },
      ],
    },
  },

  css: ["~/assets/css/main.css"],
});
