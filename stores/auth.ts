import { defineStore } from "pinia";
import { api } from "~/utils/api";
import type { AuthUser } from "~/types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    user: null as AuthUser | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    init() {
      if (import.meta.client) {
        const stored = localStorage.getItem("iceberg_auth_token");
        if (stored) this.token = stored;
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      try {
        const { accessToken } = await api.auth.login(email, password);
        this.token = accessToken;
        localStorage.setItem("iceberg_auth_token", accessToken);
        await this.fetchMe();
      } finally {
        this.loading = false;
      }
    },

    async fetchMe() {
      try {
        this.user = await api.auth.me();
      } catch {
        this.logout();
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      if (import.meta.client) localStorage.removeItem("iceberg_auth_token");
      navigateTo("/login");
    },
  },
});
