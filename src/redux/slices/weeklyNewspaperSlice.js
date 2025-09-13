import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunks ---

export const getWeeklyNewspapers = createAsyncThunk('weeklyNewspaper/getAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/newspapers');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getWeeklyNewspaperById = createAsyncThunk('weeklyNewspaper/getById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/v1/newspapers/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createWeeklyNewspaper = createAsyncThunk('weeklyNewspaper/create', async (newspaperData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post('/api/v1/newspapers', newspaperData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateWeeklyNewspaper = createAsyncThunk('weeklyNewspaper/update', async ({ id, newspaperData }, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.put(`/api/v1/newspapers/${id}`, newspaperData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteWeeklyNewspaper = createAsyncThunk('weeklyNewspaper/delete', async (id, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/v1/newspapers/${id}`, config);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// --- Slice Definition ---

const weeklyNewspaperSlice = createSlice({
    name: 'weeklyNewspaper',
    initialState: {
        newspapers: [],
        newspaper: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetNewspaperState: (state) => {
            state.newspaper = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
    builder
        // Specific fulfilled handlers FIRST
        .addCase(getWeeklyNewspapers.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.newspapers = payload.data;
        })
        .addCase(getWeeklyNewspaperById.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.newspaper = payload.data;
        })
        .addCase(createWeeklyNewspaper.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(updateWeeklyNewspaper.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(deleteWeeklyNewspaper.fulfilled, (state, { payload: id }) => {
            state.loading = false;
            state.success = true;
            state.newspapers = state.newspapers.filter((n) => n._id !== id);
        })

        // --- Generic Pending/Rejected last ---
        .addMatcher(
            (action) =>
                action.type.startsWith('weeklyNewspaper/') &&
                action.type.endsWith('/pending'),
            (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            }
        )
        .addMatcher(
            (action) =>
                action.type.startsWith('weeklyNewspaper/') &&
                action.type.endsWith('/rejected'),
            (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
        );
}

});

export const { resetNewspaperState } = weeklyNewspaperSlice.actions;
export default weeklyNewspaperSlice.reducer;