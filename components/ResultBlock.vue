<template>
  <v-expand-transition>
    <div class="mt-7 pt-6 hairline-t">
      <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-3">
        <div class="text-subtitle-1 font-weight-black d-flex align-center ga-2" :class="`text-${color}`">
          <v-icon :color="color">{{ icon }}</v-icon>{{ title }}
        </div>
        <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-content-copy" @click="$emit('copy')">Copy</v-btn>
      </div>
      <div class="inset-box pa-4 result-body" :class="{ 'font-mono text-caption': !monoOff, 'text-body-1': monoOff }">
        {{ content }}
      </div>
      <p v-if="note" class="text-caption text-medium-emphasis mt-3 d-flex align-center ga-1">
        <v-icon size="14">mdi-information-outline</v-icon>{{ note }}
      </p>
    </div>
  </v-expand-transition>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  icon: string
  color: string
  content: string
  note?: string
  monoOff?: boolean
}>()

defineEmits<{ copy: [] }>()
</script>

<style scoped>
.result-body {
  max-height: 340px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
}
</style>
