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
  // A chargeback was reported for this payment — separate from `status`,
  // since a dispute doesn't automatically mean the money was reversed.
  disputed?: boolean;
}

export interface MyBilling {
  plan: string;
  // What the currently-active plan actually costs — always reflects `plan`,
  // never a pending unpaid selection. Use this (not `amountDue`) for any
  // "your plan costs X" display.
  planPrice: number;
  // Set only when a different plan has been selected but not yet paid for —
  // `plan` always reflects what's actually active/entitled right now.
  pendingPlan: string | null;
  // Set only when a downgrade (or lateral move) is scheduled to take effect
  // for free at the next renewal — mutually exclusive with `pendingPlan`.
  scheduledPlan: string | null;
  status: string;
  currency: string;
  billingCycle: string;
  nextBillingAt: string | null;
  lastPaymentAt: string | null;
  trialEndsAt: string | null;
  // What's actually owed right now — equals planPrice normally, but is the
  // *pending* plan's price if a change is awaiting payment.
  amountDue: number;
  // Most recent page only — see `paymentsTotal` and `useGetMyPaymentsQuery`
  // for "load more" pagination over the full history.
  payments: BillingPayment[];
  paymentsTotal: number;
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

export interface DisputedPayment {
  institutionId: string;
  institutionName: string;
  paymentId: string;
  amount: number;
  gateway: string;
  reference: string | null;
  status: string;
  disputeNote: string | null;
  resolved: boolean;
  resolvedAt: string | null;
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
    getMyPayments: builder.query<ApiObject<{ items: BillingPayment[]; total: number; page: number; limit: number }>, { page: number; limit?: number }>({
      query: ({ page, limit = 20 }) => `/billing/payments?page=${page}&limit=${limit}`,
    }),
    selectPlan: builder.mutation<
      ApiObject<{
        plan: string;
        monthlyAmount: number;
        effective: 'now' | 'next_renewal' | 'pending_payment';
        effectiveAt?: string | null;
        // Set (non-blocking) when the target plan's student limit is lower
        // than the number of active students already enrolled.
        overStudentLimit?: number | null;
      }>,
      { planKey: string }
    >({
      query: (body) => ({ url: '/billing/plan', method: 'POST', body }),
      invalidatesTags: [{ type: 'Billing', id: 'ME' }],
    }),
    billingCheckout: builder.mutation<ApiObject<{ settled: boolean; gateway: string; reference: string; redirectUrl?: string | null; gatewayTxnId?: string | null }>, { gateway: Gateway }>({
      query: (body) => ({ url: '/billing/checkout', method: 'POST', body }),
      invalidatesTags: [{ type: 'Billing', id: 'ME' }],
    }),
    // Reconciliation fallback for when the payer returns from a hosted
    // checkout page before (or without) a webhook ever arriving.
    verifyPayment: builder.mutation<ApiObject<{ status: 'success' | 'pending' | 'failed' | 'refunded' }>, { gateway: Gateway; gatewayTxnId: string }>({
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
    getDisputedPayments: builder.query<ApiObject<DisputedPayment[]>, void>({
      query: () => '/billing/disputed',
      providesTags: [{ type: 'Billing', id: 'DISPUTED' }],
    }),
    resolveDispute: builder.mutation<ApiObject<{ ok: boolean }>, { institutionId: string; paymentId: string }>({
      query: ({ institutionId, paymentId }) => ({ url: `/billing/${institutionId}/payments/${paymentId}/resolve-dispute`, method: 'POST' }),
      invalidatesTags: [{ type: 'Billing', id: 'DISPUTED' }],
    }),
    confirmPayment: builder.mutation<ApiObject<unknown>, { institutionId: string; paymentId: string }>({
      query: ({ institutionId, paymentId }) => ({ url: `/billing/${institutionId}/payments/${paymentId}/confirm`, method: 'POST' }),
      // Also refresh the superadmin's own institution-detail and revenue
      // views for this institution — confirming a payment changes both.
      invalidatesTags: (_r, _e, { institutionId }) => [
        { type: 'Billing', id: 'PENDING' },
        { type: 'Institutions', id: institutionId },
        { type: 'Institutions', id: 'OVERVIEW' },
        { type: 'Institutions', id: 'REVENUE' },
      ],
    }),
    rejectPayment: builder.mutation<ApiObject<unknown>, { institutionId: string; paymentId: string; reason?: string }>({
      query: ({ institutionId, paymentId, reason }) => ({ url: `/billing/${institutionId}/payments/${paymentId}/reject`, method: 'POST', body: { reason } }),
      invalidatesTags: (_r, _e, { institutionId }) => [
        { type: 'Billing', id: 'PENDING' },
        { type: 'Institutions', id: institutionId },
      ],
    }),
  }),
});

export const {
  useGetMyBillingQuery,
  useGetBillingPlansQuery,
  useLazyGetMyPaymentsQuery,
  useSelectPlanMutation,
  useBillingCheckoutMutation,
  useVerifyPaymentMutation,
  useSubmitBankTransferMutation,
  useGetPendingPaymentsQuery,
  useGetDisputedPaymentsQuery,
  useResolveDisputeMutation,
  useConfirmPaymentMutation,
  useRejectPaymentMutation,
} = billingApi;
