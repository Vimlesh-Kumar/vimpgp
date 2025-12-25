import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Standard production settings (Working for Vercel/Netlify)
  ssr: false,

  app: {
    baseURL: '/',
    buildAssetsDir: 'assets',
  },

  build: {
    transpile: ['vuetify'],
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error plugin type mismatch
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    optimizeDeps: {
      exclude: ['openpgp']
    }
  },
})
