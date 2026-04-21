<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster rich-colors position="top-right" :duration="5000" />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>
