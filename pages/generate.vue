<template>
  <div class="d-flex align-center justify-center py-10">
    <v-card class="glass-card pa-8 w-100 rounded-xl" max-width="600">
      <div class="d-flex align-center mb-8">
        <v-btn icon="mdi-arrow-left" variant="tonal" to="/" class="mr-4" color="white"/>
        <div>
           <h2 class="text-h4 font-weight-bold text-white">Generate Key Pair</h2>
           <div class="text-subtitle-2 text-medium-emphasis">Create a new PGP identity</div>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="handleGenerate">
        <v-text-field
          v-model="form.name"
          label="Full Name"
          placeholder="e.g. Alice Smith"
          prepend-inner-icon="mdi-account"
          variant="solo-filled"
          class="mb-1"
          rounded="lg"
          :rules="[v => !!v || 'Name is required']"
        />

        <v-text-field
          v-model="form.email"
          label="Email Address"
          placeholder="e.g. alice@example.com"
          prepend-inner-icon="mdi-email"
          variant="solo-filled"
          class="mb-1"
           rounded="lg"
          :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Invalid email']"
        />

        <v-text-field
          v-model="form.passphrase"
          label="Passphrase"
          placeholder="Protect your private key"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPass ? 'text' : 'password'"
          variant="solo-filled"
          class="mb-4"
          rounded="lg"
           hint="Leave empty for no passphrase (not recommended)"
          persistent-hint
          @click:append-inner="showPass = !showPass"
        />
        
        <div class="d-flex align-center mb-6">
           <v-divider class="mr-4"/>
           <span class="text-caption text-uppercase font-weight-bold text-medium-emphasis">Advanced</span>
           <v-divider class="ml-4"/>
        </div>

        <v-select
          v-model="form.algo"
          label="Algorithm"
          :items="[{title: 'ECC', value: 'ecc'}, {title: 'RSA', value: 'rsa'}]"
          variant="solo-filled"
          prepend-inner-icon="mdi-shield-check"
          class="mb-4"
          rounded="lg"
          menu-props="{ contentClass: 'glass-panel' }"
        />

        <v-select
          v-if="form.algo === 'ecc'"
          v-model="form.keySize"
          label="Curve"
          :items="[{title: 'Curve25519 (Recommended)', value: 25519}, {title: 'NIST P-256', value: 256}, {title: 'NIST P-384', value: 384}, {title: 'NIST P-521', value: 521}]"
          variant="solo-filled"
          prepend-inner-icon="mdi-chart-bell-curve"
          class="mb-8"
          rounded="lg"
          menu-props="{ contentClass: 'glass-panel' }"
        />

        <v-select
          v-if="form.algo === 'rsa'"
          v-model="form.keySize"
          label="Key Size (Bits)"
          :items="[
            {title: '1024 bits (Weak - Not Recommended)', value: 1024},
            {title: '2048 bits (Standard)', value: 2048},
            {title: '3072 bits (Strong)', value: 3072},
            {title: '4096 bits (Very Strong)', value: 4096},
            {title: '8192 bits (Maximum)', value: 8192}
          ]"
          variant="solo-filled"
          prepend-inner-icon="mdi-ruler"
          class="mb-4"
          rounded="lg"
          menu-props="{ contentClass: 'glass-panel' }"
        />

        <v-select
          v-model="form.expiry"
          label="Key Expiration"
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
          prepend-inner-icon="mdi-calendar-clock"
          class="mb-8"
          rounded="lg"
          menu-props="{ contentClass: 'glass-panel' }"
        />

        <v-btn
          type="submit"
          block
          size="x-large"
          color="primary"
          class="font-weight-bold elevation-10 mb-4"
          :loading="loading"
          rounded="lg"
        >
          Generate Identity
        </v-btn>
      </v-form>
      
      <v-fade-transition>
        <div v-if="loading" class="text-center">
          <div class="text-body-2 text-primary font-weight-bold animate-pulse">
            Generating entropy and calculating primes...
          </div>
          <div class="text-caption text-disabled mt-1">
            This happens locally on your CPU.
          </div>
        </div>
      </v-fade-transition>
    </v-card>
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
  expiry: 0
})

watch(() => form.algo, (newAlgo) => {
  if (newAlgo === 'ecc') form.keySize = 25519
  else form.keySize = 4096
})

const showPass = ref(false)
const formRef = ref(null)

const handleGenerate = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  try {
    // Small delay to allow UI to update loading state before heavy calculation blocks thread
    await new Promise(r => setTimeout(r, 100)) 
    await generate(form.name, form.email, form.passphrase, form.algo, form.keySize, form.expiry)
    router.push('/')
  } catch (e) {
    console.error(e)
    alert('Error generating key: ' + e.message)
  }
}

useHead({
  title: 'Generate Key - VimPGP'
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>
