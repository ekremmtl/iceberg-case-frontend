<template>
  <div>
    <PageHeader :title="$t('agents.title')" :subtitle="$t('agents.subtitle')">
      <button class="btn-primary" @click="showForm = true">
        <Plus class="w-4 h-4" />{{ $t("agents.newAgent") }}
      </button>
    </PageHeader>

    <LoadingSpinner v-if="store.loading" />
    <AppAlert v-else-if="store.error" :message="store.error" />
    <EmptyState
      v-else-if="!store.agents.length"
      :title="$t('agents.empty')"
      :description="$t('agents.emptyDesc')"
    />

    <div class="card" v-else>
      <div class="px-6 py-4 border-black/8 border-b">
        <p class="font-semibold text-black text-sm">
          {{ $t("agents.allAgents") }}
          <span class="ml-1 font-normal text-black/40"
            >({{ store.agents.length }})</span
          >
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm whitespace-nowrap">
          <thead class="bg-black/3 border-black/10 border-b">
            <tr>
              <th
                class="px-4 py-3 w-8 font-semibold text-black/40 text-xs uppercase tracking-wide"
              >
                #
              </th>
              <th
                class="px-4 py-3 font-semibold text-black/40 text-xs text-left uppercase tracking-wide"
              >
                {{ $t("agents.fullName") }}
              </th>
              <th
                class="px-4 py-3 font-semibold text-black/40 text-xs text-left uppercase tracking-wide"
              >
                {{ $t("agents.email") }}
              </th>
              <th
                class="px-4 py-3 font-semibold text-black/40 text-xs text-left uppercase tracking-wide"
              >
                {{ $t("agents.phone") }}
              </th>
              <th
                class="px-4 py-3 font-semibold text-black/40 text-xs text-left uppercase tracking-wide"
              >
                {{ $t("agents.createdAt") }}
              </th>
              <th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-black/5">
            <template v-for="(agent, idx) in store.agents" :key="agent._id">
              <tr
                v-if="editingId !== agent._id"
                class="hover:bg-black/2 transition-colors"
              >
                <td class="px-4 py-3 font-medium text-black/30 text-xs">
                  {{ idx + 1 }}
                </td>
                <td class="px-4 py-3 font-medium text-black">
                  {{ agent.fullName }}
                </td>
                <td class="px-4 py-3 text-black/60">
                  {{ agent.email }}
                </td>
                <td class="px-4 py-3 text-black/60">
                  {{ agent.phone ?? "—" }}
                </td>
                <td class="px-4 py-3 text-black/40 text-xs">
                  {{ formatDate(agent.createdAt) }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex justify-end items-center gap-2">
                    <button
                      class="hover:bg-primary/10 px-2 py-1 rounded font-medium text-primary text-xs transition-colors"
                      @click="startEdit(agent)"
                    >
                      {{ $t("agents.edit") }}
                    </button>
                    <button
                      class="hover:bg-red-50 px-2 py-1 rounded font-medium text-red-500 hover:text-red-700 text-xs transition-colors"
                      :disabled="deletingId === agent._id"
                      @click="handleDelete(agent._id, agent.fullName)"
                    >
                      {{ deletingId === agent._id ? "…" : $t("agents.delete") }}
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-else class="bg-black/2">
                <td class="px-4 py-3 text-black/30 text-xs">
                  {{ idx + 1 }}
                </td>
                <td colspan="5" class="px-4 py-3">
                  <form
                    @submit.prevent="handleUpdate(agent._id)"
                    class="flex flex-wrap items-center gap-2"
                  >
                    <input
                      v-model="editForm.fullName"
                      class="flex-1 min-w-[140px] input"
                      :placeholder="$t('agents.fullNamePlaceholder')"
                      required
                    />
                    <input
                      v-model="editForm.email"
                      type="email"
                      class="flex-1 min-w-[160px] input"
                      :placeholder="$t('agents.emailPlaceholder')"
                      required
                    />
                    <input
                      v-model="editForm.phone"
                      class="flex-1 min-w-[120px] input"
                      :placeholder="$t('agents.phonePlaceholder')"
                    />
                    <button
                      type="submit"
                      class="btn-primary"
                      :disabled="editSubmitting"
                    >
                      {{
                        editSubmitting ? $t("agents.saving") : $t("agents.save")
                      }}
                    </button>
                    <button
                      type="button"
                      class="btn-secondary"
                      @click="editingId = null"
                    >
                      {{ $t("agents.cancel") }}
                    </button>
                    <AppAlert :message="editError" type="error" />
                  </form>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showForm"
        class="z-50 fixed inset-0 flex justify-center items-center p-4"
        @mousedown.self="closeCreate"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div
          class="relative bg-white shadow-xl p-6 rounded-2xl w-full max-w-md"
        >
          <div class="flex justify-between items-center mb-5">
            <h2 class="font-semibold text-black text-base">
              {{ $t("agents.addNewAgent") }}
            </h2>
            <button
              type="button"
              class="text-black/30 hover:text-black transition-colors"
              @click="closeCreate"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
          <form @submit.prevent="handleCreate" class="space-y-3">
            <div>
              <label class="label">{{ $t("agents.fullName") }}</label>
              <input
                v-model="form.fullName"
                class="input"
                :placeholder="$t('agents.fullNamePlaceholder')"
                required
              />
            </div>
            <div>
              <label class="label">{{ $t("agents.email") }}</label>
              <input
                v-model="form.email"
                type="email"
                class="input"
                :placeholder="$t('agents.emailPlaceholder')"
                required
              />
            </div>
            <div>
              <label class="label">{{ $t("agents.phone") }}</label>
              <input
                v-model="form.phone"
                class="input"
                :placeholder="$t('agents.phonePlaceholder')"
              />
            </div>
            <AppAlert :message="formError" type="error" />
            <AppAlert :message="formSuccess" type="success" />
            <div class="flex gap-3 pt-1">
              <button
                type="button"
                class="flex-1 btn-secondary"
                @click="closeCreate"
                :disabled="submitting"
              >
                {{ $t("agents.cancel") }}
              </button>
              <button
                type="submit"
                class="flex-1 btn-primary"
                :disabled="submitting"
              >
                {{
                  submitting ? $t("agents.saving") : $t("agents.createAgent")
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>

  <ConfirmModal
    v-model="deleteModal.open"
    :title="$t('agents.deleteTitle')"
    :description="$t('agents.deleteDesc')"
    :highlight="deleteModal.agentName"
    :confirm-label="deletingId ? '…' : $t('agents.delete')"
    :cancel-label="$t('agents.cancel')"
    :loading="!!deletingId"
    @confirm="confirmDelete"
    @cancel="deleteModal.open = false"
  />
</template>

<script setup lang="ts">
import { X, Plus } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useAgentsStore } from "~/stores/agents";
import type { Agent } from "~/types";

definePageMeta({ middleware: "auth" });

const { t } = useI18n();
const store = useAgentsStore();

const showForm = ref(false);
const submitting = ref(false);
const formError = ref<string | null>(null);
const formSuccess = ref<string | null>(null);
const form = reactive({ fullName: "", email: "", phone: "" });

const editingId = ref<string | null>(null);
const editSubmitting = ref(false);
const editError = ref<string | null>(null);
const editForm = reactive({ fullName: "", email: "", phone: "" });
const deletingId = ref<string | null>(null);
const deleteModal = reactive({ open: false, agentId: "", agentName: "" });

onMounted(() => store.fetchAll());

function closeCreate() {
  if (submitting.value) return;
  showForm.value = false;
  formError.value = null;
  formSuccess.value = null;
  form.fullName = "";
  form.email = "";
  form.phone = "";
}

async function handleCreate() {
  formError.value = null;
  formSuccess.value = null;
  submitting.value = true;
  try {
    await store.create({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone || undefined,
    });
    formSuccess.value = t("agents.createdSuccess");
    setTimeout(() => closeCreate(), 1200);
  } catch (e: any) {
    formError.value = e.message;
  } finally {
    submitting.value = false;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function startEdit(agent: Agent) {
  editingId.value = agent._id;
  editForm.fullName = agent.fullName;
  editForm.email = agent.email;
  editForm.phone = agent.phone ?? "";
  editError.value = null;
}

async function handleUpdate(id: string) {
  editError.value = null;
  editSubmitting.value = true;
  try {
    await store.update(id, {
      fullName: editForm.fullName,
      email: editForm.email,
      phone: editForm.phone || undefined,
    });
    editingId.value = null;
  } catch (e: any) {
    editError.value = e.message;
  } finally {
    editSubmitting.value = false;
  }
}

function handleDelete(id: string, name: string) {
  deleteModal.agentId = id;
  deleteModal.agentName = name;
  deleteModal.open = true;
}

async function confirmDelete() {
  deletingId.value = deleteModal.agentId;
  try {
    await store.remove(deleteModal.agentId);
    deleteModal.open = false;
  } catch (e: any) {
    toast.error(e.message);
  } finally {
    deletingId.value = null;
  }
}
</script>
