<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-5">
      <h2 class="text-h6 font-weight-black d-flex align-center ga-2">
        <v-icon color="primary" size="22">mdi-key-chain-variant</v-icon>
        Your Keyring
        <v-chip v-if="keys.length" size="x-small" variant="tonal" color="primary" class="font-weight-bold ml-1">{{ keys.length }}</v-chip>
      </h2>

      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="secondary" prepend-icon="mdi-tray-arrow-down" class="font-weight-bold" @click="importDialog = true">
          Import
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-plus" to="/generate" class="font-weight-bold shadow-glow">
          New Pair
        </v-btn>
      </div>
    </div>

    <!-- Empty state -->
    <v-card v-if="keys.length === 0" class="surface-card text-center py-12 px-6 empty-state">
      <v-avatar color="primary" variant="tonal" size="76" class="mb-5">
        <v-icon icon="mdi-shield-key-outline" size="38" color="primary" />
      </v-avatar>
      <div class="text-h6 font-weight-black mb-2">Your keyring is empty</div>
      <p class="text-body-2 text-medium-emphasis mb-6 mx-auto" style="max-width: 420px;">
        Create your first cryptographic identity or import an existing PGP key to start communicating securely.
      </p>
      <div class="d-flex justify-center flex-wrap ga-3">
        <v-btn color="primary" to="/generate" prepend-icon="mdi-creation" class="font-weight-bold px-6">Generate a key</v-btn>
        <v-btn variant="tonal" color="secondary" prepend-icon="mdi-tray-arrow-down" class="font-weight-bold px-6" @click="importDialog = true">Import a key</v-btn>
      </div>
    </v-card>

    <!-- Key cards -->
    <v-row v-else class="align-stretch">
      <v-col v-for="key in keys" :key="key.id" cols="12" lg="6" class="d-flex">
        <v-card class="surface-card lift w-100 d-flex flex-column pa-0">
          <div class="pa-4 pa-sm-5">
            <div class="d-flex align-start justify-space-between ga-3">
              <div class="d-flex align-center overflow-hidden">
                <div class="avatar-wrapper mr-3">
                  <v-avatar color="primary" variant="tonal" size="46" rounded="lg">
                    <span class="text-subtitle-1 font-weight-black">{{ initial(key.name) }}</span>
                  </v-avatar>
                  <v-badge dot color="success" class="status-badge-mini" />
                </div>
                <div class="overflow-hidden">
                  <div class="text-subtitle-1 font-weight-black text-truncate">{{ key.name }}</div>
                  <div class="text-caption text-medium-emphasis text-truncate">{{ key.email || 'No email' }}</div>
                </div>
              </div>

              <div class="text-right flex-shrink-0">
                <div class="eyebrow" style="font-size: 0.55rem;">Created</div>
                <div class="text-caption font-weight-bold">{{ formatDate(key.createdAt) }}</div>
              </div>
            </div>

            <div class="d-flex align-center flex-wrap ga-2 mt-4">
              <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold uppercase">{{ key.type }}</v-chip>
              <span v-if="!key.privateKey" class="text-caption text-medium-emphasis d-flex align-center ga-1">
                <v-icon size="13">mdi-key-outline</v-icon> Public only
              </span>
              <span class="font-mono text-primary text-caption font-weight-bold">#{{ shortId(key.id) }}</span>
            </div>

            <div class="inset-box mt-4 pa-3 px-4">
              <div class="eyebrow mb-1" style="font-size: 0.55rem;">Fingerprint</div>
              <div class="font-mono text-caption text-truncate">{{ key.fingerprint }}</div>
            </div>
          </div>

          <v-spacer />
          <v-divider class="hairline-b" style="border: none;" />

          <div class="d-flex align-center pa-3 px-4 ga-2 footer-bar">
            <v-tooltip text="Copy public key">
              <template #activator="{ props }">
                <v-btn v-bind="props" size="small" variant="tonal" color="primary" icon="mdi-share-variant" aria-label="Copy public key" @click="copy(key.publicKey, 'Public key')" />
              </template>
            </v-tooltip>
            <v-tooltip v-if="key.privateKey" text="Copy private key">
              <template #activator="{ props }">
                <v-btn v-bind="props" size="small" variant="tonal" color="secondary" icon="mdi-shield-key" aria-label="Copy private key" @click="copy(key.privateKey, 'Private key')" />
              </template>
            </v-tooltip>
            <v-tooltip v-if="key.passphrase" text="Copy passphrase">
              <template #activator="{ props }">
                <v-btn v-bind="props" size="small" variant="tonal" color="tertiary" icon="mdi-eye" aria-label="Copy passphrase" @click="copy(key.passphrase, 'Passphrase')" />
              </template>
            </v-tooltip>

            <v-spacer />

            <v-btn variant="flat" color="primary" class="font-weight-bold px-5" :to="`/key/${key.id}`">
              Manage
            </v-btn>
            <v-menu location="bottom end">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-vertical" variant="tonal" size="small" aria-label="More actions" />
              </template>
              <v-list class="glass-panel" density="compact" min-width="170" rounded="lg">
                <v-list-item prepend-icon="mdi-delete-outline" title="Destroy key" base-color="error" @click="confirmDelete(key.id)" />
              </v-list>
            </v-menu>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Import dialog -->
    <v-dialog v-model="importDialog" max-width="600">
      <v-card class="glass-panel pa-6">
        <h3 class="text-h6 font-weight-black mb-1">Import PGP key</h3>
        <p class="text-caption text-medium-emphasis mb-5">Paste an armored public or private key block.</p>

        <v-textarea
          v-model="importArmoredKey"
          placeholder="-----BEGIN PGP ... KEY BLOCK-----"
          rows="10"
          class="font-mono text-caption"
        />

        <div class="d-flex justify-end ga-3 mt-6">
          <v-btn variant="text" @click="importDialog = false">Cancel</v-btn>
          <v-btn color="primary" class="font-weight-bold px-6" :loading="importing" :disabled="!importArmoredKey.trim()" @click="handleImport">
            Import
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" location="bottom right" rounded="lg">
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

const initial = (name: string) => (name?.trim()?.charAt(0) || '?').toUpperCase()
const shortId = (id: string) => (id?.length > 8 ? id.slice(-8) : id).toUpperCase()
const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })

const notify = (text: string, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const handleImport = async () => {
  if (!importArmoredKey.value.trim()) return
  importing.value = true
  try {
    await importKey(importArmoredKey.value)
    notify('Key successfully imported')
    importDialog.value = false
    importArmoredKey.value = ''
  } catch (e: unknown) {
    notify('Import failed: ' + (e as Error).message, 'error')
  } finally {
    importing.value = false
  }
}

const copy = async (text: string, type: string) => {
  try {
    await navigator.clipboard.writeText(text)
    notify(`${type} copied to clipboard`)
  } catch {
    notify('Clipboard access was blocked by your browser', 'error')
  }
}

const confirmDelete = (id: string) => {
  if (confirm('Delete this key permanently? This cannot be undone.')) {
    deleteKey(id)
    notify('Key deleted', 'info')
  }
}
</script>

<style scoped>
.empty-state { border-style: dashed !important; }

.avatar-wrapper { position: relative; }
.status-badge-mini { position: absolute; bottom: 2px; right: 2px; }

.footer-bar { background: var(--inset-bg); }
</style>
