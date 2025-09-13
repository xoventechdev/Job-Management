import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunks ---

export const getSolutions = createAsyncThunk('solution/getAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/solutions');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getSolutionById = createAsyncThunk('solution/getById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/v1/solutions/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createSolution = createAsyncThunk('solution/create', async (solutionData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post('/api/v1/solutions', solutionData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateSolution = createAsyncThunk('solution/update', async ({ id, solutionData }, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.put(`/api/v1/solutions/${id}`, solutionData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteSolution = createAsyncThunk('solution/delete', async (id, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/v1/solutions/${id}`, config);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// --- Slice Definition ---

const solutionSlice = createSlice({
    name: 'solution',
    initialState: {
        solutions: [],
        solution: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetSolutionState: (state) => {
            state.solution = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
    builder
        // ✅ all addCase first
        .addCase(getSolutions.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.solutions = payload.data;
        })
        .addCase(getSolutionById.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.solution = payload.data;
        })
        .addCase(createSolution.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(updateSolution.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(deleteSolution.fulfilled, (state, { payload: id }) => {
            state.loading = false;
            state.success = true;
            state.solutions = state.solutions.filter((s) => s._id !== id);
        })

        // ✅ generic matchers LAST
        .addMatcher(
            (action) =>
                action.type.startsWith('solution/') &&
                action.type.endsWith('/pending'),
            (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            }
        )
        .addMatcher(
            (action) =>
                action.type.startsWith('solution/') &&
                action.type.endsWith('/rejected'),
            (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
        );
},
});

export const { resetSolutionState } = solutionSlice.actions;
export default solutionSlice.reducer;
