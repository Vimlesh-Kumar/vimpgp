<template>
  <div>
    <div class="d-flex align-center mb-4">
       <h2 class="text-h5 font-weight-black uppercase tracking-widest text-primary">Your Keyring</h2>
       <!-- <v-divider class="ml-4" style="opacity: 0.1"/> -->
    </div>
    
    <div v-if="keys.length === 0" class="text-center py-16 glass-card rounded-xl border-dashed position-relative overflow-hidden premium-card">
       <v-avatar color="primary" variant="tonal" size="100" class="mb-6 elevation-8 shadow-glow pulse-avatar">
         <v-icon icon="mdi-shield-key-outline" size="50" color="primary"/>
       </v-avatar>
       <div class="text-h4 font-weight-black mb-3 text-gradient">No keys found</div>
       <div class="text-body-1 text-medium-emphasis mb-8 line-height-relaxed" style="max-width: 400px; margin: 0 auto;">
         Your secure keyring is currently empty. Generate a new cryptographic key pair to start encrypting and signing your messages.
       </div>
       <v-btn color="primary" size="x-large" to="/generate" prepend-icon="mdi-creation" elevation="8" class="font-weight-black rounded-lg px-8">Generate Key Pair</v-btn>
    </div>

    <v-row v-else class="g-6 align-stretch">
      <v-col v-for="key in keys" :key="key.id" cols="12" xl="6" class="d-flex">
        <v-card class="glass-card pa-0 w-100 d-flex flex-column transition-swing premium-card" hover>
          <!-- Card Header & Identity -->
          <div class="pa-5 pr-4">
            <div class="d-flex align-start justify-space-between">
               <div class="d-flex align-center overflow-hidden">
                 <div class="avatar-wrapper mr-4">
                    <v-avatar color="primary" variant="tonal" size="64" class="rounded-xl border-primary shadow-glow">
                      <span class="text-h4 font-weight-black">{{ key.name.charAt(0).toUpperCase() }}</span>
                    </v-avatar>
                    <v-badge dot color="success" offset-x="5" offset-y="5" class="status-badge-mini"></v-badge>
                 </div>
                 <div class="overflow-hidden">
                   <div class="text-h6 font-weight-black text-white mb-0 line-height-tight text-truncate" style="max-width: 250px;">{{ key.name }}</div>
                   <div class="text-caption text-medium-emphasis font-weight-bold text-truncate mb-1" style="max-width: 250px;">{{ key.email }}</div>
                   <div class="d-flex align-center flex-wrap gap-2 mt-1">
                     <v-chip size="x-small" color="primary" variant="flat" class="font-weight-black uppercase px-2" rounded="sm">
                       {{ key.type.toUpperCase() }}
                     </v-chip>
                     <span class="font-mono text-primary font-weight-black" style="font-size: 0.75rem; letter-spacing: 0.5px;">#{{ key.id.substring(8) }}</span>
                   </div>
                 </div>
               </div>

               <div class="text-right">
                  <div class="text-caption text-disabled uppercase font-weight-black tracking-widest mb-1" style="font-size: 0.65rem;">Created On</div>
                  <div class="text-body-2 font-weight-bold text-white">{{ new Date(key.createdAt).toLocaleDateString() }}</div>
               </div>
            </div>
            
            <!-- Details Grid -->
            <div class="details-box mt-5 pa-4 rounded-xl bg-black-alpha-20 border-1">
               <v-row no-gutters align="center">
                 <v-col cols="12">
                    <div class="text-disabled uppercase font-weight-black tracking-widest mb-1" style="font-size: 0.6rem;">Fingerprint</div>
                    <div class="font-mono text-white text-caption text-truncate letter-spacing-1">{{ key.fingerprint }}</div>
                 </v-col>
               </v-row>
            </div>
          </div>

          <v-spacer/>
          <v-divider style="opacity: 0.05"/>

          <!-- Actions Footer -->
          <v-card-actions class="pa-4 bg-black-alpha-10">
            <div class="d-flex gap-2">
              <v-tooltip text="Copy Public Key" location="top" open-delay="100">
                <template #activator="{ props }">
                   <v-btn v-bind="props" size="medium" variant="tonal" color="primary" icon="mdi-share-variant" class="rounded-lg action-btn-hover" @click="copy(key.publicKey, 'Public Key')"/>
                </template>
              </v-tooltip>
              
              <v-tooltip text="Copy Private Key" location="top" open-delay="100">
                <template #activator="{ props }">
                  <v-btn v-bind="props" size="medium" variant="tonal" color="secondary" icon="mdi-shield-key" class="rounded-lg action-btn-hover" @click="copy(key.privateKey, 'Private Key')"/>
                </template>
              </v-tooltip>
            </div>

            <v-spacer/>
            
            <div class="d-flex align-center gap-2">
               <v-btn size="medium" variant="flat" color="primary" class="font-weight-black px-6 rounded-lg" :to="`/key/${key.id}`">
                 Manage Key
               </v-btn>
               
               <v-menu location="bottom end">
                 <template #activator="{ props }">
                   <v-btn v-bind="props" icon="mdi-dots-vertical" variant="tonal" size="small" class="rounded-lg action-btn-hover"/>
                 </template>
                 <v-list class="glass-panel" density="compact" min-width="150">
                   <v-list-item prepend-icon="mdi-delete-outline" title="Destroy Key" base-color="error" class="font-weight-bold" @click="confirmDelete(key.id)"/>
                 </v-list>
               </v-menu>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    
    <v-snackbar v-model="snackbar" :color="snackbarColor" location="bottom right">
      {{ snackbarText }}
      <template #actions>
        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
const { keys, deleteKey, initKeys } = usePgp()
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

onMounted(() => {
  initKeys()
})

const copy = (text: string, type: string) => {
  navigator.clipboard.writeText(text)
  snackbarText.value = `${type} copied to clipboard`
  snackbarColor.value = 'success'
  snackbar.value = true
}

const confirmDelete = (id: string) => {
  if(confirm('Are you sure you want to delete this key? This cannot be undone.')) {
     deleteKey(id)
     snackbarText.value = 'Key deleted permanently'
     snackbarColor.value = 'info'
     snackbar.value = true
  }
}
</script>

<style scoped>
.font-mono {
  font-family: 'Roboto Mono', monospace;
}
.bg-black-alpha-10 {
  background-color: rgba(0,0,0,0.2);
}
.bg-black-alpha-20 {
  background-color: rgba(0,0,0,0.4);
}
.border-dashed {
  border-style: dashed !important;
  border-width: 2px !important;
  border-color: rgba(var(--v-theme-primary), 0.2) !important;
}
.pulse-avatar {
  animation: pulse-glow 3s infinite ease-in-out;
}
@keyframes pulse-glow {
  0% { box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(var(--v-theme-primary), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0); }
}
.premium-card {
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  background: rgba(255, 255, 255, 0.03) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
}
.premium-card:hover {
  z-index: 10;
  transform: translateY(-4px) scale(1.005);
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
  box-shadow: 0 12px 40px rgba(0,0,0,0.6) !important;
}
.details-box {
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.letter-spacing-1 {
  letter-spacing: 0.5px;
}
.gap-2 {
  gap: 8px;
}
.line-height-tight {
  line-height: 1.25;
}
.avatar-wrapper {
  position: relative;
}
.status-badge-mini {
  position: absolute;
  bottom: 2px;
  right: 2px;
}
.action-btn-hover {
  transition: all 0.2s ease;
}
.action-btn-hover:hover {
  transform: translateY(-2px);
  filter: brightness(1.2);
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
