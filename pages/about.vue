<template>
  <div>
    <div class="text-center mb-10">
      <v-avatar color="primary" variant="tonal" size="60" rounded="lg" class="mb-4">
        <v-icon icon="mdi-shield-account" size="30" />
      </v-avatar>
      <h1 class="text-h4 text-sm-h3 font-weight-black tracking-tighter mb-2">About <span class="text-gradient">VimPGP</span></h1>
      <p class="text-body-1 text-medium-emphasis mx-auto" style="max-width: 600px;">
        A privacy-first, 100% client-side cryptographic suite for the modern web.
      </p>
    </div>

    <v-row class="mb-8">
      <v-col v-for="p in pillars" :key="p.title" cols="12" md="4">
        <v-card class="surface-card lift pa-6 h-100 text-center">
          <v-icon :color="p.color" size="34" class="mb-4">{{ p.icon }}</v-icon>
          <h3 class="text-subtitle-1 font-weight-black mb-2">{{ p.title }}</h3>
          <p class="text-body-2 text-medium-emphasis">{{ p.body }}</p>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="surface-card pa-6 pa-sm-9 overflow-hidden position-relative">
      <div class="about-glow" />
      <v-row align="center" class="position-relative" style="z-index: 1;">
        <v-col cols="12" md="8">
          <h2 class="text-h5 font-weight-black mb-4">The <span class="text-gradient">integrity</span> commitment</h2>
          <p class="text-body-1 text-medium-emphasis mb-4">
            In an era of pervasive surveillance and centralized data silos, VimPGP is a sanctuary for private
            communication. There are no accounts, because we never want your data.
          </p>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Our mission is to remove the technical barriers to strong encryption — so you can secure your
            identity, sign your documents, and own your privacy with confidence.
          </p>

          <div class="eyebrow mb-1">Architect &amp; lead developer</div>
          <div class="text-h6 font-weight-black mb-3">Vimlesh Kumar</div>
          <div class="d-flex ga-2">
            <v-btn v-for="l in links" :key="l.icon" :icon="l.icon" size="small" variant="tonal" color="primary" :href="l.href" target="_blank" rel="noopener" :aria-label="l.label" :title="l.label" />
          </div>
        </v-col>
        <v-col cols="12" md="4" class="d-none d-md-flex justify-center">
          <v-img src="/logo.png" max-width="180" class="about-logo" alt="VimPGP logo" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
const pillars = [
  { title: 'Zero-trust architecture', body: 'All cryptography happens in your browser. Keys, passphrases, and plaintext are never transmitted to any server.', icon: 'mdi-security', color: 'primary' },
  { title: 'Open standard', body: 'Built on OpenPGP.js and the official OpenPGP specification. Fully source-visible and interoperable.', icon: 'mdi-open-source-initiative', color: 'secondary' },
  { title: 'Offline ready', body: 'Once loaded, VimPGP works entirely offline. Generate and export keys without an internet connection.', icon: 'mdi-server-off', color: 'info' },
]

const links = [
  { icon: 'mdi-github', href: 'https://github.com/Vimlesh-Kumar', label: 'GitHub profile' },
  { icon: 'mdi-linkedin', href: 'https://linkedin.com/in/vimleshkumar', label: 'LinkedIn profile' },
  { icon: 'mdi-earth', href: 'https://vimlesh.dev', label: 'Portfolio site' },
]

useHead({ title: 'About - VimPGP' })
</script>

<style scoped>
.about-glow {
  position: absolute;
  bottom: -60%;
  right: -10%;
  width: 55%;
  height: 200%;
  background: radial-gradient(circle, rgba(var(--v-theme-secondary), 0.1) 0%, transparent 65%);
  pointer-events: none;
}
.about-logo { opacity: 0.55; filter: grayscale(0.3); }
</style>
