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
      // Bare (id-less) tags act as a wildcard subscription — this refetches
      // whenever ANY mutation invalidates a tag of these types (attendance
      // marked, a fee recorded, exam results saved, a student added, etc.),
      // regardless of the specific id each mutation invalidates. Previously
      // this had no tags at all, so the dashboard never refreshed on its own.
      providesTags: ['Students', 'Attendance', 'Fees', 'Exams', 'Results'],
    }),
  }),
});

export const { useGetReportsQuery } = reportsApi;
