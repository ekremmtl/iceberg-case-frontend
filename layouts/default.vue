<template>
  <div class="flex h-screen overflow-hidden bg-white">
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/50 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <aside
      class="fixed inset-y-0 left-0 z-30 w-60 flex-shrink-0 bg-black flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div
        class="flex items-center justify-between pr-2 py-2 border-b border-white/10"
      >
        <AppLogo size="md" />
        <div class="flex items-center gap-0.5">
          <button
            @click="setLocale('tr')"
            class="text-xs px-1.5 py-0.5 rounded font-medium transition-colors"
            :class="
              locale === 'tr'
                ? 'bg-primary text-white'
                : 'text-white/40 hover:text-white/70'
            "
          >
            TR
          </button>
          <button
            @click="setLocale('en')"
            class="text-xs px-1.5 py-0.5 rounded font-medium transition-colors"
            :class="
              locale === 'en'
                ? 'bg-primary text-white'
                : 'text-white/40 hover:text-white/70'
            "
          >
            EN
          </button>
        </div>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-0.5">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="
            isActive(item.to)
              ? 'bg-primary text-white'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          "
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
          {{ $t(item.labelKey) }}
        </NuxtLink>
      </nav>

      <div class="border-t border-white/10 p-4">
        <div class="flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <p
              v-if="authStore.user?.fullName"
              class="text-xs font-medium text-white truncate"
            >
              {{ authStore.user.fullName }}
            </p>
            <p v-if="authStore.user?.email" class="text-xs text-white/40">
              {{ authStore.user.email }}
            </p>
          </div>
          <button
            @click="logoutModal = true"
            class="text-white/40 hover:text-primary transition-colors p-1 rounded"
            :title="$t('nav.logout')"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 lg:ml-0">
      <header
        class="lg:hidden flex items-center px-4 h-14 bg-black border-b border-white/10 flex-shrink-0"
      >
        <button
          class="text-white/70 hover:text-white transition-colors p-1 -ml-1"
          @click="sidebarOpen = !sidebarOpen"
        >
          <Menu v-if="!sidebarOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>

        <AppLogo size="sm" />
      </header>

      <main class="flex-1 overflow-y-auto bg-white p-4 md:p-8">
        <slot />
      </main>

      <AppFooter />
    </div>
  </div>

  <ConfirmModal
    v-model="logoutModal"
    :title="$t('nav.logoutTitle')"
    :description="$t('nav.logoutDesc')"
    :confirm-label="$t('nav.logout')"
    :cancel-label="$t('newTx.cancel')"
    @confirm="authStore.logout()"
    @cancel="logoutModal = false"
  />
</template>

<script setup lang="ts">
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from "lucide-vue-next";
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const { locale, setLocale } = useI18n();
const authStore = useAuthStore();
const route = useRoute();

const sidebarOpen = ref(false);
const logoutModal = ref(false);

onMounted(async () => {
  authStore.init();
  if (!authStore.user && authStore.token) await authStore.fetchMe();
});

watch(
  () => route.path,
  () => {
    sidebarOpen.value = false;
  },
);

const navItems = [
  { to: "/", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/agents", labelKey: "nav.agents", icon: Users },
  { to: "/transactions", labelKey: "nav.transactions", icon: ClipboardList },
];

function isActive(to: string) {
  if (to === "/") return route.path === "/";
  return route.path.startsWith(to);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
