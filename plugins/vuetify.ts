import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        ssr: true,
        theme: {
            defaultTheme: 'dark',
            themes: {
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
