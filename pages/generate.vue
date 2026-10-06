<template>
  <div>
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn icon="mdi-arrow-left" variant="tonal" to="/" color="primary" aria-label="Back to dashboard" />
      <div>
        <h1 class="text-h5 text-sm-h4 font-weight-black tracking-tighter">Generate <span class="text-gradient">identity</span></h1>
        <div class="eyebrow">Secure PGP key creation</div>
      </div>
    </div>

    <v-row justify="center">
      <v-col cols="12" md="7" lg="7">
        <v-card class="surface-card pa-5 pa-sm-7">
          <v-form ref="formRef" @submit.prevent="handleGenerate">
            <div class="eyebrow mb-3">Primary identity</div>
            <v-text-field
              v-model="form.name"
              label="Full name"
              placeholder="e.g. Alice Smith"
              prepend-inner-icon="mdi-account-circle-outline"
              class="mb-3"
              :rules="[v => !!v || 'Name is required']"
            />
            <v-text-field
              v-model="form.email"
              label="Email address"
              placeholder="e.g. alice@example.com"
              prepend-inner-icon="mdi-email-outline"
              class="mb-5"
              :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Enter a valid email']"
            />

            <div class="d-flex align-center justify-space-between mb-2">
              <div class="eyebrow">Master passphrase</div>
              <v-chip v-if="form.passphrase" :color="passStrength.color" size="x-small" variant="flat" class="font-weight-bold">
                {{ passStrength.text }}
              </v-chip>
            </div>
            <v-text-field
              v-model="form.passphrase"
              label="Passphrase"
              placeholder="Protects your private key"
              prepend-inner-icon="mdi-shield-key-outline"
              :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              hint="Optional but strongly recommended — required later to use this key"
              persistent-hint
              @click:append-inner="showPass = !showPass"
            />
            <v-progress-linear
              v-if="form.passphrase"
              :model-value="passStrength.value"
              :color="passStrength.color"
              height="4"
              rounded
              class="mt-2"
            />

            <v-expansion-panels flat class="advanced-panels mt-5">
              <v-expansion-panel bg-color="transparent">
                <v-expansion-panel-title class="px-0">
                  <div class="d-flex align-center ga-2">
                    <v-icon color="primary" size="20">mdi-cog-outline</v-icon>
                    <span class="eyebrow">Advanced security parameters</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="px-0">
                  <v-row class="mt-1">
                    <v-col cols="12" sm="6">
                      <v-select v-model="form.algo" label="Algorithm" :items="algoItems" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select v-if="form.algo === 'ecc'" v-model="form.keySize" label="Elliptic curve" :items="curveItems" />
                      <v-select v-else v-model="form.keySize" label="Key length" :items="rsaItems" />
                    </v-col>
                    <v-col cols="12">
                      <v-select v-model="form.expiry" label="Validity period" :items="expiryItems" />
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-btn type="submit" block size="x-large" color="primary" class="font-weight-black mt-6 shadow-glow" :loading="loading">
              <v-icon start>mdi-creation</v-icon>
              Create identity
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <!-- Live preview -->
      <v-col cols="12" md="5" lg="4" class="d-none d-md-block">
        <v-card class="surface-card pa-5 sticky-top">
          <div class="eyebrow mb-4">Identity preview</div>

          <div class="d-flex align-center mb-4">
            <v-avatar color="primary" variant="tonal" size="52" rounded="lg" class="mr-3">
              <span class="text-h6 font-weight-black">{{ (form.name || '?').charAt(0).toUpperCase() }}</span>
            </v-avatar>
            <div class="overflow-hidden">
              <div class="text-subtitle-1 font-weight-black text-truncate">{{ form.name || 'Anonymous' }}</div>
              <div class="text-caption text-medium-emphasis text-truncate">{{ form.email || 'no-email@example.com' }}</div>
            </div>
          </div>

          <div class="inset-box pa-4">
            <div v-for="row in previewRows" :key="row.label" class="d-flex justify-space-between py-1">
              <span class="text-caption font-weight-bold text-medium-emphasis uppercase">{{ row.label }}</span>
              <span class="text-caption font-weight-black text-primary">{{ row.value }}</span>
            </div>
          </div>

          <v-divider class="my-4 hairline-b" style="border: none;" />

          <div v-for="feat in features" :key="feat" class="d-flex align-center ga-2 mb-2">
            <v-icon size="16" color="success">mdi-check-circle-outline</v-icon>
            <span class="text-caption">{{ feat }}</span>
          </div>
          <p class="text-caption text-medium-emphasis mt-3">
            Keys are generated with local entropy and stored only in your browser.
          </p>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="createdDialog" max-width="520" persistent>
      <v-card class="surface-card pa-6">
        <h2 class="text-h6 font-weight-black mb-1">Identity created</h2>
        <p class="text-body-2 text-medium-emphasis mb-5">Save your passphrase securely. It is required to use your private key.</p>
        <div class="eyebrow mb-2">Passphrase</div>
        <div class="d-flex align-center ga-2">
          <v-text-field v-model="createdKeyPass" readonly hide-details class="flex-grow-1 font-mono" />
          <v-btn icon="mdi-content-copy" variant="tonal" aria-label="Copy passphrase" @click="copy(createdKeyPass)" />
        </div>
        <div class="d-flex justify-end mt-6">
          <v-btn color="primary" variant="flat" class="font-weight-bold" @click="closeCreatedDialog">Done</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const { generate, loading } = usePgp()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  passphrase: '',
  algo: 'ecc',
  keySize: 25519,
  expiry: 0,
})

const algoItems = [
  { title: 'ECC (modern, fast)', value: 'ecc' },
  { title: 'RSA (legacy, compatible)', value: 'rsa' },
]
const curveItems = [
  { title: 'Curve25519 (recommended)', value: 25519 },
  { title: 'NIST P-256', value: 256 },
  { title: 'NIST P-384', value: 384 },
  { title: 'NIST P-521', value: 521 },
]
// RSA below 2048 is rejected by OpenPGP and cryptographically weak — not offered.
const rsaItems = [
  { title: '2048 bits (standard)', value: 2048 },
  { title: '3072 bits (strong)', value: 3072 },
  { title: '4096 bits (very strong)', value: 4096 },
]
const expiryItems = [
  { title: 'Never', value: 0 },
  { title: '90 days', value: 7776000 },
  { title: '6 months', value: 15552000 },
  { title: '1 year', value: 31536000 },
  { title: '2 years', value: 63072000 },
  { title: '5 years', value: 157680000 },
]

const features = ['100% offline processing', 'Zero-trust architecture', 'Standard OpenPGP output']

const passStrength = computed(() => {
  const p = form.passphrase
  if (!p) return { text: '', color: 'error', value: 0 }
  if (p.length < 8) return { text: 'Weak', color: 'error', value: 30 }
  if (p.length < 14) return { text: 'Medium', color: 'warning', value: 65 }
  return { text: 'Strong', color: 'success', value: 100 }
})

const previewRows = computed(() => [
  { label: 'Algorithm', value: form.algo.toUpperCase() },
  { label: form.algo === 'ecc' ? 'Curve' : 'Length', value: form.algo === 'ecc' ? curveLabel.value : `${form.keySize} bits` },
  { label: 'Expiry', value: expiryItems.find(e => e.value === form.expiry)?.title ?? 'Never' },
])

const curveLabel = computed(() => (form.keySize === 25519 ? 'Curve25519' : `NIST P-${form.keySize}`))

watch(() => form.algo, (newAlgo) => {
  form.keySize = newAlgo === 'ecc' ? 25519 : 2048
})

const showPass = ref(false)
const formRef = ref(null)
const createdDialog = ref(false)
const createdKeyPass = ref('')

const copy = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text)
}

const closeCreatedDialog = () => {
  createdDialog.value = false
  router.push('/')
}

const handleGenerate = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  try {
    const newKey = await generate(form.name, form.email, form.passphrase, form.algo, form.keySize, form.expiry)
    createdKeyPass.value = newKey.passphrase || form.passphrase || ''
    createdDialog.value = true
  } catch (e) {
    console.error(e)
    alert('Error generating key: ' + e.message)
  }
}

useHead({ title: 'Generate Identity - VimPGP' })
</script>

<style scoped>
.advanced-panels :deep(.v-expansion-panel-title__overlay) { opacity: 0 !important; }
.advanced-panels :deep(.v-expansion-panel) { background: transparent !important; }
</style>
