<template>
  <div class="card p-5">
    <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">
      {{ label }}
    </p>
    <p class="mt-2 text-2xl font-bold text-slate-900">
      {{ value }}
      <span v-if="sub" class="text-xs font-normal text-slate-400">{{
        sub
      }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  sub?: string;
}>();
</script>
