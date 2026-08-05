import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  roles?: string[];
  phone: string;
  email?: string;
  profilePhoto?: string;
  institutionId?: string;
  mustChangePassword?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: AuthUser; accessToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      // Store access token in memory only — never localStorage
    },
    updateAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, updateAccessToken, updateUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
