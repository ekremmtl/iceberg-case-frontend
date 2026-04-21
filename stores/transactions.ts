import { defineStore } from "pinia";
import { api } from "~/utils/api";
import type {
  Transaction,
  CreateTransactionPayload,
  AddPaymentPayload,
} from "~/types";

export const useTransactionsStore = defineStore("transactions", {
  state: () => ({
    transactions: [] as Transaction[],
    current: null as Transaction | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        this.transactions = await api.transactions.list();
      } catch (e: any) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchOne(id: string) {
      this.loading = true;
      this.error = null;
      try {
        this.current = await api.transactions.get(id);
      } catch (e: any) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async create(payload: CreateTransactionPayload) {
      const tx = await api.transactions.create(payload);
      this.transactions.unshift(tx);
      return tx;
    },

    async updateStage(id: string, stage: string) {
      const tx = await api.transactions.updateStage(id, stage);
      this.current = tx;
      const idx = this.transactions.findIndex((t) => t._id === id);
      if (idx !== -1) this.transactions[idx] = tx;
      return tx;
    },

    async update(id: string, payload: Partial<CreateTransactionPayload>) {
      const tx = await api.transactions.update(id, payload);
      this.current = tx;
      const idx = this.transactions.findIndex((t) => t._id === id);
      if (idx !== -1) this.transactions[idx] = tx;
      return tx;
    },

    async remove(id: string) {
      await api.transactions.remove(id);
      this.transactions = this.transactions.filter((t) => t._id !== id);
      if (this.current?._id === id) this.current = null;
    },

    async addPayment(id: string, payload: AddPaymentPayload) {
      const tx = await api.transactions.addPayment(id, payload);
      this.current = tx;
      return tx;
    },

    async updatePayment(id: string, paymentId: string, payload: Partial<AddPaymentPayload>) {
      const tx = await api.transactions.updatePayment(id, paymentId, payload);
      this.current = tx;
      return tx;
    },

    async removePayment(id: string, paymentId: string) {
      const tx = await api.transactions.removePayment(id, paymentId);
      this.current = tx;
      return tx;
    },
  },
});
