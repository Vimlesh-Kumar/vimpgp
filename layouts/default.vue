<template>
  <v-app class="app-container">
    <div class="app-bg" />

    <v-app-bar flat class="glass-effect hairline-b" height="66">
      <v-container class="d-flex align-center py-0 px-3 px-sm-4" fluid style="max-width: 1320px;">
        <NuxtLink to="/" class="text-decoration-none d-flex align-center brand-link">
          <v-avatar size="38" class="mr-3 brand-avatar" rounded="lg">
            <v-img src="/logo.png" cover alt="VimPGP Logo" />
          </v-avatar>
          <div class="d-none d-sm-flex flex-column justify-center">
            <span class="text-subtitle-1 font-weight-black text-logo-white tracking-tight line-height-tight">VIM<span class="text-gradient">PGP</span></span>
            <span class="eyebrow" style="font-size: 0.58rem; margin-top: -2px;">Secure Suite</span>
          </div>
        </NuxtLink>

        <v-chip
          size="small"
          variant="tonal"
          color="success"
          class="font-weight-bold ml-6 d-none d-lg-inline-flex status-badge"
        >
          <span class="status-dot mr-2" />
          Client-side secure
        </v-chip>

        <v-spacer />

        <v-tabs
          v-model="activeTab"
          bg-color="transparent"
          color="primary"
          density="comfortable"
          hide-slider
          class="nav-tabs d-none d-md-flex mr-2"
        >
          <v-tab v-for="item in navItems" :key="item.to" :to="item.to" :value="item.to" class="px-4 text-none font-weight-bold rounded-lg">
            <v-icon v-if="item.icon" start size="18">{{ item.icon }}</v-icon>
            {{ item.label }}
          </v-tab>
        </v-tabs>

        <v-btn
          icon
          variant="text"
          size="small"
          class="glass-panel-btn mr-2"
          :title="`Theme: ${themeLabel}`"
          :aria-label="`Switch theme, currently ${themeLabel}`"
          @click="toggleTheme"
        >
          <v-icon size="20">{{ themeIcon }}</v-icon>
        </v-btn>

        <v-btn
          icon
          variant="text"
          size="small"
          href="https://github.com/Vimlesh-Kumar/vimpgp"
          target="_blank"
          rel="noopener"
          title="View on GitHub"
          aria-label="View source on GitHub"
          class="glass-panel-btn"
        >
          <v-icon size="20">mdi-github</v-icon>
        </v-btn>

        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn icon variant="text" size="small" class="glass-panel-btn ml-2 d-md-none" aria-label="Open navigation menu" v-bind="props">
              <v-icon size="22">mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list class="glass-panel" density="comfortable" min-width="200" rounded="lg">
            <v-list-item v-for="item in navItems" :key="item.to" :to="item.to" :prepend-icon="item.icon" :title="item.label" />
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="align-start pt-8 pb-16" style="max-width: 1320px; position: relative; z-index: 1;">
        <slot />
      </v-container>
    </v-main>

    <v-footer class="glass-effect hairline-t d-flex justify-center py-4 bg-transparent">
      <span class="text-caption text-medium-emphasis d-flex align-center ga-2">
        <v-icon size="14" color="success">mdi-shield-check</v-icon>
        100% client-side encryption · your keys never leave your browser
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

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'mdi-view-dashboard-outline' },
  { to: '/secure', label: 'Secure', icon: 'mdi-shield-lock-outline' },
  { to: '/generate', label: 'Generate', icon: 'mdi-key-plus' },
  { to: '/faq', label: 'FAQ', icon: 'mdi-help-circle-outline' },
  { to: '/about', label: 'About', icon: 'mdi-information-outline' },
]

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
  theme.change(resolved)
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
.app-container {
  background: transparent !important;
}

.line-height-tight { line-height: 1.15; }

.brand-link { transition: opacity 0.2s ease; }
.brand-link:hover { opacity: 0.85; }

.brand-avatar {
  border: 1px solid var(--hairline-strong);
  box-shadow: 0 4px 14px -6px rgba(var(--v-theme-primary), 0.5);
}

.nav-tabs :deep(.v-tab) {
  min-width: 0;
  opacity: 0.72;
  transition: opacity 0.2s ease, background 0.2s ease;
}
.nav-tabs :deep(.v-tab:hover) { opacity: 1; }
.nav-tabs :deep(.v-tab--selected) {
  opacity: 1;
  background: rgba(var(--v-theme-primary), 0.12);
}
</style>
