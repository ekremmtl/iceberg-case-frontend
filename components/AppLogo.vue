<template>
  <img
    src="~/assets/images/logo.png"
    alt="Iceberg Case"
    :class="imgClass"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{ size?: "sm" | "md" | "lg" }>(),
  { size: "md" }
);

const imgClass = computed(() => ({
  sm: "h-10 w-auto object-contain",
  md: "h-12 w-auto object-contain",
  lg: "h-14 w-auto object-contain",
}[props.size]));
</script>
