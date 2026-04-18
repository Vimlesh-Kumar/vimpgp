<template>
  <div class="py-2 py-sm-6 index-overlay">
    <!-- Hero Section -->
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <div class="sticky-top pt-2">
          <div class="mb-6 relative d-flex justify-center">
             <v-img src="/og-image.png" max-width="180" class="rounded-xl elevation-20 shadow-glow hero-branding-img" alt="VimPGP Branding"/>
             <div class="branding-ring" style="width: 220px; height: 220px;" />
          </div>

          <h1 class="text-h4 font-weight-black mb-2 tracking-tighter shadow-text text-center text-md-left">
            <span class="text-logo-white">VIM</span><span class="text-logo-white">PGP</span>
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-5 line-height-relaxed text-center text-md-left">
            Modern, <strong>Open Source</strong>, 100% client-side PGP toolset. 
             All cryptographic operations happen in your browser. 
            <br><br>
            <strong>No data ever leaves your device.</strong>
          </p>

          <v-divider class="mb-5 d-none d-md-block" style="opacity: 0.1"/>

          <div class="glass-card pa-4 rounded-xl border-primary mb-6 position-relative overflow-hidden glow-box d-none d-md-block">
             <div class="bg-glow" />
             <div class="d-flex align-center justify-space-between mb-3 text-caption">
               <span class="text-disabled font-weight-bold uppercase tracking-widest" style="font-size: 0.6rem;">Security</span>
               <v-chip size="x-small" color="success" variant="tonal" class="font-weight-black px-2">ED25519 / RSA</v-chip>
             </div>
             <div class="d-flex align-center justify-space-between mb-3 text-caption">
               <span class="text-disabled font-weight-bold uppercase tracking-widest" style="font-size: 0.6rem;">Network</span>
               <v-chip size="x-small" color="info" variant="tonal" class="font-weight-black px-2">OFFLINE OK</v-chip>
             </div>
             <div class="d-flex align-center justify-space-between text-caption">
               <span class="text-disabled font-weight-bold uppercase tracking-widest" style="font-size: 0.6rem;">Privacy</span>
               <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-black px-2">LOCAL ONLY</v-chip>
             </div>
          </div>

          <v-btn block color="primary" size="small" to="/secure" prepend-icon="mdi-shield-lock" class="font-weight-black rounded-lg mb-3 shadow-glow" height="54">
            Secure Messaging
          </v-btn>
          
          <v-btn block variant="tonal" color="primary" size="small" to="/generate" prepend-icon="mdi-key-plus" class="font-weight-black rounded-lg mb-8" height="48">
            New Key Pair
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" md="8" lg="8">
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
.index-overlay {
  position: relative;
  z-index: 1;
}

.text-gradient {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, #B338FF 100%);
  background-clip: text;
  -webkit-background-clip: text;
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
  z-index: 0;
}

.glow-box {
  box-shadow: 0 0 30px rgba(var(--v-theme-primary), 0.1);
  border: 1px solid rgba(var(--v-theme-primary), 0.2) !important;
}

.bg-black-alpha-20 {
  background-color: rgba(0,0,0,0.3) !important;
}

.gap-3 {
  gap: 12px;
}

.line-height-tight {
  line-height: 1.4;
}

.shadow-glow {
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.3) !important;
}

.line-height-relaxed {
  line-height: 1.8;
}

.hero-branding-img {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
}

.hero-branding-img:hover {
  transform: translateY(-8px) rotate(2deg);
  box-shadow: 0 20px 50px rgba(var(--v-theme-primary), 0.4) !important;
}

.branding-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 320px;
  border: 2px dashed rgba(var(--v-theme-primary), 0.2);
  border-radius: 50%;
  z-index: -1;
  animation: rotate 30s linear infinite;
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
</style>
