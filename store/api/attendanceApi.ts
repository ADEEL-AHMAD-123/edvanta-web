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

    markAttendance: builder.mutation<ApiObject<unknown>, MarkBody>({
      query: (body) => ({ url: '/attendance', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Attendance', id: 'ROSTER' },
        { type: 'Attendance', id: 'SUMMARY' },
      ],
    }),
  }),
});

export const {
  useGetRosterQuery,
  useGetAttendanceSummaryQuery,
  useMarkAttendanceMutation,
} = attendanceApi;
