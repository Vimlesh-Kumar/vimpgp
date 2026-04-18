<template>
  <div v-if="key" class="py-6">
    <div class="mb-8">
      <v-btn variant="tonal" prepend-icon="mdi-arrow-left" to="/" color="primary" class="rounded-lg font-weight-bold">Back to Dashboard</v-btn>
    </div>

    <v-card class="glass-card pa-8 mb-8 rounded-xl border-primary shadow-glow overflow-hidden position-relative">
       <div class="bg-glow"/>
       <div class="d-flex flex-column flex-md-row justify-space-between align-start gap-6 position-relative" style="z-index: 1;">
         <div class="d-flex align-center">
            <v-avatar color="primary" variant="tonal" size="80" class="mr-6 rounded-xl border-primary shadow-glow">
              <span class="text-h3 font-weight-black">{{ key.name.charAt(0).toUpperCase() }}</span>
            </v-avatar>
            <div>
               <div class="d-flex align-center flex-wrap gap-3 mb-2">
                 <h1 class="text-h3 font-weight-black text-white tracking-tighter">{{ key.name }}</h1>
                 <v-chip color="primary" variant="flat" size="small" class="font-weight-black text-uppercase">{{ key.type }}</v-chip>
               </div>
               <div class="text-h6 text-medium-emphasis mb-4">{{ key.email }}</div>
               
               <div class="d-flex align-center px-4 py-2 rounded-lg bg-black-alpha-40 border-1 text-caption font-mono text-primary w-fit">
                  <v-icon size="small" class="mr-2">mdi-fingerprint</v-icon>
                  {{ key.fingerprint }}
               </div>
            </div>
         </div>
         
         <div class="d-flex flex-column flex-sm-row gap-3 w-100 w-md-auto mt-4 mt-md-0">
            <v-btn color="primary" variant="elevated" prepend-icon="mdi-download" height="50" class="rounded-xl px-6 font-weight-black shadow-glow" @click="download(key.publicKey, `${key.name}_public.asc`)">Export Public</v-btn>
            <v-btn color="secondary" variant="tonal" prepend-icon="mdi-shield-key" height="50" class="rounded-xl px-6 font-weight-black" @click="download(key.privateKey, `${key.name}_private.asc`)">Export Private</v-btn>
         </div>
       </div>
    </v-card>
    
    <v-row>
      <v-col cols="12" lg="8">
        <v-card class="glass-card pa-8 rounded-xl border-1 overflow-hidden">
          <div class="d-flex align-center justify-space-between mb-8">
            <h3 class="text-h5 font-weight-black uppercase tracking-widest text-primary">Cryptographic Subkeys</h3>
            <v-dialog v-model="showAddSubkey" max-width="550">
                <template #activator="{ props }">
                  <v-btn v-bind="props" color="primary" variant="tonal" prepend-icon="mdi-plus" class="rounded-lg font-weight-black">Add Subkey</v-btn>
                </template>
                <v-card class="glass-card pa-6 rounded-xl border-1 overflow-visible">
                  <h3 class="text-h5 font-weight-black mb-1">New Identity Subkey</h3>
                  <p class="text-caption text-disabled mb-8 uppercase tracking-widest">Expand your key capability</p>
                  
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="subkeyForm.type"
                        label="Usage Type"
                        :items="[{title: 'Signing Key', value: 'sign'}, {title: 'Encryption Key', value: 'encrypt'}, {title: 'Authentication Key', value: 'auth'}]"
                        variant="solo-filled"
                        class="custom-input"
                        rounded="lg"
                        menu-props="{ contentClass: 'glass-panel' }"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="subkeyForm.algo"
                        label="Algorithm"
                        :items="[{title: 'ECC', value: 'ecc'}, {title: 'RSA', value: 'rsa'}]"
                        variant="solo-filled"
                        class="custom-input"
                        rounded="lg"
                        menu-props="{ contentClass: 'glass-panel' }"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-if="subkeyForm.algo === 'ecc'"
                        v-model="subkeyForm.size"
                        label="Elliptic Curve"
                        :items="[{title: 'Curve25519', value: 25519}, {title: 'NIST P-256', value: 256}]"
                        variant="solo-filled"
                        class="custom-input"
                        rounded="lg"
                      />
                      <v-select
                        v-if="subkeyForm.algo === 'rsa'"
                        v-model="subkeyForm.size"
                        label="RSA Modulus"
                        :items="[{title: '2048 bits', value: 2048}, {title: '4096 bits', value: 4096}]"
                        variant="solo-filled"
                        class="custom-input"
                        rounded="lg"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="subkeyForm.passphrase"
                        label="Main Key Passphrase"
                        type="password"
                        variant="solo-filled"
                        class="custom-input"
                        rounded="lg"
                        persistent-hint
                        hint="Required to authenticate subkey addition"
                      />
                    </v-col>
                  </v-row>
                  
                  <div class="d-flex justify-end gap-3 mt-8">
                    <v-btn variant="text" @click="showAddSubkey = false">Cancel</v-btn>
                    <v-btn color="primary" class="font-weight-black rounded-lg px-8" height="48" :loading="subkeyLoading" @click="handleAddSubkey">Generate Subkey</v-btn>
                  </div>
                </v-card>
              </v-dialog>
          </div>
          
          <v-table class="bg-transparent custom-table">
            <thead>
              <tr>
                <th class="text-left font-weight-black grey-text uppercase">Identity ID</th>
                <th class="text-left font-weight-black grey-text uppercase">Purpose</th>
                <th class="text-left font-weight-black grey-text uppercase">Cipher</th>
                <th class="text-left font-weight-black grey-text uppercase">Created</th>
                <th class="text-left font-weight-black grey-text uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subkey in subkeys" :key="subkey.id" class="table-row">
                 <td class="font-mono text-caption text-primary font-weight-bold">
                    #{{ subkey.id ? subkey.id.substring(8) : 'PENDING' }}
                 </td>
                 <td>
                    <div class="d-flex align-center">
                        <v-icon v-if="subkey.isPrimary || subkey.type ==='certify' || subkey.type === 'sign'" icon="mdi-shield-account" size="small" color="primary" class="mr-2"/>
                        <v-icon v-else-if="subkey.type === 'encrypt'" icon="mdi-shield-lock" size="small" color="secondary" class="mr-2"/>
                        <v-icon v-else icon="mdi-shield-check" size="small" color="info" class="mr-2"/>
                        <span class="text-capitalize font-weight-bold">{{ subkey.type || 'System' }}</span>
                    </div>
                 </td>
                 <td class="text-caption font-weight-medium">{{ subkey.algo }} / {{ subkey.curve || subkey.bits + 'b' }}</td>
                 <td class="text-caption">{{ new Date(subkey.created).toLocaleDateString() }}</td>
                 <td>
                    <v-chip size="x-small" :color="subkey.isPrimary ? 'primary' : 'success'" variant="tonal" class="font-weight-black">
                      {{ subkey.isPrimary ? 'PRIMARY' : 'ACTIVE' }}
                    </v-chip>
                 </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
      
      <v-col cols="12" lg="4">
        <v-card class="glass-card pa-8 rounded-xl border-1 h-100 bg-black-alpha-20 border-error-muted">
           <div class="d-flex align-center mb-6 text-error">
             <v-icon class="mr-3">mdi-alert-octagon</v-icon>
             <h3 class="text-h6 font-weight-black uppercase tracking-wider">Danger Zone</h3>
           </div>
           
           <p class="text-body-2 text-disabled mb-8 line-height-relaxed">
             Deleting this key pair is irreversible. All messages encrypted with this key will become <strong>permanently inaccessible</strong> unless you have an external backup of the private key.
           </p>
           
           <v-dialog v-model="showDeleteConfirm" max-width="450">
               <template #activator="{ props }">
                    <v-btn v-bind="props" color="error" block variant="tonal" height="54" class="rounded-xl font-weight-black" prepend-icon="mdi-delete-forever">Destroy Key Pair</v-btn>
               </template>
               <v-card class="glass-card pa-8 rounded-xl border-1">
                   <div class="text-center mb-6">
                     <v-avatar color="error" variant="tonal" size="70" class="mb-4">
                       <v-icon size="40">mdi-delete-alert</v-icon>
                     </v-avatar>
                     <h2 class="text-h4 font-weight-black text-white">Security Wipe?</h2>
                   </div>
                   <v-card-text class="text-center text-medium-emphasis">
                       This will permanently delete <strong>{{ key.name }}</strong> from local storage. Are you absolutely certain?
                   </v-card-text>
                   <v-card-actions class="mt-8 gap-3">
                       <v-btn variant="tonal" block size="large" class="rounded-lg font-weight-bold" @click="showDeleteConfirm = false">Abandon</v-btn>
                       <v-btn color="error" variant="flat" block size="large" class="rounded-lg font-weight-black" @click="handleDeleteConfirm">Confirm Wipe</v-btn>
                   </v-card-actions>
               </v-card>
           </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <div v-else class="py-12 text-center">
    <v-progress-circular indeterminate color="primary"/>
    <div class="mt-4">Loading or Key not found...</div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, reactive, watch } from 'vue'
const route = useRoute()
const router = useRouter()
const { keys, deleteKey, initKeys, getKeyDetails, generateSubkey } = usePgp()

const subkeys = ref([])

const showAddSubkey = ref(false)
const showDeleteConfirm = ref(false)
const subkeyForm = reactive({
    type: 'sign',
    algo: 'ecc',
    size: 25519,
    expiry: 0,
    passphrase: ''
})

const subkeyLoading = ref(false)

onMounted(async () => {
  initKeys()
  await refreshSubkeys()
})

const key = computed(() => {
  if (!keys.value) return null
  return keys.value.find(k => k.id === route.params.id)
})

const refreshSubkeys = async () => {
    if (key.value) {
        subkeys.value = await getKeyDetails(key.value.privateKey)
    }
}

watch(key, async (newKey) => {
    if (newKey) await refreshSubkeys()
})

watch(() => subkeyForm.algo, (newAlgo) => {
  if (newAlgo === 'ecc') subkeyForm.size = 25519
  else subkeyForm.size = 4096
})

const download = (content, filename) => {
  const element = document.createElement('a');
  const file = new Blob([content], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const handleDeleteConfirm = () => {
    deleteKey(key.value.id)
    showDeleteConfirm.value = false
    router.push('/')
}

const handleAddSubkey = async () => {
    subkeyLoading.value = true;
    try {
        await generateSubkey(key.value.id, subkeyForm.passphrase, subkeyForm.type, subkeyForm.algo, subkeyForm.size, subkeyForm.expiry)
        showAddSubkey.value = false
        subkeyForm.passphrase = '' // clear sensitive data
        await refreshSubkeys() // Refresh list
    } catch (e) {
        alert(e.message)
    } finally {
        subkeyLoading.value = false;
    }
}

useHead({
  title: computed(() => key.value ? `Manage ${key.value.name} - VimPGP` : 'Manage Key')
})
</script>

<style scoped>
.gap-3 { gap: 12px; }
.gap-6 { gap: 24px; }
.w-fit { width: fit-content; }

.bg-black-alpha-40 {
  background-color: rgba(0, 0, 0, 0.4);
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

.shadow-glow {
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.3) !important;
}

.grey-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.65rem;
  letter-spacing: 1.5px;
}

.custom-table :deep(th) {
  border-bottom: 2px solid rgba(255, 255, 255, 0.05) !important;
}

.custom-table :deep(td) {
  padding: 20px 16px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03) !important;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: rgba(255, 255, 255, 0.02) !important;
}

.border-error-muted {
  border: 1px solid rgba(var(--v-theme-error), 0.2) !important;
}

.line-height-relaxed {
  line-height: 1.6;
}

.custom-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.tracking-tighter {
  letter-spacing: -2px;
}
</style>
