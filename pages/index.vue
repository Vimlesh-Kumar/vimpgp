<template>
  <div class="py-6 index-overlay">
    <!-- Hero Section -->
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <div class="sticky-top pt-2">
          <h1 class="text-h3 font-weight-black mb-3 tracking-tighter shadow-text">
            <span class="text-white">VIM</span><span class="text-gradient">PGP</span>
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-6 line-height-relaxed">
            VimPGP is a premium, <strong>Open Source</strong>, client-side PGP toolset. 
            All cryptographic operations happen in your browser. 
            <br><br>
            <strong>No data ever leaves your device.</strong> No accounts, no cookies, no tracking. Just pure privacy.
          </p>

          <v-divider class="mb-6" style="opacity: 0.1"/>

          <div class="glass-card pa-6 rounded-xl border-primary mb-8 position-relative overflow-hidden glow-box">
             <div class="bg-glow"/>
             <div class="d-flex align-center justify-space-between mb-4 text-caption">
               <span class="text-disabled font-weight-bold uppercase tracking-widest">Security</span>
               <v-chip size="small" color="success" variant="tonal" class="font-weight-black px-3">ED25519 / RSA</v-chip>
             </div>
             <div class="d-flex align-center justify-space-between mb-4 text-caption">
               <span class="text-disabled font-weight-bold uppercase tracking-widest">Network</span>
               <v-chip size="small" color="info" variant="tonal" class="font-weight-black px-3"><v-icon start size="14">mdi-wifi-off</v-icon>OFFLINE OK</v-chip>
             </div>
             <div class="d-flex align-center justify-space-between text-caption">
               <span class="text-disabled font-weight-bold uppercase tracking-widest">Privacy</span>
               <v-chip size="small" color="primary" variant="tonal" class="font-weight-black px-3"><v-icon start size="14">mdi-incognito</v-icon>LOCAL ONLY</v-chip>
             </div>
          </div>

          <v-btn block color="primary" size="x-large" to="/secure" prepend-icon="mdi-shield-lock" class="font-weight-black rounded-xl mb-4 shadow-glow" height="64">
            Secure Messaging
          </v-btn>
          
          <v-btn block variant="tonal" color="primary" size="x-large" to="/generate" prepend-icon="mdi-key-plus" class="font-weight-black rounded-xl mb-8" height="54">
            New Key Pair
          </v-btn>

          <div class="glass-card pa-4 rounded-xl text-caption border-1 bg-black-alpha-20 d-flex align-start gap-3">
            <v-icon size="24" color="secondary" class="mt-1">mdi-shield-check</v-icon>
            <div class="line-height-tight text-disabled">
              <span class="text-white font-weight-bold">Military-Grade.</span> Standard OpenPGP implementation verified against modern security benchmarks.
            </div>
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

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
</style>
