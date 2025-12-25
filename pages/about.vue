<template>
  <div class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <div class="text-center mb-12">
          <v-avatar color="primary" variant="tonal" size="80" class="mb-4 shadow-glow border-primary">
            <v-icon icon="mdi-information" size="40"/>
          </v-avatar>
          <div class="d-flex align-center justify-center mb-2">
            <v-chip color="primary" variant="tonal" size="x-small" class="font-weight-black px-3" rounded="lg">
              V1.0.0 STABLE
            </v-chip>
          </div>
          <h1 class="text-h2 font-weight-black text-white tracking-tighter mb-4">About <span class="text-gradient">VimPGP</span></h1>
          <p class="text-h6 text-medium-emphasis mx-auto" style="max-width: 700px;">
            A modern, transparent, and ultra-secure OpenPGP identity management suite.
          </p>
        </div>

        <v-row class="mb-16">
          <v-col cols="12" md="4">
            <v-card class="glass-card pa-6 h-100 border-primary text-center">
              <v-icon color="primary" size="48" class="mb-4">mdi-code-braces</v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">Open Source</h3>
              <p class="text-body-2 text-medium-emphasis">
                Built on the battle-tested <strong>OpenPGP.js</strong> library. Our code is transparent, verifiable, and community-audited.
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="glass-card pa-6 h-100 border-primary text-center">
              <v-icon color="primary" size="48" class="mb-4">mdi-shield-check</v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">100% Client-Side</h3>
              <p class="text-body-2 text-medium-emphasis">
                All cryptographic operations happen exclusively in your browser. Your private keys never touch any server.
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="glass-card pa-6 h-100 border-primary text-center">
              <v-icon color="primary" size="48" class="mb-4">mdi-eye-off</v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">Zero Tracking</h3>
              <p class="text-body-2 text-medium-emphasis">
                No cookies, no analytics, no logs. Feel free to disconnect from the internet before generating your keys.
              </p>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="glass-card pa-8 rounded-xl mb-10">
          <h2 class="text-h4 font-weight-bold mb-6">Our <span class="text-gradient">Mission</span></h2>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Digital privacy should be accessible, beautiful, and uncompromising. VimPGP was born from the need for a modern tool that bridges the gap between complex cryptographic standards and the average user.
          </p>
          <p class="text-body-1 text-medium-emphasis mb-6">
            We believe that you should have full control over your digital identity. By leveraging the power of modern browsers and the OpenPGP.js library, we provide a secure environment where you can generate, manage, and protect your keys without needing to master the command line.
          </p>
          
          <v-divider class="my-8" style="opacity: 0.1"/>
          
          <div class="d-flex align-center justify-space-between flex-wrap gap-4">
            <div>
              <div class="text-caption text-disabled uppercase font-weight-bold tracking-widest mb-1">Developed By</div>
              <div class="text-h6 font-weight-bold ml-1">Vimlesh Kumar</div>
            </div>
            <v-btn
              prepend-icon="mdi-github"
              variant="tonal"
              color="primary"
              rounded="lg"
              href="https://github.com/Vimlesh-Kumar/vimpgp"
              target="_blank"
            >
              View Repository
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
useHead({
  title: 'About - VimPGP'
})
</script>
