<template>
  <div>
    <PageHeader
      :title="$t('transactions.title')"
      :subtitle="$t('transactions.subtitle')"
    >
      <NuxtLink to="/transactions/new" class="btn-primary">
        <Plus class="w-4 h-4" />{{ $t("transactions.new") }}
      </NuxtLink>
    </PageHeader>

    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="f in filters"
        :key="f.value"
        @click="activeFilter = f.value"
        class="px-3 py-1.5 border rounded-lg font-medium text-xs transition-colors"
        :class="
          activeFilter === f.value
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-black/60 border-black/15 hover:border-black/30'
        "
      >
        {{ $t(f.labelKey) }}
      </button>
    </div>

    <LoadingSpinner v-if="store.loading" />
    <AppAlert v-else-if="store.error" :message="store.error" />
    <EmptyState
      v-else-if="!filtered.length"
      :title="$t('transactions.empty')"
      :description="$t('transactions.emptyDesc')"
    />

    <div v-else class="overflow-x-auto card">
      <table class="w-full whitespace-nowrap text-sm">
        <thead class="bg-black/[0.03] border-b border-black/10">
          <tr>
            <th
              class="px-4 py-3 w-8 font-semibold text-black/40 text-xs uppercase tracking-wide"
            >
              #
            </th>
            <th
              class="px-4 py-3 font-semibold text-black/40 text-xs text-left uppercase tracking-wide"
            >
              {{ $t("transactions.colProperty") }}
            </th>
            <th
              class="px-4 py-3 font-semibold text-black/40 text-xs text-left uppercase tracking-wide"
            >
              {{ $t("transactions.colClient") }}
            </th>
            <th
              class="px-4 py-3 font-semibold text-black/40 text-xs text-left uppercase tracking-wide"
            >
              {{ $t("transactions.colListingAgent") }}
            </th>
            <th
              class="px-4 py-3 font-semibold text-black/40 text-xs text-left uppercase tracking-wide"
            >
              {{ $t("transactions.colSellingAgent") }}
            </th>
            <th
              class="px-4 py-3 font-semibold text-black/40 text-xs text-left uppercase tracking-wide"
            >
              {{ $t("transactions.colFee") }}
            </th>
            <th
              class="px-4 py-3 font-semibold text-black/40 text-xs text-left uppercase tracking-wide"
            >
              {{ $t("transactions.colStage") }}
            </th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-black/5">
          <tr
            v-for="(tx, idx) in filtered"
            :key="tx._id"
            class="hover:bg-black/[0.02] transition-colors"
          >
            <td class="px-4 py-3 font-medium text-black/30 text-xs">
              {{ idx + 1 }}
            </td>
            <td class="px-4 py-3">
              <p class="font-medium text-black">{{ tx.propertyTitle }}</p>
              <p class="max-w-[180px] text-black/40 text-xs truncate">
                {{ tx.propertyAddress }}
              </p>
            </td>
            <td class="px-4 py-3 text-black/60">
              {{ tx.clientName }}
            </td>
            <td class="px-4 py-3 text-black/60">
              {{ agentName(tx.listingAgentId) }}
            </td>
            <td class="px-4 py-3 text-black/60">
              {{ agentName(tx.sellingAgentId) }}
            </td>
            <td class="px-4 py-3 font-semibold text-black">
              {{ fmt(tx.totalServiceFee)
              }}<span class="ml-1 font-normal text-black/40 text-xs">{{
                tx.currency
              }}</span>
            </td>
            <td class="px-4 py-3">
              <StageBadge :stage="tx.stage" />
            </td>
            <td class="px-4 py-3 text-right">
              <NuxtLink
                :to="`/transactions/${tx._id}`"
                class="font-medium text-primary text-xs hover:underline inline-flex items-center gap-0.5"
                >{{ $t("transactions.view") }}<ArrowRight class="w-3 h-3"
              /></NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, ArrowRight } from "lucide-vue-next";
import { useTransactionsStore } from "~/stores/transactions";
import type { Agent } from "~/types";

definePageMeta({ middleware: "auth" });

const store = useTransactionsStore();
onMounted(() => store.fetchAll());

const activeFilter = ref<string>("all");

const filters = [
  { labelKey: "transactions.filterAll", value: "all" },
  { labelKey: "stages.agreement", value: "agreement" },
  { labelKey: "stages.earnest_money", value: "earnest_money" },
  { labelKey: "stages.title_deed", value: "title_deed" },
  { labelKey: "stages.completed", value: "completed" },
];

const filtered = computed(() => {
  if (activeFilter.value === "all") return store.transactions;
  return store.transactions.filter((t) => t.stage === activeFilter.value);
});

function agentName(a: Agent | string | null) {
  if (!a) return "—";
  return typeof a === "object" ? a.fullName : a;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-GB").format(n);
}
</script>
