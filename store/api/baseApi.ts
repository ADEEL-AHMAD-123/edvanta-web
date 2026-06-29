import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { updateAccessToken, logout } from '../slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  credentials: 'include', // sends httpOnly refresh token cookie
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// ─── Auto-refresh on 401 ──────────────────────────────────────────────────────
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      // Try to refresh
      const refreshResult = await baseQuery(
        { url: '/auth/refresh', method: 'POST' },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const data = refreshResult.data as any;
        api.dispatch(updateAccessToken(data.data.accessToken));
        // Retry original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed — logout
        api.dispatch(logout());
      }
    }

    return result;
  };

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'Students',
    'Classes',
    'Attendance',
    'Fees',
    'Exams',
    'Results',
    'Notices',
    'Users',
    'Institutions',
    'Subjects',
    'Messaging',
    'Billing',
  ],
  endpoints: () => ({}),
});
