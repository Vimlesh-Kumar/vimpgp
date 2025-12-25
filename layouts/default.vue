<template>
  <v-app class="app-container">
    <v-app-bar flat class="glass-effect" height="70">
      <template #prepend>
        <div class="d-flex align-center ml-4">
          <v-icon icon="mdi-shield-lock-outline" size="32" color="primary" class="mr-2"/>
          <div class="text-h5 font-weight-bold tracking-wide">
            <span class="text-white">Vim</span><span class="text-gradient">PGP</span>
          </div>
        </div>
      </template>

      <v-spacer/>

      <div class="d-none d-sm-flex align-center mr-4">
        <v-btn
          prepend-icon="mdi-view-dashboard-outline"
          to="/"
          variant="text"
          class="text-body-1"
          rounded="lg"
        >Dashboard</v-btn>
        
        <v-btn
          prepend-icon="mdi-key-plus"
          to="/generate"
          variant="text"
          class="text-body-1 mx-2"
           rounded="lg"
        >Generate</v-btn>
        
        <v-btn
           icon
           variant="text"
           href="https://github.com/Vimlesh-Kumar"
           target="_blank"
           title="View on GitHub"
        >
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </div>
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

<style scoped>
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
  filter: blur(80px);
  opacity: 0.4;
  border-radius: 50%;
  animation: float 20s infinite ease-in-out;
}

.blob-1 {
  background: #6200ea;
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.blob-2 {
  background: #00e5ff;
  width: 300px;
  height: 300px;
  bottom: 0;
  right: -50px;
  animation-delay: -5s;
}

.blob-3 {
  background: #ff4081;
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
