<template>
  <div
    v-if="message"
    class="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
    :class="classes"
  >
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message?: string | null;
  type?: "error" | "success" | "info";
}>();

const classes = computed(() => {
  switch (props.type ?? "error") {
    case "success":
      return "bg-emerald-50 border-emerald-200 text-emerald-700";
    case "info":
      return "bg-blue-50 border-blue-200 text-blue-700";
    default:
      return "bg-red-50 border-red-200 text-red-700";
  }
});
</script>
