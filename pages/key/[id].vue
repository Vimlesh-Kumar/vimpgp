<template>
  <div v-if="key">
    <div class="mb-6">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/">Back to Dashboard</v-btn>
    </div>

    <v-card class="glass-card pa-6 mb-6">
       <div class="d-flex justify-space-between align-start">
         <div>
            <div class="d-flex align-center mb-2">
              <h1 class="text-h4 font-weight-bold mr-4">{{ key.name }}</h1>
              <v-chip color="success" variant="outlined" class="font-weight-bold text-uppercase">{{ key.type }}</v-chip>
            </div>
            <div class="text-h6 text-medium-emphasis mb-4">{{ key.email }}</div>
            
            <div class="d-flex align-center text-caption font-mono text-disabled">
               <v-icon size="small" class="mr-1">mdi-fingerprint</v-icon>
               {{ key.fingerprint }}
            </div>
         </div>
         
         <div class="d-flex gap-2">
            <v-btn color="primary" variant="flat" prepend-icon="mdi-download" @click="download(key.publicKey, `${key.name}_public.asc`)">Export Public</v-btn>
            <v-btn color="secondary" variant="flat" prepend-icon="mdi-shield-key" @click="download(key.privateKey, `${key.name}_private.asc`)">Export Private</v-btn>
         </div>
       </div>
    </v-card>
    
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="glass-card pa-6">
          <h3 class="text-h6 font-weight-bold mb-4">Subkeys</h3>
          
          <v-table class="bg-transparent">
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Type</th>
                <th class="text-left">Algorithm</th>
                <th class="text-left">Size</th>
                <th class="text-left">Created</th>
                <th class="text-left">Expires</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subkey in subkeys" :key="subkey.id">
                 <td class="font-mono text-caption">
                    {{ subkey.id ? subkey.id.substring(8) : 'Pending' }}
                    <v-chip v-if="subkey.isPrimary" size="x-small" color="primary" class="ml-2">Primary</v-chip>
                 </td>
                 <td>
                     <div class="d-flex align-center">
                         <v-icon v-if="subkey.isPrimary || subkey.type ==='certify' || subkey.type === 'sign'" icon="mdi-shield-account" size="small" color="secondary" class="mr-2"></v-icon>
                         <v-icon v-else-if="subkey.type === 'encrypt'" icon="mdi-shield-lock" size="small" color="secondary" class="mr-2"></v-icon>
                         <v-icon v-else icon="mdi-shield-check" size="small" color="secondary" class="mr-2"></v-icon>
                         <span class="text-capitalize">{{ subkey.type || 'Unknown' }}</span>
                     </div>
                 </td>
                 <td>{{ subkey.algo }}</td>
                 <td>{{ subkey.curve || subkey.bits + ' bits' }}</td>
                 <td>{{ new Date(subkey.created).toLocaleDateString() }}</td>
                 <td>{{ subkey.expiry ? new Date(subkey.expiry).toLocaleDateString() : 'Never' }}</td>
              </tr>
            </tbody>
          </v-table>
          
           <div class="mt-6 text-center">
              <v-dialog v-model="showAddSubkey" max-width="500">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" variant="outlined" color="primary" prepend-icon="mdi-plus">Add Subkey</v-btn>
                </template>
                <v-card class="glass-card">
                  <v-card-title class="text-h5 font-weight-bold">Add New Subkey</v-card-title>
                  <v-card-text>
                    <v-select
                      v-model="subkeyForm.type"
                      label="Key Type"
                      :items="[{title: 'Signing Key', value: 'sign'}, {title: 'Encryption Key', value: 'encrypt'}, {title: 'Authentication Key', value: 'auth'}]"
                      variant="solo-filled"
                      menu-props="{ contentClass: 'glass-panel' }"
                    ></v-select>
                    
                    <v-select
                      v-model="subkeyForm.algo"
                      label="Algorithm"
                      :items="[{title: 'ECC', value: 'ecc'}, {title: 'RSA', value: 'rsa'}]"
                      variant="solo-filled"
                      menu-props="{ contentClass: 'glass-panel' }"
                    ></v-select>
                    
                     <v-select
                      v-if="subkeyForm.algo === 'ecc'"
                      v-model="subkeyForm.size"
                      label="Curve"
                      :items="[{title: 'Curve25519', value: 25519}, {title: 'NIST P-256', value: 256}, {title: 'NIST P-384', value: 384}, {title: 'NIST P-521', value: 521}]"
                      variant="solo-filled"
                      menu-props="{ contentClass: 'glass-panel' }"
                    ></v-select>

                    <v-select
                      v-if="subkeyForm.algo === 'rsa'"
                      v-model="subkeyForm.size"
                      label="Key Size"
                      :items="[
                        {title: '1024 bits (Weak)', value: 1024},
                        {title: '2048 bits', value: 2048},
                        {title: '3072 bits', value: 3072},
                        {title: '4096 bits', value: 4096},
                        {title: '8192 bits', value: 8192}
                      ]"
                      variant="solo-filled"
                      menu-props="{ contentClass: 'glass-panel' }"
                    ></v-select>

                    <v-select
                      v-model="subkeyForm.expiry"
                      label="Expiration"
                      :items="[
                        {title: 'Never', value: 0},
                        {title: '30 Days', value: 2592000},
                        {title: '90 Days', value: 7776000},
                        {title: '6 Months', value: 15552000},
                        {title: '1 Year', value: 31536000},
                        {title: '2 Years', value: 63072000},
                        {title: '3 Years', value: 94608000},
                        {title: '5 Years', value: 157680000}
                      ]"
                      variant="solo-filled"
                      menu-props="{ contentClass: 'glass-panel' }"
                    ></v-select>
                    
                    <v-text-field
                      v-model="subkeyForm.passphrase"
                      label="Passphrase (to unlock primary key)"
                      type="password"
                      variant="solo-filled"
                      hint="Required to sign the new subkey"
                      persistent-hint
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="white" variant="text" @click="showAddSubkey = false">Cancel</v-btn>
                    <v-btn color="primary" @click="handleAddSubkey" :loading="subkeyLoading">Generate Subkey</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
           </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="glass-card pa-6 h-100">
           <h3 class="text-h6 font-weight-bold mb-4 text-error">Danger Zone</h3>
           <p class="text-caption text-medium-emphasis mb-4">
             Deleting this key will remove it from your browser storage permanently.
             Make sure you have a backup.
           </p>
           <v-dialog v-model="showDeleteConfirm" max-width="400">
               <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="error" block variant="outlined" prepend-icon="mdi-delete">Delete Key Pair</v-btn>
               </template>
               <v-card class="glass-card">
                   <v-card-title class="text-h5 font-weight-bold text-error">Delete Key?</v-card-title>
                   <v-card-text>
                       Are you sure you want to delete this key pair? This action cannot be undone.
                   </v-card-text>
                   <v-card-actions>
                       <v-spacer></v-spacer>
                       <v-btn color="white" variant="text" @click="showDeleteConfirm = false">Cancel</v-btn>
                       <v-btn color="error" @click="handleDeleteConfirm">Confirm Delete</v-btn>
                   </v-card-actions>
               </v-card>
           </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <div v-else class="py-12 text-center">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
    <div class="mt-4">Loading or Key not found...</div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, reactive, watch } from 'vue'
const route = useRoute()
const router = useRouter()
const { keys, deleteKey, initKeys, getKeyDetails, generateSubkey, loading } = usePgp()

const subkeys = ref([])
const activeTab = ref('details')
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
