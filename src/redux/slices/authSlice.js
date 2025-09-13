import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get user info from localStorage if it exists
const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

const initialState = {
    userInfo: userInfoFromStorage,
    loading: false,
    error: null,
    success: false, // For tracking successful operations like profile update
};

// --- Async Thunks ---

// Login User
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/v1/auth/login', { email, password }, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// Register User
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/v1/auth/register', userData, config);
            // Optionally log the user in directly after registration
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// Request Password Reset (Forgot Password)
export const requestPasswordReset = createAsyncThunk(
    'auth/requestPasswordReset',
    async (email, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/v1/auth/forgotpassword', { email }, config);
            return data.message; // Success message
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            await axios.post('/api/v1/auth/verifyotp', { email, otp }, config);
            return true; // Return success status
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// Reset Password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, otp, password }, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.put('/api/v1/auth/resetpassword', { email, otp, password }, config);
            return data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// Update User Profile
export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (userData, { getState, rejectWithValue }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.put('/api/v1/auth/updatedetails', userData, config);
            // Update local storage with new user info
            const updatedUserInfo = { ...userInfo, data: data.data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            return updatedUserInfo;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);


// Logout User
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('userInfo');
});


// --- Slice Definition ---
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(login.fulfilled, (state, { payload }) => { state.loading = false; state.userInfo = payload; })
            .addCase(login.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
            // Register
            .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(register.fulfilled, (state, { payload }) => { state.loading = false; state.userInfo = payload; })
            .addCase(register.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
            // Forgot Password
            .addCase(requestPasswordReset.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(requestPasswordReset.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(requestPasswordReset.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
            // Verify OTP
            .addCase(verifyOtp.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(verifyOtp.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(verifyOtp.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
            // Reset Password
            .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(resetPassword.fulfilled, (state, { payload }) => { state.loading = false; state.userInfo = payload; })
            .addCase(resetPassword.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
            // Update Profile
            .addCase(updateUserProfile.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(updateUserProfile.fulfilled, (state, { payload }) => { state.loading = false; state.userInfo = payload; state.success = true; })
            .addCase(updateUserProfile.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
            // Logout
            .addCase(logout.fulfilled, (state) => { state.userInfo = null; });
    },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;

