<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <div class="text-center mb-10">
          <v-avatar color="primary" variant="tonal" size="56" rounded="lg" class="mb-4">
            <v-icon icon="mdi-help-circle-outline" size="28" />
          </v-avatar>
          <h1 class="text-h4 text-sm-h3 font-weight-black tracking-tighter mb-2">Security <span class="text-gradient">insights</span></h1>
          <p class="text-body-1 text-medium-emphasis mx-auto" style="max-width: 560px;">
            Understand how VimPGP protects your digital sovereignty.
          </p>
        </div>

        <v-expansion-panels variant="accordion" class="faq-panels mb-10">
          <v-expansion-panel v-for="(item, i) in faqs" :key="i" class="surface-card mb-3">
            <v-expansion-panel-title class="text-body-1 font-weight-bold">{{ item.q }}</v-expansion-panel-title>
            <v-expansion-panel-text class="text-body-2 text-medium-emphasis faq-answer">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="item.a" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <div class="text-center pt-8 hairline-t">
          <h3 class="text-subtitle-1 font-weight-bold mb-4">Want to dive into the source?</h3>
          <v-btn color="primary" variant="tonal" size="large" prepend-icon="mdi-github" href="https://github.com/Vimlesh-Kumar/vimpgp" target="_blank" rel="noopener" class="px-8 font-weight-bold">
            Technical documentation
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const faqs = [
  {
    q: 'What is PGP and why do I need it?',
    a: 'PGP (Pretty Good Privacy) lets you encrypt data and sign your communications. It ensures only the intended recipient can read your messages and verifies that you are the genuine sender — a critical tool for journalists, activists, and anyone who values privacy.',
  },
  {
    q: 'Is it safe to generate PGP keys here?',
    a: '<strong>VimPGP</strong> runs the open-source <strong>OpenPGP.js</strong> library entirely on the <strong>client side</strong>. No server is involved in generating or storing your keys — you can even disconnect from the internet while using the app.',
  },
  {
    q: "How does 'zero tracking' work?",
    a: "We use a zero-trust architecture: no cookies, no analytics, no backend logging. Your keys live only in your browser's storage. If you clear browser data or switch devices, you'll need a backup to recover them.",
  },
  {
    q: 'What is the difference between RSA and ECC?',
    a: '<strong>ECC (Elliptic Curve Cryptography)</strong> is the modern standard — equivalent security to RSA with far smaller keys, faster generation, and smaller signatures. <strong>RSA</strong> is older and more compatible with legacy PGP software.',
  },
  {
    q: 'Where are my keys stored?',
    a: "Keys are stored in your browser's <strong>localStorage</strong> and stay on your device (encrypted, if you set a passphrase). We recommend exporting them to a secure password manager, since browser storage can be cleared.",
  },
  {
    q: 'Can I use these keys with other PGP software?',
    a: 'Yes. VimPGP follows the standard OpenPGP protocol, so you can export your armored public and private keys and import them into GPG (GnuPG), Keybase, Thunderbird, and other tools.',
  },
]

useHead({ title: 'FAQ - VimPGP' })
</script>

<style scoped>
.faq-panels :deep(.v-expansion-panel) {
  border-radius: var(--radius-lg) !important;
}
.faq-panels :deep(.v-expansion-panel__shadow) { display: none; }
.faq-answer { line-height: 1.7; }
</style>
