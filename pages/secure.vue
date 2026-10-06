<template>
  <div>
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn icon="mdi-arrow-left" variant="tonal" to="/" color="primary" aria-label="Back to dashboard" />
      <div>
        <h1 class="text-h5 text-sm-h4 font-weight-black tracking-tighter">Secure <span class="text-gradient">messaging</span></h1>
        <div class="eyebrow">Encrypt · Decrypt · Sign · Verify</div>
      </div>
    </div>

    <v-card class="surface-card overflow-hidden">
      <v-tabs v-model="tab" color="primary" show-arrows class="hairline-b px-2">
        <v-tab v-for="t in tabs" :key="t.value" :value="t.value" class="text-none font-weight-bold">
          <v-icon start size="18">{{ t.icon }}</v-icon>{{ t.label }}
        </v-tab>
      </v-tabs>

      <v-window v-model="tab" class="pa-5 pa-sm-7">
        <!-- ENCRYPT -->
        <v-window-item value="encrypt">
          <v-row>
            <v-col cols="12" md="7">
              <div class="eyebrow mb-3">Message to encrypt</div>
              <v-textarea v-model="encryptForm.message" placeholder="Type your secret message…" rows="9" />
              <div class="d-flex ga-3 mt-4">
                <v-btn color="primary" size="large" class="font-weight-bold px-6" :loading="loading" :disabled="!encryptForm.message || !encryptForm.recipientKey" @click="handleEncrypt">Encrypt</v-btn>
                <v-btn variant="tonal" size="large" @click="encryptForm.message = ''; encryptResult = ''">Clear</v-btn>
              </div>
            </v-col>
            <v-col cols="12" md="5">
              <div class="eyebrow mb-3">Recipient public key</div>
              <v-select
                v-model="encryptForm.recipientKey"
                :items="keys"
                item-title="name"
                item-value="publicKey"
                label="Choose from keyring"
                class="mb-3"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props" :subtitle="item.raw.email" />
                </template>
              </v-select>
              <div class="text-caption text-medium-emphasis mb-2">Or paste an armored public key</div>
              <v-textarea v-model="encryptForm.recipientKey" placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----" rows="4" class="font-mono text-caption" />
            </v-col>
          </v-row>
          <ResultBlock v-if="encryptResult" title="Encrypted successfully" icon="mdi-shield-check" color="success" :content="encryptResult" @copy="copy(encryptResult)" />
        </v-window-item>

        <!-- DECRYPT -->
        <v-window-item value="decrypt">
          <v-row>
            <v-col cols="12" md="7">
              <div class="eyebrow mb-3">Encrypted message</div>
              <v-textarea v-model="decryptForm.encryptedMessage" placeholder="-----BEGIN PGP MESSAGE-----" rows="9" class="font-mono text-caption" />
              <div class="d-flex ga-3 mt-4">
                <v-btn color="primary" size="large" class="font-weight-bold px-6" :loading="loading" :disabled="!decryptForm.encryptedMessage || !decryptForm.privateKey" @click="handleDecrypt">Decrypt</v-btn>
                <v-btn variant="tonal" size="large" @click="decryptForm.encryptedMessage = ''; decryptResult = ''">Clear</v-btn>
              </div>
            </v-col>
            <v-col cols="12" md="5">
              <div class="eyebrow mb-3">Your private key</div>
              <v-select v-model="decryptForm.privateKey" :items="privateKeys" item-title="name" item-value="privateKey" label="Choose from keyring" class="mb-3" />
              <v-text-field v-model="decryptForm.passphrase" label="Passphrase (if protected)" type="password" prepend-inner-icon="mdi-key-variant" />
            </v-col>
          </v-row>
          <ResultBlock v-if="decryptResult" title="Decrypted plaintext" icon="mdi-lock-open-variant" color="success" :content="decryptResult" mono-off @copy="copy(decryptResult)" />
        </v-window-item>

        <!-- SIGN -->
        <v-window-item value="sign">
          <v-row>
            <v-col cols="12" md="7">
              <div class="eyebrow mb-3">Message to sign</div>
              <v-textarea v-model="signForm.message" placeholder="Text you want to digitally sign…" rows="9" />
              <div class="d-flex ga-3 mt-4">
                <v-btn color="primary" size="large" class="font-weight-bold px-6" :loading="loading" :disabled="!signForm.message || !signForm.privateKey" @click="handleSign">Create signature</v-btn>
              </div>
            </v-col>
            <v-col cols="12" md="5">
              <div class="eyebrow mb-3">Signing identity</div>
              <v-select v-model="signForm.privateKey" :items="privateKeys" item-title="name" item-value="privateKey" label="Choose from keyring" class="mb-3" />
              <v-text-field v-model="signForm.passphrase" label="Passphrase (if protected)" type="password" prepend-inner-icon="mdi-key-variant" />
            </v-col>
          </v-row>
          <ResultBlock v-if="signResult" title="Detached PGP signature" icon="mdi-fountain-pen-tip" color="primary" :content="signResult" :note="'Share this signature together with the original message. Both are needed to verify.'" @copy="copy(signResult)" />
        </v-window-item>

        <!-- VERIFY -->
        <v-window-item value="verify">
          <v-row>
            <v-col cols="12" md="7">
              <div class="eyebrow mb-3">Original message</div>
              <v-textarea v-model="verifyForm.message" placeholder="The exact text that was signed" rows="4" class="mb-4" />
              <div class="eyebrow mb-3">PGP signature</div>
              <v-textarea v-model="verifyForm.signature" placeholder="-----BEGIN PGP SIGNATURE-----" rows="6" class="font-mono text-caption" />
              <div class="mt-4">
                <v-btn color="primary" size="large" class="font-weight-bold px-6" :loading="loading" :disabled="!verifyForm.message || !verifyForm.signature || !verifyForm.publicKey" @click="handleVerify">Verify signature</v-btn>
              </div>
            </v-col>
            <v-col cols="12" md="5">
              <div class="eyebrow mb-3">Author's public key</div>
              <v-select v-model="verifyForm.publicKey" :items="keys" item-title="name" item-value="publicKey" label="Trusted identity" class="mb-3" />
              <v-textarea v-model="verifyForm.publicKey" placeholder="Or paste a public key" rows="4" class="font-mono text-caption" />
            </v-col>
          </v-row>
          <v-expand-transition>
            <v-alert v-if="verifyResult !== null" :type="verifyResult ? 'success' : 'error'" variant="tonal" class="mt-6 hairline">
              <div class="text-h6 font-weight-black mb-1">{{ verifyResult ? 'Signature valid' : 'Signature invalid' }}</div>
              <div class="text-body-2">
                {{ verifyResult
                  ? 'This message is authentic and unmodified since it was signed.'
                  : 'Verification failed — the message may have been altered, or the key does not match.' }}
              </div>
            </v-alert>
          </v-expand-transition>
        </v-window-item>
      </v-window>
    </v-card>

    <v-snackbar v-model="snackbar" color="success" location="bottom right" rounded="lg">{{ snackbarText }}</v-snackbar>
  </div>
</template>

<script setup>
const { keys, encryptMessage, decryptMessage, signMessage, verifySignature, loading } = usePgp()

const tabs = [
  { value: 'encrypt', label: 'Encrypt', icon: 'mdi-lock' },
  { value: 'decrypt', label: 'Decrypt', icon: 'mdi-lock-open' },
  { value: 'sign', label: 'Sign', icon: 'mdi-pen' },
  { value: 'verify', label: 'Verify', icon: 'mdi-check-decagram' },
]

const tab = ref('encrypt')
const snackbar = ref(false)
const snackbarText = ref('')

const privateKeys = computed(() => keys.value.filter(k => !!k.privateKey))

const encryptForm = reactive({ message: '', recipientKey: '' })
const encryptResult = ref('')
const decryptForm = reactive({ encryptedMessage: '', privateKey: '', passphrase: '' })
const decryptResult = ref('')
const signForm = reactive({ message: '', privateKey: '', passphrase: '' })
const signResult = ref('')
const verifyForm = reactive({ message: '', signature: '', publicKey: '' })
const verifyResult = ref(null)

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    snackbarText.value = 'Copied to clipboard'
    snackbar.value = true
  } catch {
    snackbarText.value = 'Clipboard blocked by browser'
    snackbar.value = true
  }
}

const handleEncrypt = async () => {
  try {
    encryptResult.value = await encryptMessage(encryptForm.message, [encryptForm.recipientKey])
  } catch (e) {
    alert('Encryption error: ' + e.message)
  }
}

const handleDecrypt = async () => {
  try {
    decryptResult.value = await decryptMessage(decryptForm.encryptedMessage, decryptForm.privateKey, decryptForm.passphrase)
  } catch (e) {
    alert('Decryption error: check your private key and passphrase.\n\n' + e.message)
  }
}

const handleSign = async () => {
  try {
    signResult.value = await signMessage(signForm.message, signForm.privateKey, signForm.passphrase)
  } catch (e) {
    alert('Signing error: ' + e.message)
  }
}

const handleVerify = async () => {
  try {
    verifyResult.value = await verifySignature(verifyForm.message, verifyForm.signature, verifyForm.publicKey)
  } catch (e) {
    verifyResult.value = false
    alert('Verification error: ' + e.message)
  }
}

useHead({ title: 'Secure Messages - VimPGP' })
</script>
