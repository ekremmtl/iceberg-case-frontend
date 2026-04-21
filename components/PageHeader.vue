<template>
  <div class="flex justify-between items-center mb-4 md:mb-8">
    <div>
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
