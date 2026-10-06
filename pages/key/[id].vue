<template>
  <div v-if="key">
    <div class="mb-6">
      <v-btn variant="tonal" prepend-icon="mdi-arrow-left" to="/" color="primary" class="font-weight-bold">Back to dashboard</v-btn>
    </div>

    <!-- Identity header -->
    <v-card class="surface-card pa-6 pa-md-8 mb-8 overflow-hidden position-relative">
      <div class="header-glow" />
      <div class="d-flex flex-column flex-md-row justify-space-between align-md-center ga-6 position-relative" style="z-index: 1;">
        <div class="d-flex align-center">
          <v-avatar color="primary" variant="tonal" size="72" rounded="lg" class="mr-5">
            <span class="text-h4 font-weight-black">{{ (key.name || '?').charAt(0).toUpperCase() }}</span>
          </v-avatar>
          <div class="overflow-hidden">
            <div class="d-flex align-center flex-wrap ga-3 mb-1">
              <h1 class="text-h5 text-md-h4 font-weight-black tracking-tighter text-truncate">{{ key.name }}</h1>
              <v-chip color="primary" variant="tonal" size="small" class="font-weight-bold uppercase">{{ key.type }}</v-chip>
            </div>
            <div class="text-body-2 text-medium-emphasis mb-3">{{ key.email || 'No email' }}</div>
            <div class="inset-box d-inline-flex align-center pa-2 px-3 font-mono text-caption text-primary">
              <v-icon size="15" class="mr-2">mdi-fingerprint</v-icon>{{ key.fingerprint }}
            </div>
          </div>
        </div>

        <div class="d-flex flex-column flex-sm-row ga-3">
          <v-btn color="primary" prepend-icon="mdi-download" class="font-weight-bold shadow-glow" @click="download(key.publicKey, `${key.name}_public.asc`)">Export public</v-btn>
          <v-btn v-if="key.privateKey" color="secondary" variant="tonal" prepend-icon="mdi-shield-key" class="font-weight-bold" @click="download(key.privateKey, `${key.name}_private.asc`)">Export private</v-btn>
        </div>
      </div>
    </v-card>

    <v-row>
      <!-- Subkeys -->
      <v-col cols="12" lg="8">
        <v-card class="surface-card pa-5 pa-sm-7">
          <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-5">
            <h2 class="text-h6 font-weight-black">Cryptographic components</h2>
            <v-btn v-if="key.privateKey" color="primary" variant="tonal" prepend-icon="mdi-plus" class="font-weight-bold" @click="showAddSubkey = true">Add subkey</v-btn>
          </div>

          <v-table class="bg-transparent">
            <thead>
              <tr>
                <th scope="col" class="eyebrow">Key ID</th>
                <th scope="col" class="eyebrow">Purpose</th>
                <th scope="col" class="eyebrow">Cipher</th>
                <th scope="col" class="eyebrow">Created</th>
                <th scope="col" class="eyebrow">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sub in subkeys" :key="sub.id">
                <td class="font-mono text-caption text-primary font-weight-bold">#{{ shortId(sub.id) }}</td>
                <td>
                  <div class="d-flex align-center ga-2">
                    <v-icon :icon="purposeIcon(sub)" size="18" :color="purposeColor(sub)" />
                    <span class="text-capitalize font-weight-bold">{{ purposeLabel(sub) }}</span>
                  </div>
                </td>
                <td class="text-caption font-weight-medium">{{ cipherLabel(sub) }}</td>
                <td class="text-caption">{{ formatDate(sub.created) }}</td>
                <td>
                  <v-chip size="x-small" :color="sub.expiry && new Date(sub.expiry) < new Date() ? 'error' : (sub.isPrimary ? 'primary' : 'success')" variant="tonal" class="font-weight-bold">
                    {{ statusLabel(sub) }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- File encryption + danger zone -->
      <v-col cols="12" lg="4">
        <v-card class="surface-card pa-5 pa-sm-7 mb-6">
          <h2 class="text-subtitle-1 font-weight-black mb-1">Create PGP file</h2>
          <p class="text-body-2 text-medium-emphasis mb-5">Upload a file or use a sample CSV (100 rows × 10 columns) and encrypt it to this key.</p>

          <v-file-input v-model="uploadedFile" label="File to encrypt" show-size class="mb-3" />
          <v-text-field v-model="destFilename" label="Destination filename (optional)" placeholder="myfile.asc or backup.gpg" class="mb-3" />
          <v-select v-model="selectedFormat" label="Output format" :items="formatItems" />
          <v-checkbox v-model="useDefaultCsv" label="Use sample CSV instead" hide-details class="mb-4" />

          <div class="d-flex flex-wrap ga-3">
            <v-btn color="primary" class="font-weight-bold" prepend-icon="mdi-lock" :loading="creatingFile" @click="handleCreatePgpFile">Create &amp; encrypt</v-btn>
            <v-btn variant="tonal" @click="generatePreviewCsv">Preview CSV</v-btn>
          </div>
        </v-card>

        <v-card class="surface-card pa-5 pa-sm-7 danger-zone">
          <div class="d-flex align-center ga-2 mb-4 text-error">
            <v-icon>mdi-alert-octagon-outline</v-icon>
            <h2 class="text-subtitle-1 font-weight-black uppercase tracking-wide">Danger zone</h2>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-6">
            Deleting this key pair is irreversible. Messages encrypted to it become <strong>permanently unreadable</strong> unless you kept an external backup.
          </p>
          <v-btn color="error" block variant="tonal" size="large" class="font-weight-bold" prepend-icon="mdi-delete-forever" @click="showDeleteConfirm = true">Destroy key pair</v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add subkey dialog -->
    <v-dialog v-model="showAddSubkey" max-width="560">
      <v-card class="glass-panel pa-6">
        <h3 class="text-h6 font-weight-black mb-1">New subkey</h3>
        <p class="text-caption text-medium-emphasis mb-5">Bind an additional signing or encryption key to this identity.</p>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select v-model="subkeyForm.type" label="Purpose" :items="typeItems" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select v-model="subkeyForm.algo" label="Algorithm" :items="algoItems" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select v-if="subkeyForm.algo === 'ecc'" v-model="subkeyForm.size" label="Curve" :items="curveItems" />
            <v-select v-else v-model="subkeyForm.size" label="Length" :items="rsaItems" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select v-model="subkeyForm.expiry" label="Expiry" :items="expiryItems" />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="subkeyForm.passphrase" label="Master passphrase" type="password" prepend-inner-icon="mdi-key-variant" hint="Required to unlock a passphrase-protected key" persistent-hint />
          </v-col>
        </v-row>
        <div class="d-flex justify-end ga-3 mt-6">
          <v-btn variant="text" @click="showAddSubkey = false">Cancel</v-btn>
          <v-btn color="primary" class="font-weight-bold px-6" :loading="subkeyLoading" @click="handleAddSubkey">Generate subkey</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete dialog -->
    <v-dialog v-model="showDeleteConfirm" max-width="440">
      <v-card class="glass-panel pa-7 text-center">
        <v-avatar color="error" variant="tonal" size="64" class="mb-4"><v-icon size="34">mdi-delete-alert</v-icon></v-avatar>
        <h3 class="text-h5 font-weight-black mb-2">Destroy this key?</h3>
        <p class="text-body-2 text-medium-emphasis mb-6">
          This permanently deletes <strong>{{ key.name }}</strong> from local storage.
        </p>
        <div class="d-flex ga-3">
          <v-btn variant="tonal" size="large" class="flex-1-1-0 font-weight-bold" @click="showDeleteConfirm = false">Cancel</v-btn>
          <v-btn color="error" size="large" class="flex-1-1-0 font-weight-bold" @click="handleDeleteConfirm">Confirm</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" location="bottom right" rounded="lg">{{ snackbarText }}</v-snackbar>
  </div>

  <div v-else class="py-16 text-center">
    <v-progress-circular indeterminate color="primary" />
    <div class="mt-4 text-medium-emphasis">Loading key…</div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, reactive, watch } from 'vue'

const route = useRoute()
const router = useRouter()
const { keys, deleteKey, initKeys, getKeyDetails, generateSubkey, encryptMessage } = usePgp()

const subkeys = ref([])
const showAddSubkey = ref(false)
const showDeleteConfirm = ref(false)
const subkeyLoading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const subkeyForm = reactive({ type: 'sign', algo: 'ecc', size: 25519, expiry: 0, passphrase: '' })

const typeItems = [
  { title: 'Signing key', value: 'sign' },
  { title: 'Encryption key', value: 'encrypt' },
]
const algoItems = [
  { title: 'ECC', value: 'ecc' },
  { title: 'RSA', value: 'rsa' },
]
const curveItems = [
  { title: 'Curve25519', value: 25519 },
  { title: 'NIST P-256', value: 256 },
  { title: 'NIST P-384', value: 384 },
]
const rsaItems = [
  { title: '2048 bits', value: 2048 },
  { title: '4096 bits', value: 4096 },
]
const formatItems = [
  { title: 'PGP (ASCII armored .asc)', value: 'pgp' },
  { title: 'GPG (binary .gpg)', value: 'gpg' },
]
const expiryItems = [
  { title: 'Never', value: 0 },
  { title: '1 year', value: 31536000 },
  { title: '2 years', value: 63072000 },
  { title: '5 years', value: 157680000 },
]

const key = computed(() => keys.value?.find(k => k.id === route.params.id) ?? null)

const refreshSubkeys = async () => {
  if (key.value) subkeys.value = await getKeyDetails(key.value.privateKey || key.value.publicKey)
}

const uploadedFile = ref(null)
const useDefaultCsv = ref(false)
const creatingFile = ref(false)
const destFilename = ref('')
const selectedFormat = ref('pgp')

const readFileAsText = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('Failed to read file'))
  reader.readAsText(file)
})

const generateDefaultCsv = (rows = 100, cols = 10) => {
  const headers = Array.from({ length: cols }, (_, i) => `col${i+1}`)
  const lines = [headers.join(',')]
  for (let r = 0; r < rows; r++) {
    const row = Array.from({ length: cols }, (_, c) => `val_${r+1}_${c+1}`)
    lines.push(row.join(','))
  }
  return lines.join('\n')
}

const generatePreviewCsv = () => {
  const csv = generateDefaultCsv()
  const w = window.open('about:blank')
  if (w) {
    w.document.write('<pre>' + csv.replace(/</g,'&lt;') + '</pre>')
    w.document.close()
  }
}

const handleCreatePgpFile = async () => {
  if (!key.value) return
  creatingFile.value = true
  try {
    let content = ''
    // determine default filename and extension
    let filename = destFilename.value || `${key.value.name.replace(/\s+/g,'_')}_encrypted`;
    const format = selectedFormat.value === 'gpg' ? 'binary' : 'armored'
    const ext = selectedFormat.value === 'gpg' ? '.gpg' : '.asc'

    if (useDefaultCsv.value) {
      content = generateDefaultCsv()
      if (!destFilename.value) filename = `${key.value.name.replace(/\s+/g,'_')}_sample.csv`;
    } else if (uploadedFile.value) {
      // uploadedFile may be File or array depending on v-file-input; normalize
      const file = Array.isArray(uploadedFile.value) ? uploadedFile.value[0] : uploadedFile.value
      if (!file) throw new Error('No file selected')
      const text = await readFileAsText(file)
      content = text
      // if user provided destFilename, use it; otherwise keep original file name
      if (!destFilename.value) filename = file.name
    } else {
      notify('Select a file or choose the sample CSV option', 'error')
      return
    }

    // ensure filename has extension
    if (!filename.toLowerCase().endsWith(ext)) filename = filename + ext

    const encrypted = await encryptMessage(content, [key.value.publicKey], format === 'binary' ? 'binary' : 'armored')

    const element = document.createElement('a')
    let blob
    if (format === 'binary') {
      // encrypted is Uint8Array
      blob = new Blob([encrypted], { type: 'application/octet-stream' })
    } else {
      blob = new Blob([encrypted], { type: 'text/plain' })
    }

    element.href = URL.createObjectURL(blob)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    notify('Encrypted file created and downloaded')
  } catch (e) {
    console.error(e)
    notify('Failed to create PGP file: ' + (e.message || e), 'error')
  } finally {
    creatingFile.value = false
  }
}

onMounted(async () => {
  initKeys()
  await refreshSubkeys()
})

watch(key, async (newKey) => { if (newKey) await refreshSubkeys() })
watch(() => subkeyForm.algo, (algo) => { subkeyForm.size = algo === 'ecc' ? 25519 : 4096 })

const shortId = id => (id?.length > 8 ? id.slice(-8) : id).toUpperCase()
const formatDate = iso => new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })

const purposeLabel = sub => (sub.isPrimary ? 'Certify' : sub.type)
const purposeIcon = sub => (sub.isPrimary || sub.type === 'sign' ? 'mdi-shield-account' : 'mdi-shield-lock')
const purposeColor = sub => (sub.isPrimary || sub.type === 'sign' ? 'primary' : 'secondary')

const cipherLabel = (sub) => {
  const algo = (sub.algo || '').toUpperCase()
  if (sub.curve) return `${algo} · ${sub.curve}`
  if (sub.bits) return `${algo} · ${sub.bits}-bit`
  return algo || '—'
}

const statusLabel = (sub) => {
  if (sub.expiry && new Date(sub.expiry) < new Date()) return 'Expired'
  return sub.isPrimary ? 'Primary' : 'Active'
}

const notify = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const download = (content, filename) => {
  const el = document.createElement('a')
  el.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
  el.download = filename
  document.body.appendChild(el)
  el.click()
  document.body.removeChild(el)
  URL.revokeObjectURL(el.href)
}

const handleDeleteConfirm = () => {
  deleteKey(key.value.id)
  showDeleteConfirm.value = false
  router.push('/')
}

const handleAddSubkey = async () => {
  subkeyLoading.value = true
  try {
    await generateSubkey(key.value.id, subkeyForm.passphrase, subkeyForm.type, subkeyForm.algo, subkeyForm.size, subkeyForm.expiry)
    showAddSubkey.value = false
    subkeyForm.passphrase = ''
    await refreshSubkeys()
    notify('Subkey added to your key')
  } catch (e) {
    notify(e.message, 'error')
  } finally {
    subkeyLoading.value = false
  }
}

useHead({ title: computed(() => (key.value ? `Manage ${key.value.name} - VimPGP` : 'Manage Key')) })
</script>

<style scoped>
.header-glow {
  position: absolute;
  top: -60%;
  left: -10%;
  width: 50%;
  height: 220%;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.12) 0%, transparent 65%);
  pointer-events: none;
}

.danger-zone { border-color: rgba(var(--v-theme-error), 0.25) !important; }

.v-table :deep(th) { border-bottom: 1px solid var(--hairline) !important; }
.v-table :deep(td) { border-bottom: 1px solid var(--hairline) !important; padding-top: 14px !important; padding-bottom: 14px !important; }
.v-table :deep(tbody tr:hover) { background: var(--card-bg-hover); }
</style>
