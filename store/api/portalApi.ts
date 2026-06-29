import { baseApi } from './baseApi';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface AttendanceData {
  rate: number;
  total: number;
  records: { date: string; status: AttendanceStatus }[];
}

export interface ResultItem {
  examTitle: string;
  type: string;
  totalObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  isPassed: boolean;
  marks: { name: string; obtained: number; total: number }[];
}

export interface FeeItem {
  id: string;
  structureName: string | null;
  dueDate: string;
  netAmount: number;
  paid: number;
  balance: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
}

export interface ChildSummary {
  id: string;
  name: string;
  rollNumber: string;
  className: string | null;
  attendanceRate: number;
  feesDue: number;
}

export interface TeacherClass {
  id: string;
  name: string;
  academicYear: string;
  sections: { id: string; name: string; students: number }[];
}

export interface CoreSubject {
  id: string;
  name: string;
  code: string | null;
  teacherName: string | null;
}
export interface ElectiveSubject extends CoreSubject {
  status: 'none' | 'pending' | 'enrolled' | 'rejected' | 'dropped';
}
export interface StudentSubjects {
  core: CoreSubject[];
  electives: ElectiveSubject[];
}

interface ApiObject<T> { success: boolean; data: T; message: string }

export const portalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Student
    myAttendance: builder.query<ApiObject<AttendanceData>, void>({ query: () => '/me/student/attendance' }),
    myResults: builder.query<ApiObject<ResultItem[]>, void>({ query: () => '/me/student/results' }),
    myFees: builder.query<ApiObject<FeeItem[]>, void>({
      query: () => '/me/student/fees',
      providesTags: [{ type: 'Fees', id: 'MINE' }],
    }),
    mySubjects: builder.query<ApiObject<StudentSubjects>, void>({
      query: () => '/me/student/subjects',
      providesTags: [{ type: 'Subjects', id: 'MINE' }],
    }),
    joinSubject: builder.mutation<ApiObject<unknown>, string>({
      query: (id) => ({ url: `/me/student/subjects/${id}/join`, method: 'POST' }),
      invalidatesTags: [{ type: 'Subjects', id: 'MINE' }],
    }),
    leaveSubject: builder.mutation<ApiObject<unknown>, string>({
      query: (id) => ({ url: `/me/student/subjects/${id}/leave`, method: 'POST' }),
      invalidatesTags: [{ type: 'Subjects', id: 'MINE' }],
    }),
    // Parent
    myChildren: builder.query<ApiObject<ChildSummary[]>, void>({ query: () => '/me/children' }),
    childAttendance: builder.query<ApiObject<AttendanceData>, string>({ query: (id) => `/me/children/${id}/attendance` }),
    childResults: builder.query<ApiObject<ResultItem[]>, string>({ query: (id) => `/me/children/${id}/results` }),
    childFees: builder.query<ApiObject<FeeItem[]>, string>({ query: (id) => `/me/children/${id}/fees` }),
    // Teacher
    myClasses: builder.query<ApiObject<TeacherClass[]>, void>({ query: () => '/me/teacher/classes' }),
  }),
});

export const {
  useMyAttendanceQuery,
  useMyResultsQuery,
  useMyFeesQuery,
  useMySubjectsQuery,
  useJoinSubjectMutation,
  useLeaveSubjectMutation,
  useMyChildrenQuery,
  useChildAttendanceQuery,
  useChildResultsQuery,
  useChildFeesQuery,
  useMyClassesQuery,
} = portalApi;
