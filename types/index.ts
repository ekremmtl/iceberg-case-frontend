export type TransactionStage =
  | "agreement"
  | "earnest_money"
  | "title_deed"
  | "completed";

export interface Agent {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  _id: string;
  type: "earnest_money" | "service_fee" | "other";
  amount: number;
  status: "pending" | "received";
  date: string;
  note?: string;
}

export interface FinancialBreakdown {
  totalServiceFee: number;
  currency: string;
  agencyAmount: number;
  agentPoolAmount: number;
  listingAgentAmount: number;
  sellingAgentAmount: number;
  listingAgentReason?: string;
  sellingAgentReason?: string;
  calculatedAt?: string;
}

export interface Transaction {
  _id: string;
  propertyTitle: string;
  propertyAddress: string;
  clientName: string;
  totalServiceFee: number;
  currency: string;
  listingAgentId: Agent | string;
  sellingAgentId: Agent | string;
  stage: TransactionStage;
  payments: PaymentRecord[];
  financialBreakdown?: FinancialBreakdown;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalTransactions: number;
  totalAgents: number;
  transactionsByStage: Record<TransactionStage, number>;
  financials: {
    totalServiceFeeCollected: number;
    totalAgencyRevenue: number;
    currency: string;
  };
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role?: string;
}

export interface CreateTransactionPayload {
  propertyTitle: string;
  propertyAddress: string;
  clientName: string;
  totalServiceFee: number;
  listingAgentId: string;
  sellingAgentId: string;
}

export interface CreateAgentPayload {
  fullName: string;
  email: string;
  phone?: string;
}

export interface AddPaymentPayload {
  type: "earnest_money" | "service_fee" | "other";
  amount: number;
  status?: "pending" | "received";
  date?: string;
  note?: string;
}
