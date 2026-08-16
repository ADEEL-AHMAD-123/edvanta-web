import { baseApi } from './baseApi';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface RosterStudent {
  studentId: string;
  name: string;
  rollNumber: string;
  status: AttendanceStatus;
  note: string;
}

export interface RosterResponse {
  date: string;
  classId: string;
  sectionId: string;
  alreadyMarked: boolean;
  submittedAt: string | null;
  total: number;
  students: RosterStudent[];
}

export interface AttendanceSummary {
  date: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
  total: number;
  presentRate: number;
}

interface ApiObject<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface AttendanceCoverageSection {
  sectionId: string;
  sectionName: string;
  studentsCount: number;
  marked: boolean;
  present: number;
  absent: number;
  late: number;
  leave: number;
}

export interface AttendanceCoverageClass {
  classId: string;
  className: string;
  sections: AttendanceCoverageSection[];
}

export interface AttendanceCoverage {
  date: string;
  totalClasses: number;
  totalSections: number;
  markedSections: number;
  unmarkedSections: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  presentRate: number;
  classes: AttendanceCoverageClass[];
}

export interface MarkBody {
  classId: string;
  sectionId: string;
  date: string;
  records: { studentId: string; status: AttendanceStatus; note?: string }[];
}

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoster: builder.query<ApiObject<RosterResponse>, { classId: string; sectionId: string; date: string }>({
      query: ({ classId, sectionId, date }) =>
        `/attendance?classId=${classId}&sectionId=${sectionId}&date=${date}`,
      providesTags: [{ type: 'Attendance', id: 'ROSTER' }],
    }),

    getAttendanceSummary: builder.query<ApiObject<AttendanceSummary>, { date?: string } | void>({
      query: (params) => `/attendance/summary${params?.date ? `?date=${params.date}` : ''}`,
      providesTags: [{ type: 'Attendance', id: 'SUMMARY' }],
    }),

    getAttendanceCoverageToday: builder.query<ApiObject<AttendanceCoverage>, { date?: string } | void>({
      query: (params) => `/attendance/coverage-today${params?.date ? `?date=${params.date}` : ''}`,
      providesTags: [{ type: 'Attendance', id: 'COVERAGE' }],
    }),

    markAttendance: builder.mutation<ApiObject<unknown>, MarkBody>({
      query: (body) => ({ url: '/attendance', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Attendance', id: 'ROSTER' },
        { type: 'Attendance', id: 'SUMMARY' },
        { type: 'Attendance', id: 'COVERAGE' },
      ],
    }),
  }),
});

export const {
  useGetRosterQuery,
  useGetAttendanceSummaryQuery,
  useGetAttendanceCoverageTodayQuery,
  useMarkAttendanceMutation,
} = attendanceApi;
