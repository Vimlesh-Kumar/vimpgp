import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
    const getInitialTheme = () => {
        if (!import.meta.client) return 'dark'
        const stored = localStorage.getItem('vimpgp_theme')
        const mode = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'dark'
        if (mode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return mode
    }

    const vuetify = createVuetify({
        theme: {
            defaultTheme: getInitialTheme(),
            themes: {
                light: {
                    dark: false,
                    colors: {
                        primary: '#0D9488',
                        secondary: '#7C3AED',
                        accent: '#0EA5E9',
                        error: '#E11D48',
                        info: '#0284C7',
                        success: '#059669',
                        warning: '#D97706',
                        background: '#EEF1F6',
                        surface: '#FFFFFF',
                        'surface-bright': '#FFFFFF',
                        'surface-variant': '#E2E8F0',
                        'on-surface-variant': '#475569',
                    },
                },
                dark: {
                    dark: true,
                    colors: {
                        primary: '#2DD4BF',
                        secondary: '#A78BFA',
                        accent: '#38BDF8',
                        error: '#FB7185',
                        info: '#38BDF8',
                        success: '#34D399',
                        warning: '#FBBF24',
                        background: '#080B11',
                        surface: '#121821',
                        'surface-bright': '#1A222D',
                        'surface-variant': '#26303D',
                        'on-surface-variant': '#94A3B8',
                    },
                },
            },
        },
        defaults: {
            global: {
                // MD3 elevation is 0–5 in Vuetify 4; components lean on custom shadows.
                elevation: 0,
            },
            VCard: {
                rounded: 'xl',
            },
            VBtn: {
                rounded: 'lg',
                variant: 'flat',
                class: 'text-none',
            },
            VTextField: {
                variant: 'solo-filled',
                flat: true,
                rounded: 'lg',
                hideDetails: 'auto',
            },
            VTextarea: {
                variant: 'solo-filled',
                flat: true,
                rounded: 'lg',
                hideDetails: 'auto',
            },
            VSelect: {
                variant: 'solo-filled',
                flat: true,
                rounded: 'lg',
                hideDetails: 'auto',
            },
            VChip: {
                rounded: 'md',
            },
            VList: {
                bgColor: 'transparent',
            },
            VTooltip: {
                location: 'top',
            },
        },
    })
    app.vueApp.use(vuetify)
})
