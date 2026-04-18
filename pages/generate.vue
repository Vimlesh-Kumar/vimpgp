<template>
  <v-row justify="center" class="py-10">
    <v-col cols="12" md="7" lg="6">
      <v-card class="glass-card pa-8 rounded-xl border-primary shadow-glow">
        <div class="d-flex align-center mb-8">
          <v-btn icon="mdi-arrow-left" variant="tonal" to="/" class="mr-4 glass-panel-btn" color="primary"/>
          <div>
             <h2 class="text-h4 font-weight-black text-white tracking-tighter shadow-text">Generate <span class="text-gradient">Identity</span></h2>
             <div class="text-caption text-disabled uppercase font-weight-bold tracking-widest">Secure PGP Key Creation</div>
          </div>
        </div>

        <v-form ref="formRef" @submit.prevent="handleGenerate">
          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-2 font-weight-bold mb-2 ml-1 text-primary">Primary Identity</div>
              <v-text-field
                v-model="form.name"
                label="Full Name"
                placeholder="e.g. Alice Smith"
                prepend-inner-icon="mdi-account-circle-outline"
                variant="solo-filled"
                class="mb-2 custom-input"
                rounded="lg"
                :rules="[v => !!v || 'Name is required']"
              />

              <v-text-field
                v-model="form.email"
                label="Email Address"
                placeholder="e.g. alice@example.com"
                prepend-inner-icon="mdi-email-outline"
                variant="solo-filled"
                class="mb-4 custom-input"
                rounded="lg"
                :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Invalid email']"
              />
            </v-col>

            <v-col cols="12">
              <div class="d-flex justify-space-between align-center mb-2 ml-1">
                <div class="text-subtitle-2 font-weight-bold text-primary">Master Passphrase</div>
                <v-chip v-if="form.passphrase" :color="passStrength.color" size="x-small" variant="flat" class="font-weight-black">
                  {{ passStrength.text }}
                </v-chip>
              </div>
              <v-text-field
                v-model="form.passphrase"
                label="Passphrase"
                placeholder="Protect your private key"
                prepend-inner-icon="mdi-shield-key-outline"
                :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                variant="solo-filled"
                class="mb-1 custom-input"
                rounded="lg"
                hint="Crucial: This will be required to use your key"
                persistent-hint
                @click:append-inner="showPass = !showPass"
              />
            </v-col>

            <v-col cols="12" class="mt-4">
              <v-expansion-panels flat class="advanced-panels">
                <v-expansion-panel class="bg-transparent">
                  <v-expansion-panel-title class="px-0 py-2">
                    <template #default>
                      <div class="d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-cog-outline</v-icon>
                        <span class="text-caption text-uppercase font-weight-bold text-medium-emphasis tracking-widest">Advanced Security Parameters</span>
                      </div>
                    </template>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="px-0">
                    <v-row class="mt-2">
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="form.algo"
                          label="Algorithm"
                          :items="[{title: 'ECC (Modern/Fast)', value: 'ecc'}, {title: 'RSA (Legacy/Comp)', value: 'rsa'}]"
                          variant="solo-filled"
                          class="custom-input"
                          rounded="lg"
                          menu-props="{ contentClass: 'glass-panel' }"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-if="form.algo === 'ecc'"
                          v-model="form.keySize"
                          label="Cipher Curve"
                          :items="[{title: 'Curve25519', value: 25519}, {title: 'NIST P-256', value: 256}, {title: 'NIST P-384', value: 384}, {title: 'NIST P-521', value: 521}]"
                          variant="solo-filled"
                          class="custom-input"
                          rounded="lg"
                          menu-props="{ contentClass: 'glass-panel' }"
                        />
                        <v-select
                          v-if="form.algo === 'rsa'"
                          v-model="form.keySize"
                          label="Bit Length"
                          :items="[
                            {title: '1024 bits (Weak - Not Recommended)', value: 1024},
                            {title: '2048 bits (Standard - Recommended)', value: 2048},
                            {title: '3072 bits (Strong)', value: 3072},
                            {title: '4096 bits (Very Strong)', value: 4096},
                            {title: '8192 bits (Maximum)', value: 8192}
                          ]"
                          variant="solo-filled"
                          class="custom-input"
                          rounded="lg"
                          menu-props="{ contentClass: 'glass-panel' }"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          v-model="form.expiry"
                          label="Validity Period"
                          :items="[
                            {title: 'Never', value: 0},
                            {title: '30 Days', value: 2592000},
                            {title: '90 Days', value: 7776000},
                            {title: '6 Months', value: 15552000},
                            {title: '1 Year', value: 31536000},
                            {title: '2 Years', value: 63072000},
                            {title: '3 Years', value: 94608000},
                            {title: '5 Years', value: 157680000},
                            {title: '10 Years', value: 315360000}
                          ]"
                          variant="solo-filled"
                          class="custom-input"
                          rounded="lg"
                          menu-props="{ contentClass: 'glass-panel' }"
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>

          <v-btn
            type="submit"
            block
            height="60"
            color="primary"
            class="font-weight-black text-h6 tracking-wide elevation-10 mt-8"
            :loading="loading"
            rounded="xl"
          >
            Create Identity
          </v-btn>
        </v-form>
      </v-card>
    </v-col>

    <v-col cols="12" md="4" lg="3" class="d-none d-md-block">
      <v-card class="glass-card pa-6 rounded-xl border-dashed h-100 d-flex flex-column">
        <h3 class="text-subtitle-1 font-weight-black mb-4 uppercase tracking-wider text-primary">Identity Preview</h3>
        
        <div class="identity-preview-box pa-4 rounded-lg bg-black-alpha-20 border-1 mb-6">
           <div class="d-flex align-center mb-4">
              <v-avatar color="primary" variant="tonal" class="mr-3">
                 <span class="font-weight-bold">{{ form.name ? form.name.charAt(0).toUpperCase() : '?' }}</span>
              </v-avatar>
              <div class="overflow-hidden">
                 <div class="text-subtitle-1 font-weight-bold text-truncate">{{ form.name || 'Anonymous User' }}</div>
                 <div class="text-caption text-disabled text-truncate">{{ form.email || 'no-email@configured.com' }}</div>
              </div>
           </div>
           
           <v-divider class="mb-4" style="opacity: 0.1"/>
           
           <div class="d-flex justify-space-between mb-2">
              <span class="text-caption font-weight-bold text-disabled uppercase">Algorithm</span>
              <span class="text-caption font-weight-black text-primary uppercase">{{ form.algo }}</span>
           </div>
           <div class="d-flex justify-space-between mb-2">
              <span class="text-caption font-weight-bold text-disabled uppercase">Density</span>
              <span class="text-caption font-weight-black text-primary uppercase">{{ form.algo === 'ecc' ? 'Curve' + form.keySize : form.keySize + ' Bits' }}</span>
           </div>
        </div>

        <div class="mt-auto">
          <div class="d-flex align-center mb-2">
             <v-icon size="small" color="success" class="mr-2">mdi-check-circle-outline</v-icon>
             <span class="text-caption font-weight-medium">100% Offline Processing</span>
          </div>
          <div class="d-flex align-center mb-2">
             <v-icon size="small" color="success" class="mr-2">mdi-check-circle-outline</v-icon>
             <span class="text-caption font-weight-medium">Zero-Trust Architecture</span>
          </div>
          <p class="text-caption text-disabled mt-4 text-center">
            Your key pair is generated using local entropy and stored only in your browser storage.
          </p>
        </div>
      </v-card>
    </v-col>
  </v-row>
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
  expiry: 0
})

const passStrength = computed(() => {
  const p = form.passphrase
  if (!p) return { text: '', color: '' }
  if (p.length < 6) return { text: 'Weak', color: 'error' }
  if (p.length < 12) return { text: 'Medium', color: 'warning' }
  return { text: 'Strong', color: 'success' }
})

watch(() => form.algo, (newAlgo) => {
  if (newAlgo === 'ecc') form.keySize = 25519
  else form.keySize = 2048
})

const showPass = ref(false)
const formRef = ref(null)

const handleGenerate = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  try {
    await new Promise(r => setTimeout(r, 100)) 
    await generate(form.name, form.email, form.passphrase, form.algo, form.keySize, form.expiry)
    router.push('/')
  } catch (e) {
    console.error(e)
    alert('Error generating key: ' + e.message)
  }
}

useHead({
  title: 'Generate Identity - VimPGP'
})
</script>

<style scoped>
.custom-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.bg-black-alpha-20 {
  background: rgba(0, 0, 0, 0.2);
}

.border-dashed {
  border-style: dashed !important;
  border-width: 1px !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.advanced-panels :deep(.v-expansion-panel-title__overlay) {
  opacity: 0 !important;
}

.shadow-text {
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
</style>
