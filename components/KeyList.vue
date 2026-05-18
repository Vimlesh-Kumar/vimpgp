<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
       <h2 class="text-h6 font-weight-black uppercase tracking-widest text-primary d-flex align-center">
         <v-icon color="primary" class="mr-2" size="20">mdi-key-chain-variant</v-icon>
         Your Keyring
       </h2>
       
       <div class="d-flex gap-2">
         <v-btn variant="tonal" size="small" color="secondary" prepend-icon="mdi-import" class="rounded-lg font-weight-bold" @click="importDialog = true">
           Import
         </v-btn>
         <v-btn color="primary" size="small" prepend-icon="mdi-plus" to="/generate" class="rounded-lg font-weight-bold shadow-glow">
           New Pair
         </v-btn>
       </div>
    </div>
    
    <div v-if="keys.length === 0" class="text-center py-12 glass-card rounded-xl border-dashed position-relative overflow-hidden premium-card">
       <div class="bg-glow"/>
       <v-avatar color="primary" variant="tonal" size="80" class="mb-5 elevation-8 shadow-glow pulse-avatar">
         <v-icon icon="mdi-shield-key-outline" size="40" color="primary"/>
       </v-avatar>
       <div class="text-h5 font-weight-black mb-2 text-gradient">Secure Keyring Empty</div>
       <div class="text-body-2 text-medium-emphasis mb-6 line-height-relaxed" style="max-width: 400px; margin: 0 auto;">
         Your local cryptographic vault is ready. Create your first identity or import an existing PGP key to start secure communication.
       </div>
       <div class="d-flex justify-center gap-3">
         <v-btn color="primary" size="large" to="/generate" prepend-icon="mdi-creation" elevation="8" class="font-weight-black rounded-lg px-6">Generate</v-btn>
         <v-btn color="secondary" variant="tonal" size="large" prepend-icon="mdi-import" class="font-weight-black rounded-lg px-6" @click="importDialog = true">Import</v-btn>
       </div>
    </div>

    <v-row v-else class="g-6 align-stretch">
      <v-col v-for="key in keys" :key="key.id" cols="12" lg="6" class="d-flex">
        <v-card class="glass-card pa-0 w-100 d-flex flex-column transition-swing premium-card" hover>
          <!-- Card Header & Identity -->
          <div class="pa-4 pr-3">
            <div class="d-flex align-start justify-space-between">
               <div class="d-flex align-center overflow-hidden">
                 <div class="avatar-wrapper mr-3">
                    <v-avatar color="primary" variant="tonal" size="48" class="rounded-lg border-primary shadow-glow">
                      <span class="text-h6 font-weight-black">{{ key.name.charAt(0).toUpperCase() }}</span>
                    </v-avatar>
                    <v-badge dot color="success" offset-x="5" offset-y="5" class="status-badge-mini"/>
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
              <v-tooltip v-if="key.passphrase" text="Copy Passphrase" location="top" open-delay="100">
                <template #activator="{ props }">
                   <v-btn v-bind="props" size="medium" variant="tonal" color="tertiary" icon="mdi-eye" class="rounded-lg action-btn-hover" @click="copy(key.passphrase, 'Passphrase')"/>
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

    <!-- Import Dialog -->
    <v-dialog v-model="importDialog" max-width="600">
      <v-card class="glass-card pa-6 rounded-xl border-1 overflow-visible">
        <h3 class="text-h5 font-weight-black mb-1">Import PGP Key</h3>
        <p class="text-caption text-disabled mb-6 uppercase tracking-widest">Paste your armored public or private key</p>
        
        <v-textarea
          v-model="importArmoredKey"
          placeholder="-----BEGIN PGP KEY BLOCK-----..."
          variant="solo-filled"
          rows="10"
          class="custom-textarea font-mono text-caption"
          rounded="lg"
          hide-details
        />
        
        <div class="d-flex justify-end gap-3 mt-8">
          <v-btn variant="text" @click="importDialog = false">Cancel</v-btn>
          <v-btn color="primary" class="font-weight-black rounded-lg px-6" :loading="importing" @click="handleImport">Import into Keyring</v-btn>
        </div>
      </v-card>
    </v-dialog>
    
    <v-snackbar v-model="snackbar" :color="snackbarColor" location="bottom right">
      {{ snackbarText }}
      <template #actions>
        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
const { keys, deleteKey, initKeys, importKey } = usePgp()
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const importDialog = ref(false)
const importing = ref(false)
const importArmoredKey = ref('')

onMounted(() => {
  initKeys()
})

const handleImport = async () => {
  if (!importArmoredKey.value) return
  importing.value = true
  try {
    await importKey(importArmoredKey.value)
    snackbarText.value = 'Key successfully imported'
    snackbarColor.value = 'success'
    snackbar.value = true
    importDialog.value = false
    importArmoredKey.value = ''
  } catch (e: unknown) {
    const error = e as Error
    snackbarText.value = 'Failed to import: ' + error.message
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    importing.value = false
  }
}

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
  filter: brightness(1.5);
  background-color: rgba(var(--v-theme-primary), 0.15) !important;
}

.action-btn-hover:hover .v-icon {
  color: inherit !important;
}
</style>
