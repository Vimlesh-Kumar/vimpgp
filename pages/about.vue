<template>
  <div class="py-2 py-sm-8">
    <v-row justify="center">
      <v-col cols="12" md="11" lg="10">
        <div class="text-center mb-10">
          <div class="d-flex align-center justify-center mb-4">
             <v-avatar color="primary" variant="tonal" size="64" class="shadow-glow border-1">
               <v-icon icon="mdi-shield-account" size="32"/>
             </v-avatar>
          </div>
          <h1 class="text-h3 font-weight-black text-logo-white tracking-tighter mb-3">About <span class="text-gradient">VimPGP</span></h1>
          <p class="text-body-1 text-medium-emphasis mx-auto" style="max-width: 600px;">
            VimPGP is a military-grade, 100% client-side cryptographic suite designed for the modern web.
          </p>
        </div>

        <v-row class="mb-10">
          <v-col cols="12" md="4">
            <v-card class="glass-card pa-5 h-100 border-1 border-primary-muted text-center hover-lift">
              <v-icon color="primary" size="36" class="mb-4">mdi-security</v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">Zero-Trust Architecture</h3>
              <p class="text-body-2 text-disabled">
                All cryptographic operations happen in your browser's memory. No keys, passphrases, or plain-text data are ever transmitted to any server.
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="glass-card pa-5 h-100 border-1 border-primary-muted text-center hover-lift">
              <v-icon color="secondary" size="36" class="mb-4">mdi-open-source-initiative</v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">Open Standard</h3>
              <p class="text-body-2 text-disabled">
                Built on the world-renowned <strong>OpenPGP.js</strong>. Our implementation is fully source-visible and adheres to the official OpenPGP specifications.
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="glass-card pa-5 h-100 border-1 border-primary-muted text-center hover-lift">
              <v-icon color="info" size="36" class="mb-4">mdi-server-off</v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">Offline Ready</h3>
              <p class="text-body-2 text-disabled">
                Once loaded, VimPGP can function entirely offline. You can generate and export keys without an active internet connection.
              </p>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="glass-card pa-6 pa-sm-10 rounded-xl mb-10 overflow-hidden position-relative">
          <div class="bg-glow"/>
          <v-row align="center">
            <v-col cols="12" md="7">
              <h2 class="text-h4 font-weight-bold mb-4">The <span class="text-gradient">Integrity</span> Commitment</h2>
              <p class="text-body-1 text-medium-emphasis mb-4">
                In an era of increasing digital surveillance and centralized data silos, VimPGP provides a sanctuary for private communication. We don't have accounts because we don't want your data.
              </p>
              <p class="text-body-1 text-medium-emphasis mb-6">
                Our mission is to democratize high-level encryption by removing the technical barriers to entry. Secure your identity, sign your documents, and own your privacy with confidence.
              </p>
              
              <div class="d-flex flex-column flex-sm-row align-start align-sm-center gap-6 mt-8">
                <!-- <v-avatar size="64" class="border-primary shadow-glow" color="primary" variant="tonal">
                  <v-icon size="32">mdi-account-code</v-icon>
                </v-avatar> -->
                <div>
                   <div class="text-caption text-disabled font-weight-bold uppercase tracking-widest">Architect & Lead Developer</div>
                   <div class="text-h6 font-weight-black text-white">Vimlesh Kumar</div>
                   <div class="d-flex gap-2 mt-2">
                     <v-btn icon size="32" variant="tonal" color="primary" href="https://github.com/Vimlesh-Kumar" target="_blank" title="GitHub Profile">
                       <v-icon size="18">mdi-github</v-icon>
                     </v-btn>
                     <v-btn icon size="32" variant="tonal" color="primary" href="https://linkedin.com/in/vimleshkumar" target="_blank" title="LinkedIn Profile">
                       <v-icon size="18">mdi-linkedin</v-icon>
                     </v-btn>
                     <v-btn icon size="32" variant="tonal" color="primary" href="https://vimlesh.dev" target="_blank" title="Portfolio Site">
                       <v-icon size="18">mdi-earth</v-icon>
                     </v-btn>
                     <v-btn icon size="32" variant="tonal" color="primary" href="mailto:" title="Email Verification">
                       <v-icon size="18">mdi-email-seal</v-icon>
                     </v-btn>
                   </div>
                </div>
              </div>

              <v-divider class="my-8 d-md-none" style="opacity: 0.1"/>

              <div class="mt-8">
                <h4 class="text-subtitle-2 font-weight-black uppercase tracking-wider text-primary mb-3">Core Contribution</h4>
                <p class="text-body-2 text-disabled line-height-relaxed">
                  Vimlesh is a security-focused software engineer passionate about creating tools that empower users to own their data. VimPGP was built as a response to the lack of user-friendly, high-integrity PGP tools that work natively in the browser without compromising on cryptographic standards.
                </p>
              </div>
            </v-col>
            <v-col cols="12" md="5" class="d-none d-md-flex justify-center">
               <v-img src="/logo.png" max-width="200" class="opacity-40 grayscale-img"/>
            </v-col>
          </v-row>
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
