import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunks ---

export const getNotificationContent = createAsyncThunk('notification/getContent', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/v1/notifications/content', config);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const sendNotification = createAsyncThunk('notification/send', async (notificationData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post('/api/v1/notifications/send', notificationData, config);
        return data.message;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});


// --- Slice Definition ---
const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        content: { jobAds: [], notices: [], results: [], solutions: [] },
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        resetNotificationState: (state) => {
            state.loading = false;
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotificationContent.pending, (state) => {
                state.loading = true;
            })
            .addCase(getNotificationContent.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.content = payload;
            })
            .addCase(getNotificationContent.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(sendNotification.pending, (state) => {
                state.loading = true;
                state.successMessage = null;
                state.error = null;
            })
            .addCase(sendNotification.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.successMessage = payload;
            })
            .addCase(sendNotification.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    }
});

export const { resetNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
