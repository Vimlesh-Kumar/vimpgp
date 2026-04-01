import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
    const getInitialTheme = () => {
        if (!import.meta.client) return 'dark';
        const stored = localStorage.getItem('vimpgp_theme');
        const mode = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'dark';
        if (mode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return mode;
    };

    const vuetify = createVuetify({
        ssr: true,
        theme: {
            defaultTheme: getInitialTheme(),
            themes: {
                light: {
                    dark: false,
                    colors: {
                        primary: '#0077FF',
                        secondary: '#FF4081',
                        accent: '#6C63FF',
                        error: '#D32F2F',
                        info: '#1976D2',
                        success: '#2E7D32',
                        warning: '#F9A825',
                        background: '#F4F6FB',
                        surface: '#FFFFFF',
                    },
                },
                dark: {
                    dark: true,
                    colors: {
                        primary: '#00E5FF',
                        secondary: '#FF4081',
                        accent: '#651FFF',
                        error: '#FF5252',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FFC107',
                        background: '#0a0a0a',
                        surface: '#1e1e1e', // Will override with glass effect in CSS
                    },
                },
            },
        },
        defaults: {
            VList: {
                bgColor: 'transparent',
            },
            VCard: {
                elevation: 10,
                rounded: 'xl',
            },
            VBtn: {
                rounded: 'lg',
                variant: 'flat',
                fontWeight: 'bold',
            },
            VTextField: {
                variant: 'solo-filled',
                bgColor: 'surface',
                rounded: 'lg',
            },
        },
    })
    app.vueApp.use(vuetify)
})
