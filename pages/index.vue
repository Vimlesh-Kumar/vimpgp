<template>
  <div class="py-6">
    <!-- Hero Section -->
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <div class="sticky-top pt-2">
          <h1 class="text-h3 font-weight-black mb-3 tracking-tighter shadow-text">
            <span class="text-white">VIM</span><span class="text-gradient">PGP</span>
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-6 line-height-relaxed">
            VimPGP is an <strong>Open Source</strong>, free, online and secure PGP key generator. 
            All code runs on the client-side using the <strong>OpenPGP.js</strong> library. 
            <br/><br/>
            No servers. No tracking. Feel free to <strong>unplug the Internet</strong> before use. 
            Check our <NuxtLink to="/faq" class="text-primary font-weight-bold text-decoration-none">FAQ</NuxtLink> for more information.
          </p>

          <v-divider class="mb-6" style="opacity: 0.1"/>

          <div class="mb-8">
            <div class="d-flex align-center justify-space-between mb-3 text-caption">
              <span class="text-disabled font-weight-bold uppercase tracking-widest">Privacy</span>
              <span class="text-success font-weight-black">100% SECURE</span>
            </div>
            <div class="d-flex align-center justify-space-between mb-3 text-caption">
              <span class="text-disabled font-weight-bold uppercase tracking-widest">Performance</span>
              <span class="text-white font-weight-black">ZERO LATENCY</span>
            </div>
            <div class="d-flex align-center justify-space-between text-caption">
              <span class="text-disabled font-weight-bold uppercase tracking-widest">Engine</span>
              <span class="text-white font-weight-black">OPENPGP.JS</span>
            </div>
          </div>

          <v-btn block color="primary" size="large" to="/generate" prepend-icon="mdi-plus" class="font-weight-black rounded-xl mb-4 shadow-glow">
            Generate Key
          </v-btn>

          <div class="glass-card pa-4 rounded-xl text-caption border-primary mb-6">
            <v-icon size="16" color="primary" class="mr-1">mdi-shield-check</v-icon>
            Your keys never leave your physical device. No servers. No tracking.
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="8" lg="9">
        <KeyList />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
useHead({
  title: 'Dashboard - VimPGP'
})
</script>

<style scoped>
.border-l-primary {
  border-left: 4px solid var(--v-theme-primary);
}

.hero-image-stack {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-card-1 {
  position: absolute;
  top: -20px;
  left: 20px;
  z-index: 2;
  animation: float 6s infinite ease-in-out;
}

.floating-card-2 {
  position: absolute;
  bottom: -20px;
  right: 20px;
  z-index: 2;
  animation: float 6s infinite ease-in-out -3s;
}

.hover-border-primary {
  transition: all 0.3s ease;
}

.hover-border-primary:hover {
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
  transform: translateY(-5px);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
</style>
