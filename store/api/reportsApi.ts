import { baseApi } from './baseApi';

export interface ReportsData {
  overview: {
    activeStudents: number;
    classes: number;
    collectedThisMonth: number;
    avgAttendance: number;
    passRate: number;
  };
  attendanceTrend: { label: string; rate: number }[];
  feeCollection: { label: string; amount: number }[];
  studentsByClass: { name: string; value: number }[];
  gradeDistribution: { name: string; value: number }[];
}

interface ApiObject<T> { success: boolean; data: T; message: string }

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<ApiObject<ReportsData>, void>({
      query: () => '/reports/dashboard',
    }),
  }),
});

export const { useGetReportsQuery } = reportsApi;
