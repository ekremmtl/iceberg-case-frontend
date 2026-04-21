<template>
  <div>
    <PageHeader
      :title="$t('dashboard.title')"
      :subtitle="$t('dashboard.subtitle')"
    />

    <LoadingSpinner v-if="loading" />

    <template v-else-if="summary">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 md:mb-8">
        <StatCard
          :label="$t('dashboard.totalTransactions')"
          :value="summary.totalTransactions"
        />
        <StatCard
          :label="$t('dashboard.activeAgents')"
          :value="summary.totalAgents"
        />
        <StatCard
          :label="$t('dashboard.completed')"
          :value="summary.transactionsByStage.completed"
        />
        <StatCard
          :label="$t('dashboard.agencyRevenue')"
          :value="fmt(summary.financials.totalAgencyRevenue)"
          :sub="summary.financials.currency"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div class="card">
          <h2
            class="text-sm px-6 py-4 font-semibold text-slate-700 mb-4 border-b border-black/10"
          >
            {{ $t("dashboard.stageDistribution") }}
          </h2>
          <div class="space-y-4 px-6 pb-4">
            <div
              v-for="(count, stage) in summary.transactionsByStage"
              :key="stage"
              class="flex items-center justify-between"
            >
              <StageBadge :stage="stage as any" />
              <div class="flex items-center gap-3 flex-1 mx-4">
                <div class="flex-1 bg-black/10 rounded-full h-1.5">
                  <div
                    class="h-1.5 rounded-full bg-primary"
                    :style="{ width: barWidth(count) }"
                  />
                </div>
              </div>
              <span
                class="text-sm font-semibold text-slate-700 w-6 text-right"
                >{{ count }}</span
              >
            </div>
          </div>
        </div>

        <div class="card">
          <h2
            class="text-sm px-6 py-4 font-semibold text-slate-700 mb-4 border-b border-black/10"
          >
            {{ $t("dashboard.financialSummary") }}
          </h2>
          <div class="px-6 pb-4">
            <div
              class="flex justify-between items-center pb-4 mb-4 border-b border-black/5"
            >
              <span class="text-sm text-slate-500">{{
                $t("dashboard.totalServiceFeeCollected")
              }}</span>
              <span class="text-sm font-semibold text-slate-800"
                >{{ fmt(summary.financials.totalServiceFeeCollected) }}
                {{ summary.financials.currency }}</span
              >
            </div>
            <div
              class="flex justify-between items-center pb-4 mb-4 border-b border-black/5"
            >
              <span class="text-sm text-slate-500">{{
                $t("dashboard.agencyRevenue")
              }}</span>
              <span class="text-sm font-semibold text-emerald-600"
                >{{ fmt(summary.financials.totalAgencyRevenue) }}
                {{ summary.financials.currency }}</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-500">{{
                $t("dashboard.completedTransactions")
              }}</span>
              <span class="text-sm font-semibold text-slate-800">{{
                summary.transactionsByStage.completed
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-6">
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-black/10"
        >
          <h2 class="text-sm font-semibold text-slate-700">
            {{ $t("dashboard.recentTransactions") }}
          </h2>
          <NuxtLink
            to="/transactions"
            class="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            {{ $t("dashboard.viewAll") }} <ArrowRight class="w-3 h-3" />
          </NuxtLink>
        </div>

        <LoadingSpinner v-if="txStore.loading" />
        <EmptyState
          v-else-if="!txStore.transactions.length"
          :title="$t('transactions.empty')"
          :card="false"
        />

        <div v-else class="divide-y divide-black-10">
          <div
            v-for="tx in recentTransactions"
            :key="tx._id"
            class="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors"
          >
            <div>
              <p class="text-sm font-medium text-slate-800">
                {{ tx.propertyTitle }}
              </p>
              <p class="text-xs text-slate-400">{{ tx.clientName }}</p>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm font-semibold text-slate-700"
                >{{ fmt(tx.totalServiceFee) }} {{ tx.currency }}</span
              >
              <StageBadge :stage="tx.stage" />
              <NuxtLink
                :to="`/transactions/${tx._id}`"
                class="text-xs text-primary hover:underline"
                >{{ $t("dashboard.view") }}</NuxtLink
              >
            </div>
          </div>
        </div>
      </div>
    </template>

    <AppAlert v-else-if="error" :message="error" />
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { useAuthStore } from "~/stores/auth";
import { useTransactionsStore } from "~/stores/transactions";
import { api } from "~/utils/api";
import type { DashboardSummary } from "~/types";

definePageMeta({ middleware: "auth" });

const authStore = useAuthStore();
const txStore = useTransactionsStore();

const summary = ref<DashboardSummary | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  authStore.init();
  if (authStore.user === null && authStore.token) await authStore.fetchMe();

  try {
    const [s] = await Promise.all([
      api.dashboard.summary(),
      txStore.fetchAll(),
    ]);
    summary.value = s;
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

const recentTransactions = computed(() => txStore.transactions.slice(0, 5));

function fmt(n: number) {
  return new Intl.NumberFormat("en-GB", { minimumFractionDigits: 0 }).format(n);
}

function barWidth(count: number) {
  const max = Math.max(
    ...Object.values(summary.value?.transactionsByStage ?? {}),
    1,
  );
  return `${Math.round((count / max) * 100)}%`;
}
</script>
