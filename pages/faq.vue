<template>
  <div class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <div class="text-center mb-12">
          <v-avatar color="primary" variant="tonal" size="80" class="mb-4 shadow-glow border-primary">
            <v-icon icon="mdi-help-circle" size="40"/>
          </v-avatar>
          <h1 class="text-h2 font-weight-black text-white tracking-tighter mb-4">Common <span class="text-gradient">Questions</span></h1>
          <p class="text-h6 text-medium-emphasis mx-auto" style="max-width: 700px;">
            Everything you need to know about PGP, security, and VimPGP.
          </p>
        </div>

        <v-expansion-panels class="faq-panels mb-16">
          <v-expansion-panel v-for="(item, i) in faqs" :key="i" class="glass-panel mb-4 rounded-lg overflow-hidden">
            <v-expansion-panel-title class="text-h6 font-weight-bold py-5">
              {{ item.q }}
            </v-expansion-panel-title>
            <v-expansion-panel-text class="text-body-1 text-medium-emphasis py-4 px-2 line-height-relaxed">
              <div v-html="item.a"></div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-card class="glass-card pa-8 rounded-xl text-center border-dashed">
          <h3 class="text-h5 font-weight-bold mb-4">Still have questions?</h3>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Check our documentation on GitHub or join the discussion.
          </p>
          <v-btn color="primary" variant="flat" size="large" rounded="lg" prepend-icon="mdi-github" href="https://github.com/Vimlesh-Kumar/vimpgp" target="_blank">
            Technical Docs
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const faqs = [
  {
    q: "What is PGP and why do I need it?",
    a: "PGP (Pretty Good Privacy) is a security standard that allows you to encrypt your data and sign your communications. It ensures that only the intended recipient can read your messages and verifies that you are indeed the sender. In an era of digital surveillance, PGP is a critical tool for journalists, activists, and anyone concerned about privacy."
  },
  {
    q: "Is it safe to generate PGP keys online?",
    a: "While many online tools are suspicious, <strong>VimPGP</strong> is different. We use an <strong>Open Source</strong> project model where the <strong>OpenPGP.js</strong> library is used for all operations. All code runs exclusively on the <strong>client-side</strong>—no servers are involved in generating or storing your keys. You can even disconnect your internet while using the app."
  },
  {
    q: "How does the 'Zero Tracking' work?",
    a: "We have built this app under a 'Zero-Trust' architecture. We do not use cookies, analytics, or any backend logging. Since there is no database on our end, your keys exist only in your browser storage. This means if you clear your browser data or switch devices, you must have a backup to recover them."
  },
  {
    q: "What is the difference between RSA and ECC?",
    a: "<strong>ECC (Elliptic Curve Cryptography)</strong> is the modern standard. It provided equivalent security to RSA but with much smaller key sizes (e.g., 256-bit ECC is stronger than 2048-bit RSA). This makes generates faster and signatures smaller. <strong>RSA</strong> is older and more widely compatible with very old PGP software."
  },
  {
    q: "Where are my keys stored?",
    a: "Your keys are stored in your browser's <strong>LocalStorage</strong>. They are encrypted (if you provided a passphrase) and stay on your hard drive. We recommend exporting your keys and keeping them in a secure password manager as the browser storage can be cleared."
  },
  {
    q: "Can I use these keys with other PGP software?",
    a: "Yes! Since we follow the standard OpenPGP protocol, you can export your 'Armored' public and private keys and import them into any standard PGP tool like GPG (GnuPG), Keybase, or Thunderbird."
  }
]

useHead({
  title: 'FAQ - VimPGP'
})
</script>

<style scoped>
.line-height-relaxed {
  line-height: 1.7;
}
</style>
