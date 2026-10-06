<template>
  <v-app>
    <div class="app-bg" />
    <div class="error-page d-flex align-center justify-center pa-6">
      <v-card class="surface-card pa-8 pa-sm-12 text-center overflow-hidden position-relative" max-width="580" style="z-index: 1;">
        <div class="err-glow" />
        <div class="position-relative" style="z-index: 1;">
          <v-avatar :color="isNotFound ? 'primary' : 'error'" variant="tonal" size="88" class="mb-6">
            <v-icon size="48">{{ isNotFound ? 'mdi-compass-off-outline' : 'mdi-alert-circle-outline' }}</v-icon>
          </v-avatar>
          <h1 class="text-error-code font-weight-black mb-1 text-gradient">{{ statusCode }}</h1>
          <h2 class="text-h5 font-weight-black mb-3">{{ title }}</h2>
          <p class="text-body-1 text-medium-emphasis mb-8 mx-auto" style="max-width: 420px;">{{ message }}</p>
          <v-btn color="primary" size="large" prepend-icon="mdi-home" class="font-weight-bold px-8 shadow-glow" @click="handleError">
            Back to dashboard
          </v-btn>
        </div>
      </v-card>
    </div>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  error: {
    type: Object,
    default: () => ({ statusCode: 500, message: 'An unknown error occurred' }),
  },
})

const statusCode = computed(() => props.error?.statusCode || 500)
const isNotFound = computed(() => statusCode.value === 404)
const title = computed(() => (isNotFound.value ? 'Page not found' : 'Something went wrong'))
const message = computed(() =>
  isNotFound.value
    ? "The path you're looking for doesn't exist or has been securely erased. Let's get you back to safety."
    : props.error?.message || 'An unexpected error occurred. Please return to the dashboard and try again.',
)

const handleError = () => clearError({ redirect: '/' })

useHead({ title: computed(() => `${statusCode.value} - VimPGP`) })
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}
.err-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.12) 0%, transparent 65%);
  pointer-events: none;
}
.text-error-code {
  font-size: clamp(4rem, 14vw, 7rem);
  line-height: 1;
  letter-spacing: -0.05em;
}
</style>
