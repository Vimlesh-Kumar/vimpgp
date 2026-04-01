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
                        primary: '#00FFCC',
                        secondary: '#B338FF',
                        accent: '#FF007F',
                        error: '#FF2A55',
                        info: '#00D1FF',
                        success: '#00FA9A',
                        warning: '#FFB800',
                        background: '#050505',
                        surface: '#111111',
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
