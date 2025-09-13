import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunks ---

export const getNotices = createAsyncThunk('notice/getAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/notices');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getNoticeById = createAsyncThunk('notice/getById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/v1/notices/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createNotice = createAsyncThunk('notice/create', async (noticeData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post('/api/v1/notices', noticeData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateNotice = createAsyncThunk('notice/update', async ({ id, noticeData }, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.put(`/api/v1/notices/${id}`, noticeData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteNotice = createAsyncThunk('notice/delete', async (id, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/v1/notices/${id}`, config);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// --- Slice Definition ---

const noticeSlice = createSlice({
    name: 'notice',
    initialState: {
        notices: [],
        notice: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetNoticeState: (state) => {
            state.notice = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
    builder
        // ✅ Specific fulfilled cases FIRST
        .addCase(getNotices.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.notices = payload.data;
        })
        .addCase(getNoticeById.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.notice = payload.data;
        })
        .addCase(createNotice.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(updateNotice.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(deleteNotice.fulfilled, (state, { payload: id }) => {
            state.loading = false;
            state.success = true;
            state.notices = state.notices.filter((n) => n._id !== id);
        })

        // ✅ Generic matchers LAST
        .addMatcher(
            (action) => action.type.startsWith('notice/') && action.type.endsWith('/pending'),
            (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            }
        )
        .addMatcher(
            (action) => action.type.startsWith('notice/') && action.type.endsWith('/rejected'),
            (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
        );
},
});

export const { resetNoticeState } = noticeSlice.actions;
export default noticeSlice.reducer;
