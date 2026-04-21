<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @mousedown.self="$emit('cancel')"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <div
          class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4"
        >
          <div
            class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto"
          >
            <Trash2 class="w-6 h-6 text-red-600" />
          </div>

          <div class="text-center">
            <h3 class="text-base font-semibold text-black mb-1">{{ title }}</h3>
            <p class="text-sm text-black/50">{{ description }}</p>
            <p
              v-if="highlight"
              class="mt-2 text-sm font-semibold text-black bg-black/5 rounded-lg px-3 py-1.5 inline-block"
            >
              {{ highlight }}
            </p>
          </div>

          <div class="flex gap-3 mt-1">
            <button
              class="flex-1 btn-secondary"
              @click="$emit('cancel')"
              :disabled="loading"
            >
              {{ cancelLabel }}
            </button>
            <button
              class="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              @click="$emit('confirm')"
              :disabled="loading"
            >
              <Loader2 v-if="loading" class="animate-spin h-4 w-4" />
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Trash2, Loader2 } from "lucide-vue-next";

defineProps<{
  modelValue: boolean;
  title: string;
  description: string;
  highlight?: string;
  confirmLabel: string;
  cancelLabel: string;
  loading?: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
