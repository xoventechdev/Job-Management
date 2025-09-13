import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunks ---

// 1. Get all companies
export const getCompanies = createAsyncThunk(
    'company/getCompanies',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get('/api/v1/companies', config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// 2. Get a single company by ID
export const getCompanyDetails = createAsyncThunk(
    'company/getCompanyDetails',
    async (id, { getState, rejectWithValue }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get(`/api/v1/companies/${id}`, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// 3. Create a new company
export const createCompany = createAsyncThunk(
    'company/createCompany',
    async (companyData, { getState, rejectWithValue }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post('/api/v1/companies', companyData, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// 4. Update an existing company
export const updateCompany = createAsyncThunk(
    'company/updateCompany',
    async ({ id, companyData }, { getState, rejectWithValue }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.put(`/api/v1/companies/${id}`, companyData, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// 5. Delete a company
export const deleteCompany = createAsyncThunk(
    'company/deleteCompany',
    async (id, { getState, rejectWithValue }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.delete(`/api/v1/companies/${id}`, config);
            return id; // Return the id to remove from state
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// --- Slice Definition ---
const companySlice = createSlice({
    name: 'company',
    initialState: {
        companies: [],
        company: null, // For single company details
        loading: false,
        error: null,
        success: false, // For tracking success of operations like create/update
    },
    reducers: {
        resetCompanyState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.company = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Companies
            .addCase(getCompanies.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCompanies.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.companies = payload.data;
            })
            .addCase(getCompanies.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // Get Company Details
            .addCase(getCompanyDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCompanyDetails.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.company = payload.data;
            })
            .addCase(getCompanyDetails.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // Create Company
            .addCase(createCompany.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCompany.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.companies.push(payload.data);
            })
            .addCase(createCompany.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
             // Update Company
            .addCase(updateCompany.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCompany.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                const index = state.companies.findIndex(c => c._id === payload.data._id);
                if (index !== -1) {
                    state.companies[index] = payload.data;
                }
            })
            .addCase(updateCompany.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // Delete Company
            .addCase(deleteCompany.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCompany.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.companies = state.companies.filter(c => c._id !== payload);
            })
            .addCase(deleteCompany.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    },
});

export const { resetCompanyState } = companySlice.actions;

export default companySlice.reducer;
