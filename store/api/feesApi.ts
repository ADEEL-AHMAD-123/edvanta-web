import { baseApi } from './baseApi';

export type InvoiceStatus = 'pending' | 'partial' | 'paid' | 'overdue';
export type PaymentMethod = 'jazzcash' | 'easypaisa' | 'bank' | 'cash' | 'cheque' | 'challan';

export interface FeeStructure {
  id: string;
  name: string;
  academicYear: string;
  className: string | null;
  classId: string | null;
  isActive: boolean;
  autoBill: boolean;
  dueDay: number;
  total: number;
  components: { name: string; amount: number; frequency: string }[];
}

export interface Invoice {
  id: string;
  studentName: string;
  rollNumber: string;
  structureName: string | null;
  dueDate: string;
  month: number | null;
  year: number | null;
  netAmount: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
}

export interface FeesSummary {
  collectedThisMonth: number;
  outstanding: number;
  pendingInvoices: number;
}

export interface InvoiceDetail {
  id: string;
  studentName: string;
  rollNumber: string | null;
  structureName: string | null;
  dueDate: string;
  month: number | null;
  year: number | null;
  totalAmount: number;
  discountAmount: number;
  fineAmount: number;
  netAmount: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus | 'waived';
  payments: { id: string; amountPaid: number; paymentMethod: PaymentMethod; receiptNumber: string | null; paymentDate: string }[];
  adjustments: { id: string; type: 'credit' | 'debit'; amount: number; reason: string; createdAt: string }[];
}

export interface AdjustBody {
  invoiceId: string;
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
}

interface ApiArray<T> { success: boolean; data: T[]; message: string; meta?: any }
interface ApiObject<T> { success: boolean; data: T; message: string }

export interface CreateStructureBody {
  name: string;
  academicYear: string;
  classId?: string;
  components: { name: string; amount: number; frequency?: string }[];
  autoBill?: boolean;
  dueDay?: number;
}

export interface GenerateBody {
  feeStructureId: string;
  month: number;
  year: number;
  dueDate: string;
}

export interface PaymentBody {
  invoiceId: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  paymentDate?: string;
  notes?: string;
}

export const feesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeeStructures: builder.query<ApiArray<FeeStructure>, void>({
      query: () => '/fees/structures',
      providesTags: [{ type: 'Fees', id: 'STRUCTURES' }],
    }),
    createFeeStructure: builder.mutation<ApiObject<{ id: string }>, CreateStructureBody>({
      query: (body) => ({ url: '/fees/structures', method: 'POST', body }),
      invalidatesTags: [{ type: 'Fees', id: 'STRUCTURES' }],
    }),

    getInvoices: builder.query<
      ApiArray<Invoice>,
      { page?: number; limit?: number; status?: InvoiceStatus; classId?: string; search?: string } | void
    >({
      query: (params) => {
        const s = new URLSearchParams();
        const p = params || {};
        Object.entries(p).forEach(([k, v]) => {
          if (v !== undefined && v !== '' && v !== null) s.set(k, String(v));
        });
        const qs = s.toString();
        return `/fees/invoices${qs ? `?${qs}` : ''}`;
      },
      providesTags: [{ type: 'Fees', id: 'INVOICES' }],
    }),
    generateInvoices: builder.mutation<ApiObject<{ created: number; skipped: number }>, GenerateBody>({
      query: (body) => ({ url: '/fees/invoices/generate', method: 'POST', body }),
      invalidatesTags: [{ type: 'Fees', id: 'INVOICES' }, { type: 'Fees', id: 'SUMMARY' }],
    }),

    runBilling: builder.mutation<ApiObject<{ created: number; skipped: number; structures: number }>, { month: number; year: number }>({
      query: (body) => ({ url: '/fees/invoices/run-billing', method: 'POST', body }),
      invalidatesTags: [{ type: 'Fees', id: 'INVOICES' }, { type: 'Fees', id: 'SUMMARY' }],
    }),

    getInvoiceDetail: builder.query<ApiObject<InvoiceDetail>, string>({
      query: (id) => `/fees/invoices/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Fees', id: `INVOICE-${id}` }],
    }),
    adjustInvoice: builder.mutation<ApiObject<unknown>, AdjustBody>({
      query: ({ invoiceId, ...body }) => ({ url: `/fees/invoices/${invoiceId}/adjust`, method: 'POST', body }),
      invalidatesTags: (_r, _e, { invoiceId }) => [
        { type: 'Fees', id: 'INVOICES' },
        { type: 'Fees', id: 'SUMMARY' },
        { type: 'Fees', id: `INVOICE-${invoiceId}` },
      ],
    }),

    recordPayment: builder.mutation<ApiObject<unknown>, PaymentBody>({
      query: (body) => ({ url: '/fees/payments', method: 'POST', body }),
      invalidatesTags: (_r, _e, { invoiceId }) => [
        { type: 'Fees', id: 'INVOICES' },
        { type: 'Fees', id: 'SUMMARY' },
        { type: 'Fees', id: `INVOICE-${invoiceId}` },
      ],
    }),

    getFeesSummary: builder.query<ApiObject<FeesSummary>, void>({
      query: () => '/fees/summary',
      providesTags: [{ type: 'Fees', id: 'SUMMARY' }],
    }),
  }),
});

export const {
  useGetFeeStructuresQuery,
  useCreateFeeStructureMutation,
  useGetInvoicesQuery,
  useGenerateInvoicesMutation,
  useRunBillingMutation,
  useGetInvoiceDetailQuery,
  useAdjustInvoiceMutation,
  useRecordPaymentMutation,
  useGetFeesSummaryQuery,
} = feesApi;
