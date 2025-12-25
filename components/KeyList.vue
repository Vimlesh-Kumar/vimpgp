<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
       <h2 class="text-h4 font-weight-bold text-gradient">Your Keyring</h2>
       <v-btn v-if="keys.length > 0" to="/generate" color="primary" prepend-icon="mdi-plus" class="font-weight-bold">New Key</v-btn>
    </div>
    
    <div v-if="keys.length === 0" class="text-center py-16 glass-card rounded-xl border-dashed">
       <v-avatar color="surface" size="80" class="mb-4 elevation-4">
         <v-icon icon="mdi-shield-key-outline" size="40" color="primary"/>
       </v-avatar>
       <div class="text-h5 font-weight-bold mb-2">No keys found</div>
       <div class="text-body-1 text-medium-emphasis mb-8" style="max-width: 400px; margin: 0 auto;">
         Your local browser storage is empty. Create a new PGP key pair to securely encrypt and sign your messages.
       </div>
       <v-btn color="primary" size="large" to="/generate" prepend-icon="mdi-creation" elevation="8">Generate Key Pair</v-btn>
    </div>

    <v-row v-else>
      <v-col v-for="key in keys" :key="key.id" cols="12" md="6">
        <v-card class="glass-card pa-0 h-100 d-flex flex-column transition-swing" hover>
          <div class="pa-5 pb-3">
            <div class="d-flex align-start justify-space-between mb-3">
               <div class="d-flex align-center">
                 <v-avatar color="primary" variant="tonal" size="56" class="mr-3" rounded="lg">
                   <span class="text-h5 font-weight-bold">{{ key.name.charAt(0).toUpperCase() }}</span>
                 </v-avatar>
                 <div>
                   <div class="text-h6 font-weight-bold">{{ key.name }}</div>
                   <div class="text-body-2 text-medium-emphasis">{{ key.email }}</div>
                 </div>
               </div>
               <v-chip size="small" :color="key.type === 'ecc' ? 'success' : 'info'" variant="tonal" class="text-uppercase font-weight-bold">
                 {{ key.type }}
               </v-chip>
            </div>
            
            <v-divider class="my-3"/>
            
            <div class="bg-surface-lighten-1 rounded pa-3 mb-2">
               <div class="d-flex justify-space-between text-body-2 mb-2">
                 <span class="text-disabled font-weight-medium">Key ID</span>
                 <span class="font-mono text-primary">{{ key.id.substring(8) }}</span>
               </div>
               <div class="d-flex justify-space-between text-body-2 mb-2">
                 <span class="text-disabled font-weight-medium">Fingerprint</span>
                 <span class="font-mono text-caption">{{ key.fingerprint ? key.fingerprint.substring(0, 16) + '...' : 'N/A' }}</span>
               </div>
               <div class="d-flex justify-space-between text-body-2 mb-2">
                  <span class="text-disabled font-weight-medium">Created</span>
                  <span>{{ new Date(key.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
               </div>
               <div class="d-flex justify-space-between text-body-2">
                  <span class="text-disabled font-weight-medium">Algorithm</span>
                  <span class="text-uppercase">{{ key.type }}</span>
               </div>
            </div>
          </div>

          <v-divider/>

          <v-card-actions class="pa-3 bg-black-alpha-10">
            <v-tooltip text="Copy Public Key" location="top">
              <template #activator="{ props }">
                 <v-btn v-bind="props" size="small" variant="text" color="primary" icon="mdi-share-variant" @click="copy(key.publicKey, 'Public Key')"/>
              </template>
            </v-tooltip>
            
            <v-tooltip text="Copy Private Key" location="top">
              <template #activator="{ props }">
                <v-btn v-bind="props" size="small" variant="text" color="secondary" icon="mdi-shield-key" @click="copy(key.privateKey, 'Private Key')"/>
              </template>
            </v-tooltip>

            <v-spacer/>
            
             <v-btn size="small" variant="tonal" class="mr-1" color="white" :to="`/key/${key.id}`">Manage</v-btn>
             
             <v-menu>
               <template #activator="{ props }">
                 <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text" size="small"/>
               </template>
               <v-list class="glass-panel" density="compact">
                 <v-list-item prepend-icon="mdi-delete" title="Delete Key" base-color="error" @click="confirmDelete(key.id)"/>
               </v-list>
             </v-menu>
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
.border-dashed {
  border-style: dashed !important;
  border-width: 2px !important;
}
</style>
