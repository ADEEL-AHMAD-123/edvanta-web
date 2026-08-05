import { baseApi } from './baseApi';

export type Gateway = 'safepay' | 'jazzcash' | 'easypaisa';

export interface BillingPayment {
  id?: string;
  amount: number;
  currency: string;
  gateway: string;
  reference: string | null;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paidAt: string | null;
  createdAt: string;
}

export interface MyBilling {
  plan: string;
  status: string;
  monthlyAmount: number;
  currency: string;
  billingCycle: string;
  nextBillingAt: string | null;
  lastPaymentAt: string | null;
  trialEndsAt: string | null;
  amountDue: number;
  payments: BillingPayment[];
  online: { safepay: boolean; jazzcash: boolean; easypaisa: boolean; live: boolean };
  bank: { name: string | null; accountTitle: string | null; iban: string | null };
}

export interface BillingPlan {
  key: string;
  name: string;
  price: number;
  studentsLimit: number;
  storageGB: number;
  features: string[];
}

export interface PendingPayment {
  institutionId: string;
  institutionName: string;
  planType: string;
  paymentId: string;
  amount: number;
  gateway: string;
  reference: string | null;
  createdAt: string;
}

interface ApiObject<T> { success: boolean; data: T; message: string }

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyBilling: builder.query<ApiObject<MyBilling>, void>({
      query: () => '/billing/me',
      providesTags: [{ type: 'Billing', id: 'ME' }],
    }),
    getBillingPlans: builder.query<ApiObject<BillingPlan[]>, void>({
      query: () => '/billing/plans',
    }),
    selectPlan: builder.mutation<ApiObject<{ plan: string; monthlyAmount: number }>, { planKey: string }>({
      query: (body) => ({ url: '/billing/plan', method: 'POST', body }),
      invalidatesTags: [{ type: 'Billing', id: 'ME' }],
    }),
    billingCheckout: builder.mutation<ApiObject<{ settled: boolean; gateway: string; reference: string; redirectUrl?: string | null; gatewayTxnId?: string | null }>, { gateway: Gateway }>({
      query: (body) => ({ url: '/billing/checkout', method: 'POST', body }),
      invalidatesTags: [{ type: 'Billing', id: 'ME' }],
    }),
    // Reconciliation fallback for when the payer returns from a hosted
    // checkout page before (or without) a webhook ever arriving.
    verifyPayment: builder.mutation<ApiObject<{ status: 'success' | 'pending' | 'failed' }>, { gateway: Gateway; gatewayTxnId: string }>({
      query: ({ gateway, gatewayTxnId }) => ({ url: `/billing/verify?gateway=${gateway}&gatewayTxnId=${encodeURIComponent(gatewayTxnId)}` }),
      invalidatesTags: [{ type: 'Billing', id: 'ME' }],
    }),
    submitBankTransfer: builder.mutation<ApiObject<{ ok: boolean }>, { reference: string; amount?: number }>({
      query: (body) => ({ url: '/billing/bank-transfer', method: 'POST', body }),
      invalidatesTags: [{ type: 'Billing', id: 'ME' }],
    }),

    // Super admin
    getPendingPayments: builder.query<ApiObject<PendingPayment[]>, void>({
      query: () => '/billing/pending',
      providesTags: [{ type: 'Billing', id: 'PENDING' }],
    }),
    confirmPayment: builder.mutation<ApiObject<unknown>, { institutionId: string; paymentId: string }>({
      query: ({ institutionId, paymentId }) => ({ url: `/billing/${institutionId}/payments/${paymentId}/confirm`, method: 'POST' }),
      invalidatesTags: [{ type: 'Billing', id: 'PENDING' }],
    }),
    rejectPayment: builder.mutation<ApiObject<unknown>, { institutionId: string; paymentId: string; reason?: string }>({
      query: ({ institutionId, paymentId, reason }) => ({ url: `/billing/${institutionId}/payments/${paymentId}/reject`, method: 'POST', body: { reason } }),
      invalidatesTags: [{ type: 'Billing', id: 'PENDING' }],
    }),
  }),
});

export const {
  useGetMyBillingQuery,
  useGetBillingPlansQuery,
  useSelectPlanMutation,
  useBillingCheckoutMutation,
  useVerifyPaymentMutation,
  useSubmitBankTransferMutation,
  useGetPendingPaymentsQuery,
  useConfirmPaymentMutation,
  useRejectPaymentMutation,
} = billingApi;
