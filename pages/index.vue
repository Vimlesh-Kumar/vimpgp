<template>
  <div class="py-6">
    <div class="mb-10">
      <h1 class="text-h3 font-weight-bold mb-3">
        <span class="text-white">Secure PGP</span> <span class="text-gradient">Manager</span>
      </h1>
      <p class="text-subtitle-1 text-medium-emphasis" style="max-width: 600px; line-height: 1.6">
        Generate, manage, and use OpenPGP keys securely within your browser. 
        Your private keys never leave your device.
      </p>
    </div>
    
    <KeyList />
  </div>
</template>

<script setup>
useHead({
  title: 'Dashboard - VimPGP'
})
</script>
