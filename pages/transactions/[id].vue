<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="mb-6">
      <NuxtLink
        to="/transactions"
        class="inline-flex items-center gap-1 text-primary text-xs hover:underline"
      >
        <ArrowLeft class="w-3 h-3" />{{ $t("txDetail.back") }}
      </NuxtLink>
    </div>

    <LoadingSpinner v-if="store.loading" />
    <AppAlert v-else-if="store.error" :message="store.error" />

    <template v-else-if="tx">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="page-title">{{ tx.propertyTitle }}</h1>
          <p class="page-subtitle">{{ tx.propertyAddress }}</p>
        </div>
        <div class="flex items-center gap-3">
          <StageBadge :stage="tx.stage" />
          <button
            class="hover:bg-primary/5 px-3 py-1.5 border border-primary/30 rounded font-medium text-primary text-xs transition-colors"
            @click="toggleEdit"
          >
            {{
              showEditForm ? $t("txDetail.cancelEdit") : $t("txActions.edit")
            }}
          </button>
          <button
            class="hover:bg-red-50 px-3 py-1.5 border border-red-200 rounded font-medium text-red-500 hover:text-red-700 text-xs transition-colors"
            :disabled="deleting"
            @click="handleDelete"
          >
            {{ deleting ? "…" : $t("txActions.delete") }}
          </button>
        </div>
      </div>

      <div v-if="showEditForm" class="mb-6 p-6 card">
        <h2 class="mb-4 font-semibold text-slate-700 text-sm">
          {{ $t("txActions.editTx") }}
        </h2>
        <form @submit.prevent="handleUpdate" class="space-y-4">
          <div class="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <div>
              <label class="label">{{ $t("newTx.propertyTitle") }}</label>
              <input v-model="editForm.propertyTitle" class="input" required />
            </div>
            <div>
              <label class="label">{{ $t("newTx.clientName") }}</label>
              <input v-model="editForm.clientName" class="input" required />
            </div>
          </div>
          <div>
            <label class="label">{{ $t("newTx.propertyAddress") }}</label>
            <input v-model="editForm.propertyAddress" class="input" required />
          </div>
          <div>
            <label class="label">{{ $t("newTx.totalServiceFee") }}</label>
            <input
              v-model.number="editForm.totalServiceFee"
              type="number"
              min="0"
              step="0.01"
              class="input"
              required
            />
          </div>
          <div class="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <div>
              <label class="label">{{ $t("newTx.listingAgent") }}</label>
              <select v-model="editForm.listingAgentId" class="input" required>
                <option
                  v-for="a in agentsStore.agents"
                  :key="a._id"
                  :value="a._id"
                >
                  {{ a.fullName }}
                </option>
              </select>
            </div>
            <div>
              <label class="label">{{ $t("newTx.sellingAgent") }}</label>
              <select v-model="editForm.sellingAgentId" class="input" required>
                <option
                  v-for="a in agentsStore.agents"
                  :key="a._id"
                  :value="a._id"
                >
                  {{ a.fullName }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-3 pt-1">
            <button
              type="submit"
              class="btn-primary"
              :disabled="editSubmitting"
            >
              {{
                editSubmitting ? $t("txActions.saving") : $t("txActions.save")
              }}
            </button>
            <button
              type="button"
              class="btn-secondary"
              @click="showEditForm = false"
            >
              {{ $t("newTx.cancel") }}
            </button>
            <AppAlert :message="editError" type="error" class="flex-1" />
          </div>
        </form>
      </div>

      <div class="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div class="p-4 card">
          <p class="mb-1 text-slate-400 text-xs">{{ $t("txDetail.client") }}</p>
          <p class="font-semibold text-slate-800 text-sm">
            {{ tx.clientName }}
          </p>
        </div>
        <div class="p-4 card">
          <p class="mb-1 text-slate-400 text-xs">
            {{ $t("txDetail.totalServiceFee") }}
          </p>
          <p class="font-semibold text-slate-800 text-sm">
            {{ fmt(tx.totalServiceFee) }} {{ tx.currency }}
          </p>
        </div>
        <div class="p-4 card">
          <p class="mb-1 text-slate-400 text-xs">
            {{ $t("txDetail.createdAt") }}
          </p>
          <p class="font-semibold text-slate-800 text-sm">
            {{ formatDate(tx.createdAt) }}
          </p>
        </div>
        <div class="p-4 card">
          <p class="mb-1 text-slate-400 text-xs">
            {{ $t("txDetail.listingAgent") }}
          </p>
          <p class="font-semibold text-slate-800 text-sm">
            {{ agentName(tx.listingAgentId) }}
          </p>
        </div>
        <div class="p-4 card">
          <p class="mb-1 text-slate-400 text-xs">
            {{ $t("txDetail.sellingAgent") }}
          </p>
          <p class="font-semibold text-slate-800 text-sm">
            {{ agentName(tx.sellingAgentId) }}
          </p>
        </div>
      </div>

      <div class="mb-6 p-6 card">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-semibold text-slate-700 text-sm">
            {{ $t("txDetail.stageProgress") }}
          </h2>
          <div v-if="nextStage" class="flex items-center gap-2">
            <span class="text-slate-500 text-xs">{{
              $t("txDetail.advanceTo")
            }}</span>
            <button
              class="px-3 py-1 text-xs btn-primary"
              :disabled="advancing"
              @click="handleAdvance"
            >
              {{ advancing ? "…" : stageLabel(nextStage) }}
            </button>
          </div>
        </div>
        <div class="flex items-center">
          <template v-for="(s, idx) in stages" :key="s.value">
            <div class="flex flex-col items-center">
              <div
                class="flex justify-center items-center border-2 rounded-full w-8 h-8 font-semibold text-xs transition-colors"
                :class="
                  stageIndex >= idx
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white border-black/15 text-black/30'
                "
              >
                {{ idx + 1 }}
              </div>
              <span
                class="mt-1 w-20 text-slate-500 text-xs text-center leading-tight"
                >{{ stageLabel(s.value) }}</span
              >
            </div>
            <div
              v-if="idx < stages.length - 1"
              class="flex-1 mb-5 h-0.5 transition-colors"
              :class="stageIndex > idx ? 'bg-primary' : 'bg-black/10'"
            />
          </template>
        </div>
        <AppAlert
          v-if="stageError"
          :message="stageError"
          type="error"
          class="mt-3"
        />
      </div>

      <div class="mb-6 card">
        <div
          class="flex justify-between items-center px-6 py-4 border-black/10 border-b"
        >
          <h2 class="font-semibold text-slate-700 text-sm">
            {{ $t("txDetail.payments") }}
          </h2>
          <button
            v-if="tx.stage !== 'completed'"
            class="px-3 py-1 text-xs btn-secondary inline-flex items-center gap-1"
            @click="showPaymentForm = !showPaymentForm"
          >
            <Plus v-if="!showPaymentForm" class="w-3 h-3" />
            {{
              showPaymentForm
                ? $t("txDetail.cancel")
                : $t("txDetail.addPayment")
            }}
          </button>
        </div>

        <div
          v-if="showPaymentForm"
          class="bg-slate-50 px-6 py-4 border-black/10 border-b"
        >
          <form
            @submit.prevent="handleAddPayment"
            class="gap-3 grid grid-cols-2 sm:grid-cols-4"
          >
            <div>
              <label class="label">{{ $t("txDetail.payType") }}</label>
              <select v-model="payForm.type" class="input" required>
                <option value="earnest_money">
                  {{ $t("paymentType.earnest_money") }}
                </option>
                <option value="service_fee">
                  {{ $t("paymentType.service_fee") }}
                </option>
                <option value="other">{{ $t("paymentType.other") }}</option>
              </select>
            </div>
            <div>
              <label class="label">{{ $t("txDetail.payAmount") }}</label>
              <input
                v-model.number="payForm.amount"
                type="number"
                min="0"
                step="0.01"
                class="input"
                required
                placeholder="5000"
              />
            </div>
            <div>
              <label class="label">{{ $t("txDetail.payStatus") }}</label>
              <select v-model="payForm.status" class="input">
                <option value="pending">
                  {{ $t("paymentStatus.pending") }}
                </option>
                <option value="received">
                  {{ $t("paymentStatus.received") }}
                </option>
              </select>
            </div>
            <div>
              <label class="label">{{ $t("txDetail.payDate") }}</label>
              <input v-model="payForm.date" type="date" class="input" />
            </div>
            <div class="col-span-2 sm:col-span-4">
              <label class="label">{{ $t("txDetail.payNote") }}</label>
              <input
                v-model="payForm.note"
                class="input"
                :placeholder="$t('txDetail.payNotePlaceholder')"
              />
            </div>
            <div class="flex items-center gap-3 col-span-2 sm:col-span-4">
              <button
                type="submit"
                class="px-4 py-1.5 text-xs btn-primary"
                :disabled="paySubmitting"
              >
                {{
                  paySubmitting
                    ? $t("txDetail.saving")
                    : $t("txDetail.addPaymentBtn")
                }}
              </button>
              <AppAlert :message="payError" type="error" class="flex-1" />
            </div>
          </form>
        </div>

        <EmptyState
          v-if="!tx.payments.length"
          :title="$t('txDetail.noPayments')"
          :description="$t('txDetail.noPaymentsDesc')"
          :card="false"
        />

        <div v-else class="divide-y divide-black-10">
          <div v-for="p in tx.payments" :key="p._id">
            <div
              v-if="editingPaymentId !== p._id"
              class="flex justify-between items-center px-6 py-3"
            >
              <div>
                <p class="font-medium text-slate-800 text-sm">
                  {{ $t(`paymentType.${p.type}`) }}2
                </p>
                <p class="text-slate-400 text-xs">
                  {{ p.note ?? "—" }} ·
                  {{ p.date ? formatDate(p.date) : "No date" }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-semibold text-slate-700 text-sm"
                  >{{ fmt(p.amount) }} {{ tx.currency }}</span
                >
                <span
                  class="px-2 py-0.5 rounded-full font-medium text-xs"
                  :class="
                    p.status === 'received'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  "
                >
                  {{ $t(`paymentStatus.${p.status}`) }}
                </span>
                <template v-if="tx.stage !== 'completed'">
                  <button
                    class="p-1 text-slate-400 hover:text-primary transition-colors"
                    @click="startEditPayment(p)"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button
                    class="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    @click="handleDeletePayment(p._id)"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </template>
              </div>
            </div>

            <div v-else class="bg-slate-50 px-6 py-4 border-l-2 border-primary">
              <form
                @submit.prevent="handleUpdatePayment(p._id)"
                class="gap-3 grid grid-cols-2 sm:grid-cols-4"
              >
                <div>
                  <label class="label">{{ $t("txDetail.payType") }}</label>
                  <select v-model="editPayForm.type" class="input" required>
                    <option value="earnest_money">
                      {{ $t("paymentType.earnest_money") }}
                    </option>
                    <option value="service_fee">
                      {{ $t("paymentType.service_fee") }}
                    </option>
                    <option value="other">{{ $t("paymentType.other") }}</option>
                  </select>
                </div>
                <div>
                  <label class="label">{{ $t("txDetail.payAmount") }}</label>
                  <input
                    v-model.number="editPayForm.amount"
                    type="number"
                    min="0"
                    step="0.01"
                    class="input"
                    required
                  />
                </div>
                <div>
                  <label class="label">{{ $t("txDetail.payStatus") }}</label>
                  <select v-model="editPayForm.status" class="input">
                    <option value="pending">
                      {{ $t("paymentStatus.pending") }}
                    </option>
                    <option value="received">
                      {{ $t("paymentStatus.received") }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="label">{{ $t("txDetail.payDate") }}</label>
                  <input v-model="editPayForm.date" type="date" class="input" />
                </div>
                <div class="col-span-2 sm:col-span-4">
                  <label class="label">{{ $t("txDetail.payNote") }}</label>
                  <input
                    v-model="editPayForm.note"
                    class="input"
                    :placeholder="$t('txDetail.payNotePlaceholder')"
                  />
                </div>
                <div class="flex items-center gap-3 col-span-2 sm:col-span-4">
                  <button
                    type="submit"
                    class="px-4 py-1.5 text-xs btn-primary"
                    :disabled="editPaySubmitting"
                  >
                    {{
                      editPaySubmitting
                        ? $t("txDetail.saving")
                        : $t("txActions.save")
                    }}
                  </button>
                  <button
                    type="button"
                    class="px-4 py-1.5 text-xs btn-secondary"
                    @click="editingPaymentId = null"
                  >
                    {{ $t("txDetail.cancel") }}
                  </button>
                  <AppAlert
                    :message="editPayError"
                    type="error"
                    class="flex-1"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="px-6 py-4 border-black/10 border-b">
          <h2 class="font-semibold text-slate-700 text-sm">
            {{ $t("txDetail.financialBreakdown") }}
          </h2>
        </div>

        <EmptyState
          v-if="tx.stage !== 'completed'"
          :title="$t('txDetail.notAvailable')"
          :description="$t('txDetail.notAvailableDesc')"
          :card="false"
        />

        <div v-else-if="tx.financialBreakdown" class="divide-y divide-black-10">
          <div
            v-for="row in breakdownRows"
            :key="row.labelKey"
            class="flex justify-between items-center px-6 py-3"
          >
            <span class="text-slate-600 text-sm">{{ $t(row.labelKey) }}</span>
            <span
              class="font-semibold text-sm"
              :class="row.highlight ? 'text-emerald-600' : 'text-slate-800'"
            >
              {{ fmt(row.value) }} {{ tx.financialBreakdown.currency }}
            </span>
          </div>
          <div v-if="tx.financialBreakdown.calculatedAt" class="px-6 py-3">
            <p class="text-slate-400 text-xs">
              {{ $t("txDetail.calculatedOn") }}
              {{ formatDate(tx.financialBreakdown.calculatedAt) }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>

  <ConfirmModal
    v-model="deleteModal"
    :title="$t('txActions.deleteTitle')"
    :description="$t('txActions.deleteDesc')"
    :highlight="tx?.propertyTitle"
    :confirm-label="deleting ? '…' : $t('txActions.delete')"
    :cancel-label="$t('newTx.cancel')"
    :loading="deleting"
    @confirm="confirmDelete"
    @cancel="deleteModal = false"
  />
</template>

<script setup lang="ts">
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useTransactionsStore } from "~/stores/transactions";
import { useAgentsStore } from "~/stores/agents";
import type { Agent, PaymentRecord, TransactionStage } from "~/types";

definePageMeta({ middleware: "auth" });

const { t } = useI18n();
const route = useRoute();
const store = useTransactionsStore();
const id = route.params.id as string;

const agentsStore = useAgentsStore();
onMounted(() => {
  store.fetchOne(id);
  agentsStore.fetchAll();
});

const tx = computed(() => store.current);

const stages: { value: TransactionStage }[] = [
  { value: "agreement" },
  { value: "earnest_money" },
  { value: "title_deed" },
  { value: "completed" },
];

const stageIndex = computed(() =>
  stages.findIndex((s) => s.value === tx.value?.stage),
);
const nextStage = computed<TransactionStage | null>(() => {
  const ni = stageIndex.value + 1;
  return ni < stages.length ? stages[ni].value : null;
});

function stageLabel(s: TransactionStage) {
  return t(`stages.${s}`);
}

const advancing = ref(false);
const stageError = ref<string | null>(null);

async function handleAdvance() {
  if (!nextStage.value) return;
  advancing.value = true;
  stageError.value = null;
  try {
    await store.updateStage(id, nextStage.value);
  } catch (e: any) {
    stageError.value = e.message;
  } finally {
    advancing.value = false;
  }
}

const showPaymentForm = ref(false);
const paySubmitting = ref(false);
const payError = ref<string | null>(null);
const payForm = reactive({
  type: "earnest_money" as "earnest_money" | "service_fee" | "other",
  amount: null as number | null,
  status: "pending" as "pending" | "received",
  date: "",
  note: "",
});

async function handleAddPayment() {
  payError.value = null;
  paySubmitting.value = true;
  try {
    await store.addPayment(id, {
      type: payForm.type,
      amount: payForm.amount!,
      status: payForm.status,
      date: payForm.date || undefined,
      note: payForm.note || undefined,
    });
    showPaymentForm.value = false;
    payForm.amount = null;
    payForm.note = "";
    payForm.date = "";
  } catch (e: any) {
    payError.value = e.message;
  } finally {
    paySubmitting.value = false;
  }
}

const breakdownRows = computed(() => {
  const b = tx.value?.financialBreakdown;
  if (!b) return [];
  return [
    {
      labelKey: "txDetail.rowTotalServiceFee",
      value: b.totalServiceFee,
      highlight: false,
    },
    {
      labelKey: "txDetail.rowAgencyAmount",
      value: b.agencyAmount,
      highlight: true,
    },
    {
      labelKey: "txDetail.rowAgentPool",
      value: b.agentPoolAmount,
      highlight: false,
    },
    {
      labelKey: "txDetail.rowListingAgentPayout",
      value: b.listingAgentAmount,
      highlight: false,
    },
    {
      labelKey: "txDetail.rowSellingAgentPayout",
      value: b.sellingAgentAmount,
      highlight: false,
    },
  ];
});

function agentName(a: Agent | string | null) {
  if (!a) return "—";
  return typeof a === "object" ? a.fullName : a;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-GB").format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const showEditForm = ref(false);
const editSubmitting = ref(false);
const editError = ref<string | null>(null);
const editForm = reactive({
  propertyTitle: "",
  clientName: "",
  propertyAddress: "",
  totalServiceFee: 0,
  listingAgentId: "",
  sellingAgentId: "",
});

function agentId(a: Agent | string | null) {
  if (!a) return "";
  return typeof a === "object" ? a._id : a;
}

function toggleEdit() {
  if (!showEditForm.value && tx.value) {
    editForm.propertyTitle = tx.value.propertyTitle;
    editForm.clientName = tx.value.clientName;
    editForm.propertyAddress = tx.value.propertyAddress;
    editForm.totalServiceFee = tx.value.totalServiceFee;
    editForm.listingAgentId = agentId(tx.value.listingAgentId);
    editForm.sellingAgentId = agentId(tx.value.sellingAgentId);
    editError.value = null;
  }
  showEditForm.value = !showEditForm.value;
}

async function handleUpdate() {
  editError.value = null;
  editSubmitting.value = true;
  try {
    await store.update(id, {
      propertyTitle: editForm.propertyTitle,
      clientName: editForm.clientName,
      propertyAddress: editForm.propertyAddress,
      totalServiceFee: editForm.totalServiceFee,
      listingAgentId: editForm.listingAgentId,
      sellingAgentId: editForm.sellingAgentId,
    });
    showEditForm.value = false;
  } catch (e: any) {
    editError.value = e.message;
  } finally {
    editSubmitting.value = false;
  }
}

const editingPaymentId = ref<string | null>(null);
const editPaySubmitting = ref(false);
const editPayError = ref<string | null>(null);
const editPayForm = reactive({
  type: "earnest_money" as "earnest_money" | "service_fee" | "other",
  amount: 0,
  status: "pending" as "pending" | "received",
  date: "",
  note: "",
});

function startEditPayment(p: PaymentRecord) {
  editingPaymentId.value = p._id;
  editPayForm.type = p.type;
  editPayForm.amount = p.amount;
  editPayForm.status = p.status;
  editPayForm.date = p.date ? p.date.slice(0, 10) : "";
  editPayForm.note = p.note ?? "";
  editPayError.value = null;
}

async function handleUpdatePayment(paymentId: string) {
  editPayError.value = null;
  editPaySubmitting.value = true;
  try {
    await store.updatePayment(id, paymentId, {
      type: editPayForm.type,
      amount: editPayForm.amount,
      status: editPayForm.status,
      date: editPayForm.date || undefined,
      note: editPayForm.note || undefined,
    });
    editingPaymentId.value = null;
  } catch (e: any) {
    editPayError.value = e.message;
  } finally {
    editPaySubmitting.value = false;
  }
}

async function handleDeletePayment(paymentId: string) {
  try {
    await store.removePayment(id, paymentId);
  } catch (e: any) {
    toast.error(e.message);
  }
}

const deleting = ref(false);
const deleteModal = ref(false);
const router = useRouter();

function handleDelete() {
  deleteModal.value = true;
}

async function confirmDelete() {
  deleting.value = true;
  try {
    await store.remove(id);
    router.push("/transactions");
  } catch (e: any) {
    toast.error(e.message);
    deleting.value = false;
    deleteModal.value = false;
  }
}
</script>
