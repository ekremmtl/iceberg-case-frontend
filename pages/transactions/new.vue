<template>
  <div class="p-8 max-w-2xl mx-auto">
    <div class="mb-8">
      <NuxtLink
        to="/transactions"
        class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        ><ArrowLeft class="w-3 h-3" />{{ $t("newTx.back") }}</NuxtLink
      >
      <h1 class="page-title mt-2">{{ $t("newTx.title") }}</h1>
      <p class="page-subtitle">{{ $t("newTx.subtitle") }}</p>
    </div>

    <div class="card p-6">
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">{{ $t("newTx.propertyTitle") }}</label>
            <input
              v-model="form.propertyTitle"
              class="input"
              :placeholder="$t('newTx.propertyTitlePlaceholder')"
              required
            />
          </div>
          <div>
            <label class="label">{{ $t("newTx.clientName") }}</label>
            <input
              v-model="form.clientName"
              class="input"
              :placeholder="$t('newTx.clientNamePlaceholder')"
              required
            />
          </div>
        </div>

        <div>
          <label class="label">{{ $t("newTx.propertyAddress") }}</label>
          <input
            v-model="form.propertyAddress"
            class="input"
            :placeholder="$t('newTx.propertyAddressPlaceholder')"
            required
          />
        </div>

        <div>
          <label class="label">{{ $t("newTx.totalServiceFee") }}</label>
          <input
            v-model.number="form.totalServiceFee"
            type="number"
            min="0"
            step="0.01"
            class="input"
            placeholder="25000"
            required
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">{{ $t("newTx.listingAgent") }}</label>
            <select v-model="form.listingAgentId" class="input" required>
              <option value="" disabled>{{ $t("newTx.selectAgent") }}</option>
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
            <select v-model="form.sellingAgentId" class="input" required>
              <option value="" disabled>{{ $t("newTx.selectAgent") }}</option>
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

        <AppAlert :message="error" type="error" />
        <AppAlert :message="success" type="success" />

        <div class="flex gap-3 pt-2">
          <button type="submit" class="btn-primary" :disabled="submitting">
            {{ submitting ? $t("newTx.creating") : $t("newTx.create") }}
          </button>
          <NuxtLink to="/transactions" class="btn-secondary">{{
            $t("newTx.cancel")
          }}</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { useAgentsStore } from "~/stores/agents";
import { useTransactionsStore } from "~/stores/transactions";

definePageMeta({ middleware: "auth" });

const { t } = useI18n();
const agentsStore = useAgentsStore();
const txStore = useTransactionsStore();
const router = useRouter();

onMounted(() => agentsStore.fetchAll());

const form = reactive({
  propertyTitle: "",
  propertyAddress: "",
  clientName: "",
  totalServiceFee: null as number | null,
  listingAgentId: "",
  sellingAgentId: "",
});

const submitting = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

async function handleSubmit() {
  if (!form.totalServiceFee || form.totalServiceFee <= 0) {
    error.value = t("newTx.feeError");
    return;
  }
  error.value = null;
  submitting.value = true;
  try {
    const tx = await txStore.create({
      propertyTitle: form.propertyTitle,
      propertyAddress: form.propertyAddress,
      clientName: form.clientName,
      totalServiceFee: form.totalServiceFee!,
      listingAgentId: form.listingAgentId,
      sellingAgentId: form.sellingAgentId,
    });
    success.value = t("newTx.createdSuccess");
    setTimeout(() => router.push(`/transactions/${tx._id}`), 800);
  } catch (e: any) {
    error.value = e.message;
  } finally {
    submitting.value = false;
  }
}
</script>
