import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunks ---

export const getJobAds = createAsyncThunk('jobAd/getJobAds', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/jobs');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getJobAdById = createAsyncThunk('jobAd/getJobAdById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/v1/jobs/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createJobAd = createAsyncThunk('jobAd/createJobAd', async (jobAdData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post('/api/v1/jobs', jobAdData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateJobAd = createAsyncThunk('jobAd/updateJobAd', async ({ id, jobAdData }, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.put(`/api/v1/jobs/${id}`, jobAdData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteJobAd = createAsyncThunk('jobAd/deleteJobAd', async (id, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/v1/jobs/${id}`, config);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// --- Slice Definition ---

const jobAdSlice = createSlice({
    name: 'jobAd',
    initialState: {
        jobAds: [],
        jobAd: null, // For a single job ad
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetJobAdState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.jobAd = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Specific fulfilled handlers
            .addCase(getJobAds.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.jobAds = payload.data;
            })
            .addCase(getJobAdById.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.jobAd = payload.data;
            })
            .addCase(createJobAd.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.jobAds.push(payload.data);
            })
            .addCase(updateJobAd.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.jobAd = payload.data; // Also update single ad view
                const index = state.jobAds.findIndex(ad => ad._id === payload.data._id);
                if (index !== -1) state.jobAds[index] = payload.data;
            })
            .addCase(deleteJobAd.fulfilled, (state, { payload: id }) => {
                state.loading = false;
                state.success = true;
                state.jobAds = state.jobAds.filter(ad => ad._id !== id);
            })
            // Generic Pending/Rejected handlers
            .addMatcher(
                (action) => action.type.startsWith('jobAd/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.success = false;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('jobAd/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

export const { resetJobAdState } = jobAdSlice.actions;
export default jobAdSlice.reducer;