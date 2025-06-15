import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    addOrder,
    getOrders,
    getOrdersPending,
    approveOrder,
} from '~/api/orderApi';

// Thêm đơn mới
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const res = await addOrder(orderData);
            return res;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to create order');
        }
    },
);

// Lấy danh sách đơn đang chờ duyệt
export const fetchPendingOrders = createAsyncThunk(
    'order/fetchPendingOrders',
    async (_, { rejectWithValue }) => {
        try {
            const res = await getOrdersPending();
            return res;
        } catch (err) {
            return rejectWithValue(
                err.message || 'Failed to fetch pending orders',
            );
        }
    },
);

// Lấy tất cả đơn
export const fetchAllOrders = createAsyncThunk(
    'order/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const res = await getOrders();
            return res;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch orders');
        }
    },
);

// Duyệt đơn
export const approveOrderById = createAsyncThunk(
    'order/approveOrderById',
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await approveOrder(orderId);
            return res;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to approve order');
        }
    },
);

// Initial state
const initialState = {
    orders: [],
    pendingOrders: [],
    loading: false,
    error: null,
    success: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrderStatus: (state) => {
            state.success = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Order created successfully.';
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Pending Orders
            .addCase(fetchPendingOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPendingOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingOrders = action.payload;
            })
            .addCase(fetchPendingOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch All Orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Approve Order
            .addCase(approveOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Order approved successfully.';
                // Remove approved order from pendingOrders
                state.pendingOrders = state.pendingOrders.filter(
                    (order) => order.id !== action.meta.arg,
                );
            })
            .addCase(approveOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
