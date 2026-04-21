<template>
  <div
    :class="card ? 'card' : ''"
    class="flex flex-col items-center justify-center py-16 text-center"
  >
    <p class="text-sm font-medium text-black/70">{{ title }}</p>
    <p v-if="description" class="mt-1 text-xs text-black/40">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description?: string;
    card?: boolean;
  }>(),
  {
    card: true,
  },
);
</script>
