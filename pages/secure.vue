<template>
  <div class="py-6">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <div class="d-flex align-center mb-8">
          <v-btn icon="mdi-arrow-left" variant="tonal" to="/" class="mr-4 glass-panel-btn" color="primary"/>
          <div>
            <h1 class="text-h3 font-weight-black text-white tracking-tighter shadow-text">
              Secure <span class="text-gradient">Messaging</span>
            </h1>
            <div class="text-caption text-disabled uppercase font-weight-bold tracking-widest">Encrypt, Decrypt, Sign & Verify</div>
          </div>
        </div>

        <v-tabs v-model="tab" color="primary" align-tabs="start" class="mb-6 custom-tabs" hide-slider>
          <v-tab value="encrypt" class="rounded-t-lg text-none px-6">
            <v-icon start>mdi-lock</v-icon> Encrypt
          </v-tab>
          <v-tab value="decrypt" class="rounded-t-lg text-none px-6">
            <v-icon start>mdi-lock-open</v-icon> Decrypt
          </v-tab>
          <v-tab value="sign" class="rounded-t-lg text-none px-6">
            <v-icon start>mdi-pen</v-icon> Sign
          </v-tab>
          <v-tab value="verify" class="rounded-t-lg text-none px-6">
            <v-icon start>mdi-check-decagram</v-icon> Verify
          </v-tab>
        </v-tabs>

        <v-window v-model="tab" class="glass-card rounded-xl pa-8 border-1 overflow-visible">
          <!-- ENCRYPT -->
          <v-window-item value="encrypt">
            <v-row>
              <v-col cols="12" md="7">
                <div class="text-subtitle-1 font-weight-bold mb-4 text-primary">Message to Encrypt</div>
                <v-textarea
                  v-model="encryptForm.message"
                  placeholder="Type your secret message here..."
                  variant="solo-filled"
                  rows="8"
                  class="custom-textarea mb-4"
                  rounded="lg"
                  hide-details
                />
                
                <div class="d-flex align-center gap-4 mt-6">
                  <v-btn
                    color="primary"
                    size="large"
                    class="font-weight-black px-8 rounded-lg"
                    :loading="loading"
                    :disabled="!encryptForm.message || !encryptForm.recipientKey"
                    @click="handleEncrypt"
                  >
                    Encrypt Message
                  </v-btn>
                  <v-btn variant="tonal" size="large" class="rounded-lg" @click="encryptForm.message = ''">Clear</v-btn>
                </div>
              </v-col>
              
              <v-col cols="12" md="5">
                <div class="text-subtitle-1 font-weight-bold mb-4 text-primary">Recipient Public Key</div>
                <v-select
                  v-model="encryptForm.recipientKey"
                  :items="keys"
                  item-title="name"
                  item-value="publicKey"
                  label="Select from Keyring"
                  variant="solo-filled"
                  class="mb-4 custom-input"
                  rounded="lg"
                  persistent-hint
                  hint="The message will be encrypted for this identity"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="item.raw.email" />
                  </template>
                </v-select>
                
                <div class="text-caption text-disabled mb-2 uppercase font-weight-bold tracking-widest mt-6">Alternative: Paste Armored Key</div>
                <v-textarea
                  v-model="encryptForm.recipientKey"
                  placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----..."
                  variant="solo-filled"
                  rows="4"
                  class="custom-textarea text-caption font-mono"
                  rounded="lg"
                  hide-details
                />
              </v-col>
            </v-row>

            <v-expand-transition>
              <div v-if="encryptResult" class="mt-8 pt-8 border-t-1">
                <div class="d-flex align-center justify-space-between mb-4">
                  <div class="text-h6 font-weight-black text-success">
                    <v-icon color="success" class="mr-2">mdi-shield-check</v-icon>Encrypted Successfully
                  </div>
                  <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-content-copy" @click="copy(encryptResult)">Copy All</v-btn>
                </div>
                <div class="pa-4 rounded-lg bg-black-alpha-40 font-mono text-caption overflow-auto text-primary border-primary-light" style="max-height: 300px; white-space: pre-wrap;">
                  {{ encryptResult }}
                </div>
              </div>
            </v-expand-transition>
          </v-window-item>

          <!-- DECRYPT -->
          <v-window-item value="decrypt">
            <v-row>
              <v-col cols="12" md="7">
                <div class="text-subtitle-1 font-weight-bold mb-4 text-primary">Encrypted Message (PGP Message)</div>
                <v-textarea
                  v-model="decryptForm.encryptedMessage"
                  placeholder="Paste armored message starting with -----BEGIN PGP MESSAGE-----"
                  variant="solo-filled"
                  rows="8"
                  class="custom-textarea mb-4 font-mono text-caption"
                  rounded="lg"
                  hide-details
                />
                
                <div class="d-flex align-center gap-4 mt-6">
                  <v-btn
                    color="primary"
                    size="large"
                    class="font-weight-black px-8 rounded-lg"
                    :loading="loading"
                    :disabled="!decryptForm.encryptedMessage || !decryptForm.privateKey"
                    @click="handleDecrypt"
                  >
                    Decrypt Message
                  </v-btn>
                  <v-btn variant="tonal" size="large" class="rounded-lg" @click="decryptForm.encryptedMessage = ''; decryptResult = ''">Clear</v-btn>
                </div>
              </v-col>
              
              <v-col cols="12" md="5">
                <div class="text-subtitle-1 font-weight-bold mb-4 text-primary">Your Private Key</div>
                <v-select
                  v-model="decryptForm.privateKey"
                  :items="keys.filter(k => !!k.privateKey)"
                  item-title="name"
                  item-value="privateKey"
                  label="Select from Keyring"
                  variant="solo-filled"
                  class="mb-4 custom-input"
                  rounded="lg"
                />
                
                <v-text-field
                  v-model="decryptForm.passphrase"
                  label="Passphrase (if applicable)"
                  type="password"
                  variant="solo-filled"
                  class="mb-4 custom-input"
                  rounded="lg"
                  prepend-inner-icon="mdi-key-variant"
                />
              </v-col>
            </v-row>

            <v-expand-transition>
              <div v-if="decryptResult" class="mt-8 pt-8 border-t-1">
                <div class="d-flex align-center justify-space-between mb-4">
                  <div class="text-h6 font-weight-black text-white">
                    <v-icon color="success" class="mr-2">mdi-lock-open-variant</v-icon>Decrypted Plaintext
                  </div>
                  <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-content-copy" @click="copy(decryptResult)">Copy Message</v-btn>
                </div>
                <div class="pa-6 rounded-lg bg-black-alpha-40 text-body-1 border-1 line-height-relaxed" style="max-height: 400px; overflow-y: auto;">
                  {{ decryptResult }}
                </div>
              </div>
            </v-expand-transition>
          </v-window-item>

          <!-- SIGN -->
          <v-window-item value="sign">
            <v-row>
              <v-col cols="12" md="7">
                <div class="text-subtitle-1 font-weight-bold mb-4 text-primary">Message to Sign</div>
                <v-textarea
                  v-model="signForm.message"
                  placeholder="Text you want to digitally sign..."
                  variant="solo-filled"
                  rows="8"
                  class="custom-textarea mb-4"
                  rounded="lg"
                  hide-details
                />
                
                <div class="d-flex align-center gap-4 mt-6">
                  <v-btn
                    color="primary"
                    size="large"
                    class="font-weight-black px-8 rounded-lg"
                    :loading="loading"
                    :disabled="!signForm.message || !signForm.privateKey"
                    @click="handleSign"
                  >
                    Create Signature
                  </v-btn>
                </div>
              </v-col>
              
              <v-col cols="12" md="5">
                <div class="text-subtitle-1 font-weight-bold mb-4 text-primary">Signing Identity</div>
                <v-select
                  v-model="signForm.privateKey"
                  :items="keys.filter(k => !!k.privateKey)"
                  item-title="name"
                  item-value="privateKey"
                  label="Select Primary Key"
                  variant="solo-filled"
                  class="mb-4 custom-input"
                  rounded="lg"
                />
                
                <v-text-field
                  v-model="signForm.passphrase"
                  label="Key Passphrase"
                  type="password"
                  variant="solo-filled"
                  class="mb-4 custom-input"
                  rounded="lg"
                />
              </v-col>
            </v-row>

            <v-expand-transition>
              <div v-if="signResult" class="mt-8 pt-8 border-t-1">
                <div class="text-h6 font-weight-black mb-4"><v-icon class="mr-2" color="primary">mdi-fountain-pen-tip</v-icon>Pgp Signature</div>
                <div class="pa-4 rounded-lg bg-black-alpha-40 font-mono text-caption overflow-auto text-primary border-primary-light">
                  {{ signResult }}
                </div>
              </div>
            </v-expand-transition>
          </v-window-item>

          <!-- VERIFY -->
          <v-window-item value="verify">
            <v-row>
              <v-col cols="12" md="7">
                <div class="text-subtitle-1 font-weight-bold mb-4 text-primary">Original Message</div>
                <v-textarea
                  v-model="verifyForm.message"
                  placeholder="The original text that was signed"
                  variant="solo-filled"
                  rows="4"
                  class="custom-textarea mb-6"
                  rounded="lg"
                />

                <div class="text-subtitle-1 font-weight-bold mb-4 text-primary">PGP Signature</div>
                <v-textarea
                  v-model="verifyForm.signature"
                  placeholder="-----BEGIN PGP SIGNATURE-----..."
                  variant="solo-filled"
                  rows="6"
                  class="custom-textarea mb-4 font-mono text-caption"
                  rounded="lg"
                  hide-details
                />
                
                <div class="mt-6">
                  <v-btn
                    color="primary"
                    size="large"
                    class="font-weight-black px-8 rounded-lg"
                    :loading="loading"
                    :disabled="!verifyForm.message || !verifyForm.signature || !verifyForm.publicKey"
                    @click="handleVerify"
                  >
                    Verify Signature
                  </v-btn>
                </div>
              </v-col>
              
              <v-col cols="12" md="5">
                <div class="text-subtitle-1 font-weight-bold mb-4 text-primary">Author's Public Key</div>
                <v-select
                  v-model="verifyForm.publicKey"
                  :items="keys"
                  item-title="name"
                  item-value="publicKey"
                  label="Trusted identity"
                  variant="solo-filled"
                  class="mb-4 custom-input"
                  rounded="lg"
                />
                <v-textarea
                   v-model="verifyForm.publicKey"
                   placeholder="Or paste public key here"
                   variant="solo-filled"
                   rows="4"
                   class="custom-textarea font-mono text-caption"
                   rounded="lg"
                />
              </v-col>
            </v-row>

            <v-expand-transition>
              <div v-if="verifyResult !== null" class="mt-8 pt-6 border-t-1 text-center">
                <v-alert
                  :type="verifyResult ? 'success' : 'error'"
                  variant="tonal"
                  class="rounded-xl border-1 py-8"
                >
                  <div class="text-h4 font-weight-black mb-2">
                    {{ verifyResult ? 'SIGNATURE VALID' : 'SIGNATURE INVALID' }}
                  </div>
                  <div class="text-body-1">
                    {{ verifyResult 
                      ? 'This message is authentic and has not been tampered with since signing.' 
                      : 'Authenticity check failed. The message may have been modified or the key is incorrect.' 
                    }}
                  </div>
                </v-alert>
              </div>
            </v-expand-transition>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" color="success" location="bottom right">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
const { keys, encryptMessage, decryptMessage, signMessage, verifySignature, loading } = usePgp()
const tab = ref('encrypt')
const snackbar = ref(false)
const snackbarText = ref('')

const encryptForm = reactive({
  message: '',
  recipientKey: ''
})
const encryptResult = ref('')

const decryptForm = reactive({
  encryptedMessage: '',
  privateKey: '',
  passphrase: ''
})
const decryptResult = ref('')

const signForm = reactive({
  message: '',
  privateKey: '',
  passphrase: ''
})
const signResult = ref('')

const verifyForm = reactive({
  message: '',
  signature: '',
  publicKey: ''
})
const verifyResult = ref(null)

const copy = (text) => {
  navigator.clipboard.writeText(text)
  snackbarText.value = 'Copied to clipboard'
  snackbar.value = true
}

const handleEncrypt = async () => {
  try {
    const res = await encryptMessage(encryptForm.message, [encryptForm.recipientKey])
    encryptResult.value = res
  } catch (e) {
    alert('Encryption error: ' + e.message)
  }
}

const handleDecrypt = async () => {
  try {
    const res = await decryptMessage(decryptForm.encryptedMessage, decryptForm.privateKey, decryptForm.passphrase)
    decryptResult.value = res
  } catch (e) {
    alert('Decryption error: Ensure your private key and passphrase are correct. Error: ' + e.message)
  }
}

const handleSign = async () => {
  try {
    const res = await signMessage(signForm.message, signForm.privateKey, signForm.passphrase)
    signResult.value = res
  } catch (e) {
    alert('Signing error: ' + e.message)
  }
}

const handleVerify = async () => {
  try {
    const res = await verifySignature(verifyForm.message, verifyForm.signature, verifyForm.publicKey)
    verifyResult.value = res
  } catch (e) {
    verifyResult.value = false
    alert('Verification error: ' + e.message)
  }
}

useHead({
  title: 'Secure Messages - VimPGP'
})
</script>

<style scoped>
.custom-tabs :deep(.v-tab) {
  background: rgba(255, 255, 255, 0.03);
  margin-right: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: none;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.custom-tabs :deep(.v-tab--selected) {
  opacity: 1;
  background: rgba(var(--v-theme-primary), 0.1);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.custom-textarea :deep(.v-field),
.custom-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  transition: border-color 0.3s ease;
}

.custom-textarea :deep(.v-field--focused),
.custom-input :deep(.v-field--focused) {
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
}

.bg-black-alpha-40 {
  background: rgba(0, 0, 0, 0.4);
}

.border-t-1 {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.border-primary-light {
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.gap-4 {
  gap: 16px;
}

.shadow-text {
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.line-height-relaxed {
  line-height: 1.8;
}
</style>
