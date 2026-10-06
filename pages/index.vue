<template>
  <div>
    <!-- Hero banner -->
    <v-card class="surface-card hero pa-6 pa-md-8 mb-8 overflow-hidden position-relative">
      <div class="hero-glow" />
      <v-row align="center" class="position-relative" style="z-index: 1;">
        <v-col cols="12" md="8">
          <div class="eyebrow mb-3">Client-side PGP toolset</div>
          <h1 class="text-h4 text-md-h3 font-weight-black tracking-tighter mb-3">
            Own your <span class="text-gradient">privacy</span>.
          </h1>
          <p class="text-body-1 text-medium-emphasis mb-6" style="max-width: 560px;">
            Generate keys, encrypt messages, and sign documents entirely in your browser.
            Nothing is ever uploaded — every operation runs on your device.
          </p>
          <div class="d-flex flex-wrap ga-3">
            <v-btn color="primary" size="large" to="/secure" prepend-icon="mdi-shield-lock" class="font-weight-bold px-6 shadow-glow">
              Secure Messaging
            </v-btn>
            <v-btn variant="tonal" color="primary" size="large" to="/generate" prepend-icon="mdi-key-plus" class="font-weight-bold px-6">
              New Key Pair
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="4" class="d-none d-md-block">
          <div class="d-flex flex-column ga-3">
            <div v-for="fact in facts" :key="fact.label" class="inset-box d-flex align-center justify-space-between pa-3 px-4">
              <div class="d-flex align-center ga-3">
                <v-icon :color="fact.color" size="20">{{ fact.icon }}</v-icon>
                <span class="text-caption font-weight-bold text-medium-emphasis">{{ fact.label }}</span>
              </div>
              <v-chip size="x-small" :color="fact.color" variant="tonal" class="font-weight-bold">{{ fact.value }}</v-chip>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <KeyList />
  </div>
</template>

<script setup>
const facts = [
  { label: 'Cipher', value: 'ED25519 / RSA', icon: 'mdi-shield-key', color: 'success' },
  { label: 'Network', value: 'Offline OK', icon: 'mdi-wifi-off', color: 'info' },
  { label: 'Storage', value: 'Local only', icon: 'mdi-database-lock', color: 'primary' },
]

useHead({
  title: 'Dashboard - VimPGP',
})
</script>

<style scoped>
.hero {
  border: 1px solid var(--hairline);
}

.hero-glow {
  position: absolute;
  top: -40%;
  right: -10%;
  width: 55%;
  height: 200%;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.14) 0%, transparent 65%);
  pointer-events: none;
}
</style>
