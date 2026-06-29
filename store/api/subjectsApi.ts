import { baseApi } from './baseApi';

export interface Subject {
  id: string;
  name: string;
  code: string | null;
  className: string | null;
  classId: string | null;
  teacherName: string | null;
  teacherId: string | null;
  isElective: boolean;
  isActive: boolean;
}

interface ApiArray<T> { success: boolean; data: T[]; message: string }
interface ApiObject<T> { success: boolean; data: T; message: string }

export interface CreateSubjectBody {
  name: string;
  code?: string;
  classId?: string;
  teacherId?: string;
  isElective?: boolean;
}

export interface EnrollmentRequest {
  id: string;
  studentName: string;
  rollNumber: string | null;
  subjectName: string | null;
  status: string;
  requestedAt: string;
}

export const subjectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<ApiArray<Subject>, void>({
      query: () => '/subjects',
      providesTags: [{ type: 'Subjects', id: 'LIST' }],
    }),
    createSubject: builder.mutation<ApiObject<{ id: string }>, CreateSubjectBody>({
      query: (body) => ({ url: '/subjects', method: 'POST', body }),
      invalidatesTags: [{ type: 'Subjects', id: 'LIST' }],
    }),
    deleteSubject: builder.mutation<ApiObject<{ id: string }>, string>({
      query: (id) => ({ url: `/subjects/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Subjects', id: 'LIST' }],
    }),
    getEnrollmentRequests: builder.query<ApiArray<EnrollmentRequest>, { status?: string } | void>({
      query: (params) => `/subjects/enrollments${params?.status ? `?status=${params.status}` : ''}`,
      providesTags: [{ type: 'Subjects', id: 'ENROLLMENTS' }],
    }),
    approveEnrollment: builder.mutation<ApiObject<unknown>, string>({
      query: (id) => ({ url: `/subjects/enrollments/${id}/approve`, method: 'POST' }),
      invalidatesTags: [{ type: 'Subjects', id: 'ENROLLMENTS' }],
    }),
    rejectEnrollment: builder.mutation<ApiObject<unknown>, string>({
      query: (id) => ({ url: `/subjects/enrollments/${id}/reject`, method: 'POST' }),
      invalidatesTags: [{ type: 'Subjects', id: 'ENROLLMENTS' }],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
  useGetEnrollmentRequestsQuery,
  useApproveEnrollmentMutation,
  useRejectEnrollmentMutation,
} = subjectsApi;
