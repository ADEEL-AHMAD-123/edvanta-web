import { baseApi } from './baseApi';

interface LoginRequest {
  phone: string;
  password: string;
  institutionId?: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      role: string;
      roles?: string[];
      phone: string;
      email?: string;
      profilePhoto?: string;
      institutionId?: string;
    };
  };
  message: string;
}

interface RegisterRequest {
  institutionName: string;
  institutionType: 'academy' | 'school' | 'college' | 'university';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  city?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    forgotPassword: builder.mutation<void, { phone: string }>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),
    resetPassword: builder.mutation<void, { phone: string; otp: string; newPassword: string }>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),
    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: '/auth/change-password', method: 'POST', body }),
    }),
    updateProfile: builder.mutation<
      { success: boolean; data: LoginResponse['data']['user']; message: string },
      { firstName?: string; lastName?: string; email?: string; phone?: string }
    >({
      query: (body) => ({ url: '/auth/profile', method: 'PATCH', body }),
    }),
    getMe: builder.query<any, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    switchRole: builder.mutation<LoginResponse, { role: string }>({
      query: (body) => ({ url: '/auth/switch-role', method: 'POST', body }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useGetMeQuery,
  useSwitchRoleMutation,
} = authApi;
