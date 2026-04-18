<template>
  <v-app class="app-container">
    <v-app-bar flat class="glass-navbar border-b-1" height="64">
      <v-container class="d-flex align-center py-0 px-2 px-sm-4" fluid>
        <NuxtLink to="/" class="text-decoration-none d-flex align-center">
          <v-avatar size="36" class="mr-2 mr-sm-3 shadow-glow" rounded="lg">
            <v-img src="/logo.png" cover alt="VimPGP Logo"/>
          </v-avatar>
          <div class="d-none d-sm-flex flex-column justify-center mt-n1">
            <span class="text-h6 font-weight-black text-logo-white tracking-tighter line-height-tight">VIM<span class="text-gradient">PGP</span></span>
            <span class="text-caption text-primary font-weight-bold uppercase tracking-widest" style="font-size: 0.6rem !important; margin-top: -4px;">Secure Suite</span>
          </div>
        </NuxtLink>
      <v-divider vertical inset class="mx-6 d-none d-lg-block" style="opacity: 0.1"/>

      <div class="d-none d-lg-flex align-center">
        <v-chip size="small" variant="tonal" color="success" class="font-weight-black px-4 status-badge shadow-success">
          <div class="status-dot mr-2"/>
          CLIENT-SIDE SECURE
        </v-chip>
      </div>

        <v-spacer/>

      <div class="d-flex align-center">
        <v-tabs v-model="activeTab" bg-color="transparent" color="primary" density="compact" hide-slider class="nav-tabs d-none d-sm-flex">
          <v-tab to="/" value="dashboard" rounded="lg" class="px-3 text-none font-weight-bold">
            <v-icon start size="16" class="mr-1">mdi-view-dashboard</v-icon>
            Dashboard
          </v-tab>
          <v-tab to="/secure" value="secure" rounded="lg" class="px-3 text-none font-weight-bold">
            <v-icon start size="16" class="mr-1">mdi-shield-lock</v-icon>
            Secure
          </v-tab>
          <v-tab to="/generate" value="generate" rounded="lg" class="px-3 text-none font-weight-bold">
            <v-icon start size="16" class="mr-1">mdi-key-plus</v-icon>
            Generate
          </v-tab>
          <v-tab to="/faq" value="faq" rounded="lg" class="px-3 text-none font-weight-bold">FAQ</v-tab>
          <v-tab to="/about" value="about" rounded="lg" class="px-3 text-none font-weight-bold">About</v-tab>
        </v-tabs>

        <v-divider vertical inset class="mx-3 d-none d-sm-block" style="opacity: 0.1"/>

        <v-btn
          icon
          variant="tonal"
          size="32"
          class="glass-panel-btn border-1 mr-2"
          :title="`Theme: ${themeLabel}`"
          @click="toggleTheme"
        >
          <v-icon size="16">{{ themeIcon }}</v-icon>
        </v-btn>

        <v-btn
           icon
           variant="tonal"
           size="32"
           href="https://github.com/Vimlesh-Kumar/vimpgp"
           target="_blank"
           title="View on GitHub"
           class="glass-panel-btn border-1"
        >
          <v-icon size="18">mdi-github</v-icon>
        </v-btn>
      </div>
    </v-container>
    </v-app-bar>

    <v-main>
      <div class="background-blobs">
        <div class="blob blob-1"/>
        <div class="blob blob-2"/>
         <div class="blob blob-3"/>
      </div>
      <v-container class="align-start pt-10" style="max-width: 1300px; position: relative; z-index: 1;">
        <slot />
      </v-container>
    </v-main>
    
    <v-footer class="glass-effect d-flex justify-center py-4 bg-transparent">
       <span class="text-caption text-medium-emphasis">
         🔒 100% Client-Side Encryption. Your keys never leave your browser.
       </span>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, computed, watch } from 'vue'
import { useTheme } from 'vuetify'
const activeTab = ref(null)
const theme = useTheme()
const themeMode = ref('dark')
const systemDark = ref(false)
let mediaQuery = null
let mediaHandler = null

const themeIcon = computed(() => {
  if (themeMode.value === 'system') return 'mdi-laptop'
  return themeMode.value === 'dark' ? 'mdi-weather-night' : 'mdi-white-balance-sunny'
})

const themeLabel = computed(() => {
  if (themeMode.value === 'system') return 'System'
  return themeMode.value === 'dark' ? 'Dark' : 'Light'
})

const applyTheme = () => {
  const resolved = themeMode.value === 'system'
    ? (systemDark.value ? 'dark' : 'light')
    : themeMode.value
  theme.global.name.value = resolved
}

const toggleTheme = () => {
  themeMode.value = themeMode.value === 'dark' ? 'light' : 'dark'
}

onMounted(() => {
  if (!import.meta.client) return
  const stored = localStorage.getItem('vimpgp_theme')
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    themeMode.value = stored
  }
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemDark.value = mediaQuery.matches

  mediaHandler = (event) => {
    systemDark.value = event.matches
    if (themeMode.value === 'system') applyTheme()
  }

  if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', mediaHandler)
  else mediaQuery.addListener(mediaHandler)

  watch(themeMode, (mode) => {
    if (!import.meta.client) return
    localStorage.setItem('vimpgp_theme', mode)
    applyTheme()
  }, { immediate: true })
})

onBeforeUnmount(() => {
  if (!mediaQuery || !mediaHandler) return
  if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', mediaHandler)
  else mediaQuery.removeListener(mediaHandler)
})
</script>

<style scoped>
.header-border {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.hover-scale {
  transition: transform 0.2s ease-in-out;
}
.hover-scale:hover {
  transform: scale(1.02);
}

.border-primary {
  border: 1px solid rgba(0, 229, 255, 0.3) !important;
}

.tracking-tighter {
  letter-spacing: -1px;
}
.tracking-widest {
  letter-spacing: 2px;
}
.uppercase {
  text-transform: uppercase;
}

.glass-panel-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.nav-tabs :deep(.v-tab) {
  min-width: 100px;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.nav-tabs :deep(.v-tab--selected) {
  background: rgba(var(--v-theme-primary), 0.1);
  opacity: 1;
}

.app-container {
  background: transparent !important;
}

.tracking-wide {
  letter-spacing: 0.5px;
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
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.blob-2 {
  background: #00FFCC;
  width: 300px;
  height: 300px;
  bottom: 0;
  right: -50px;
  animation-delay: -5s;
}

.blob-3 {
  background: #FF007F;
  width: 250px;
  height: 250px;
  top: 40%;
  left: 30%;
  animation-duration: 25s;
  animation-delay: -10s;
  opacity: 0.2;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
</style>
