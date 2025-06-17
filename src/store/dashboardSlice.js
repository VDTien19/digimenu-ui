import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getAllRevenue,
    getRevenue,
    getRevenueByDay,
    getRevenueByMonth,
    getPopularItem,
} from '~/api/adminApi';

// Thunk - Tổng doanh thu (không có from/to)
export const fetchAllRevenue = createAsyncThunk(
    'dashboard/fetchAllRevenue',
    async (_, { rejectWithValue }) => {
        try {
            return await getAllRevenue();
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Thunk - Doanh thu theo khoảng ngày
export const fetchRevenue = createAsyncThunk(
    'dashboard/fetchRevenue',
    async ({ from, to }, { rejectWithValue }) => {
        try {
            return await getRevenue(from, to);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Thunk - Doanh thu theo ngày
export const fetchRevenueByDay = createAsyncThunk(
    'dashboard/fetchRevenueByDay',
    async ({ from, to }, { rejectWithValue }) => {
        try {
            return await getRevenueByDay(from, to);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Thunk - Doanh thu theo tháng
export const fetchRevenueByMonth = createAsyncThunk(
    'dashboard/fetchRevenueByMonth',
    async (_, { rejectWithValue }) => {
        try {
            return await getRevenueByMonth();
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Thunk - Món ăn phổ biến
export const fetchPopularItems = createAsyncThunk(
    'dashboard/fetchPopularItems',
    async (limit = 5, { rejectWithValue }) => {
        try {
            return await getPopularItem(limit);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Initial State
const initialState = {
    allRevenue: null,
    revenueByRange: null,
    revenueByDay: [],
    revenueByMonth: [],
    popularItems: [],
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ALL REVENUE
            .addCase(fetchAllRevenue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllRevenue.fulfilled, (state, action) => {
                state.loading = false;
                state.allRevenue = action.payload;
            })
            .addCase(fetchAllRevenue.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // REVENUE BY RANGE
            .addCase(fetchRevenue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRevenue.fulfilled, (state, action) => {
                state.loading = false;
                state.revenueByRange = action.payload;
            })
            .addCase(fetchRevenue.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // REVENUE BY DAY
            .addCase(fetchRevenueByDay.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRevenueByDay.fulfilled, (state, action) => {
                state.loading = false;
                state.revenueByDay = action.payload;
            })
            .addCase(fetchRevenueByDay.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // REVENUE BY MONTH
            .addCase(fetchRevenueByMonth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRevenueByMonth.fulfilled, (state, action) => {
                state.loading = false;
                state.revenueByMonth = action.payload;
            })
            .addCase(fetchRevenueByMonth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // POPULAR ITEMS
            .addCase(fetchPopularItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPopularItems.fulfilled, (state, action) => {
                state.loading = false;
                state.popularItems = action.payload;
            })
            .addCase(fetchPopularItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;
