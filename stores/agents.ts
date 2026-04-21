import { defineStore } from "pinia";
import { api } from "~/utils/api";
import type { Agent, CreateAgentPayload } from "~/types";

export const useAgentsStore = defineStore("agents", {
  state: () => ({
    agents: [] as Agent[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        this.agents = await api.agents.list();
      } catch (e: any) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async create(payload: CreateAgentPayload) {
      const agent = await api.agents.create(payload);
      this.agents.unshift(agent);
      return agent;
    },

    async update(id: string, payload: Partial<CreateAgentPayload>) {
      const agent = await api.agents.update(id, payload);
      const idx = this.agents.findIndex((a) => a._id === id);
      if (idx !== -1) this.agents[idx] = agent;
      return agent;
    },

    async remove(id: string) {
      await api.agents.remove(id);
      this.agents = this.agents.filter((a) => a._id !== id);
    },
  },
});
