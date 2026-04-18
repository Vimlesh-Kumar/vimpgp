<template>
  <v-app>
    <div class="error-page d-flex align-center justify-center">
      <div class="background-blobs">
        <div class="blob blob-1"/>
        <div class="blob blob-2"/>
      </div>
      
      <v-card class="glass-card pa-12 rounded-xl text-center border-1 overflow-hidden premium-card" max-width="600" style="z-index: 1;">
         <div class="bg-glow"/>
         <v-avatar color="error" variant="tonal" size="100" class="mb-8 elevation-10 shadow-error">
           <v-icon size="60">mdi-alert-circle-outline</v-icon>
         </v-avatar>
         <h1 class="text-h1 font-weight-black text-logo-white mb-2" style="font-size: 8rem !important; letter-spacing: -5px !important;">404</h1>
         <h2 class="text-h4 font-weight-black text-gradient mb-4">Identity Not Found</h2>
         <p class="text-body-1 text-medium-emphasis mb-10 line-height-relaxed">
           The cryptographic path you're looking for doesn't exist or has been securely erased. Let's get you back to safety.
         </p>
         <v-btn color="primary" size="x-large" prepend-icon="mdi-home" class="font-weight-black rounded-lg px-8 shadow-glow" @click="handleError">
           Back to Dashboard
         </v-btn>
      </v-card>
    </div>
  </v-app>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => ({ message: 'An unknown error occurred' })
  }
})

const handleError = () => clearError({ redirect: '/' })

useHead({
  title: '404 - Not Found | VimPGP'
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
}

.text-gradient {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, #B338FF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bg-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.1) 0%, transparent 70%);
  pointer-events: none;
}

/* Background Animations */
.background-blobs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  filter: blur(120px);
  opacity: 0.15;
  border-radius: 50%;
  animation: float 20s infinite ease-in-out;
}

.blob-1 {
  background: #B338FF;
  width: 600px;
  height: 600px;
  top: -200px;
  left: -200px;
}

.blob-2 {
  background: #00FFCC;
  width: 500px;
  height: 500px;
  bottom: -100px;
  right: -100px;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
}

.shadow-error {
  box-shadow: 0 0 40px rgba(var(--v-theme-error), 0.3) !important;
}

.shadow-glow {
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.3) !important;
}

.line-height-relaxed {
  line-height: 1.8;
}
</style>
