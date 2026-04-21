<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="badgeClass"
  >
    {{ $t(`stages.${props.stage}`) }}
  </span>
</template>

<script setup lang="ts">
import type { TransactionStage } from "~/types";

const props = defineProps<{ stage: TransactionStage }>();

const colorMap: Record<TransactionStage, string> = {
  agreement: "bg-amber-100 text-amber-700",
  earnest_money: "bg-blue-100 text-blue-700",
  title_deed: "bg-violet-100 text-violet-700",
  completed: "bg-emerald-100 text-emerald-700",
};

const badgeClass = computed(
  () => colorMap[props.stage] ?? "bg-black-10 text-slate-600",
);
</script>
