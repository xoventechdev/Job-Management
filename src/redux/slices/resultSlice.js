import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunks ---

export const getResults = createAsyncThunk('result/getAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/results');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getResultById = createAsyncThunk('result/getById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/v1/results/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createResult = createAsyncThunk('result/create', async (resultData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post('/api/v1/results', resultData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateResult = createAsyncThunk('result/update', async ({ id, resultData }, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.put(`/api/v1/results/${id}`, resultData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteResult = createAsyncThunk('result/delete', async (id, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/v1/results/${id}`, config);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// --- Slice Definition ---

const resultSlice = createSlice({
    name: 'result',
    initialState: {
        results: [],
        result: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetResultState: (state) => {
            state.result = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
    builder
        // ✅ all addCase first
        .addCase(getResults.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.results = payload.data;
        })
        .addCase(getResultById.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.result = payload.data;
        })
        .addCase(createResult.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(updateResult.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(deleteResult.fulfilled, (state, { payload: id }) => {
            state.loading = false;
            state.success = true;
            state.results = state.results.filter((r) => r._id !== id);
        })

        // ✅ generic matchers LAST
        .addMatcher(
            (action) => action.type.startsWith('result/') && action.type.endsWith('/pending'),
            (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            }
        )
        .addMatcher(
            (action) => action.type.startsWith('result/') && action.type.endsWith('/rejected'),
            (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
        );
},
});

export const { resetResultState } = resultSlice.actions;
export default resultSlice.reducer;
