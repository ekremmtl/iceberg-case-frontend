<template>
  <div class="w-full max-w-md px-4">
    <div class="border border-white/20 rounded-lg p-6 bg-black">
      <div class="mb-4 border-b border-white/20 pb-4">
        <img
          src="~/assets/images/logo.png"
          alt="Iceberg Case"
          class="h-14 w-auto mx-auto"
        />
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="label text-white">{{ $t("auth.email") }}</label>
          <input
            v-model="form.email"
            type="email"
            class="input"
            :placeholder="$t('auth.emailPlaceholder')"
            required
            autocomplete="email"
          />
        </div>
        <div>
          <label class="label text-white">{{ $t("auth.password") }}</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="input pr-10"
              :placeholder="$t('auth.passwordPlaceholder')"
              required
              autocomplete="current-password"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-black/40 hover:text-black/70 transition-colors"
              @click="showPassword = !showPassword"
            >
              <Eye v-if="!showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="btn-primary w-full mt-2"
          :disabled="loading"
        >
          <Loader2 v-if="loading" class="animate-spin h-4 w-4" />
          {{ loading ? $t("auth.signingIn") : $t("auth.signIn") }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, Eye, EyeOff } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useAuthStore } from "~/stores/auth";

definePageMeta({ layout: "auth" });

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

const form = reactive({ email: "", password: "" });
const loading = ref(false);
const showPassword = ref(false);

async function handleLogin() {
  loading.value = true;
  try {
    await authStore.login(form.email, form.password);
    await router.push("/");
  } catch (e: any) {
    toast.error(t("auth.invalidCredentials"), { duration: 5000 });
  } finally {
    loading.value = false;
  }
}
</script>
