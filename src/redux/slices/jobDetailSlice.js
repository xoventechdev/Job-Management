// jobDetailSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunks ---

export const getJobDetailsForAd = createAsyncThunk('jobDetail/getJobDetailsForAd', async (adId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/v1/jobdetails/for-ad/${adId}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getJobDetailById = createAsyncThunk('jobDetail/getJobDetailById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/v1/jobdetails/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createJobDetail = createAsyncThunk('jobDetail/createJobDetail', async (detailData, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.post('/api/v1/jobdetails', detailData, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateJobDetail = createAsyncThunk('jobDetail/updateJobDetail', async ({ id, detailData }, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.put(`/api/v1/jobdetails/${id}`, detailData, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteJobDetail = createAsyncThunk('jobDetail/deleteJobDetail', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    await axios.delete(`/api/v1/jobdetails/${id}`, config);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// --- Slice Definition ---

// jobDetailSlice.js
const jobDetailSlice = createSlice({
  name: 'jobDetail',
  initialState: {
    jobDetails: [],
    jobDetail: null,        // <-- add this
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetJobDetailState: (state) => {
      state.jobDetails = [];
      state.jobDetail = null;     // <-- reset this too
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobDetailById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.jobDetail = payload.data; // <-- store the single detail
      })
      .addCase(getJobDetailsForAd.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.jobDetails = payload.data;
      })
      .addCase(createJobDetail.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.jobDetails.push(payload.data);
      })
      .addCase(updateJobDetail.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        const idx = state.jobDetails.findIndex(d => d._id === payload.data._id);
        if (idx !== -1) state.jobDetails[idx] = payload.data;
        // keep jobDetail in sync too (handy when returning to the page)
        state.jobDetail = payload.data;
      })
      .addCase(deleteJobDetail.fulfilled, (state, { payload: id }) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.jobDetails = state.jobDetails.filter(d => d._id !== id);
        if (state.jobDetail && state.jobDetail._id === id) state.jobDetail = null;
      })
      // Generic Pending/Rejected
      .addMatcher(
        (action) => action.type.startsWith('jobDetail/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
          // don't force success=false on reads if you don't want to interrupt post-create redirect logic,
          // but it's okay to keep it:
          state.success = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('jobDetail/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});


export const { resetJobDetailState } = jobDetailSlice.actions;
export default jobDetailSlice.reducer;
