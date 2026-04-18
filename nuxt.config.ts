import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import pkg from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },

  // Standard production settings (Working for Vercel/Netlify)
  ssr: false,

  app: {
    baseURL: '/',
    buildAssetsDir: 'assets',
    head: {
      title: 'VimPGP - Secure Client-Side PGP Toolset',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Secure, open-source, client-side PGP toolset for key generation, encryption, decryption, and digital signatures. No data ever leaves your device.' },
        { name: 'author', content: 'Vimlesh Kumar' },
        { name: 'theme-color', content: '#00E5FF' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://vimpgp.com/' },
        { property: 'og:title', content: 'VimPGP - Secure Client-Side PGP Toolset' },
        { property: 'og:description', content: 'Military-grade encryption tool that runs entirely in your browser. Generate keys, encrypt messages, and sign documents with zero data tracking.' },
        { property: 'og:image', content: 'https://vimpgp.com/og-image.png' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://vimpgp.com/' },
        { name: 'twitter:title', content: 'VimPGP - Secure Client-Side PGP Toolset' },
        { name: 'twitter:description', content: 'Military-grade encryption tool that runs entirely in your browser. Generate keys, encrypt messages, and sign documents with zero data tracking.' },
        { name: 'twitter:image', content: 'https://vimpgp.com/og-image.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
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
