import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
    addMenuItem, 
    getMenuItems,
    updateMenuItem, 
    deleteMenuItem 
} from '~/api/menuItemApi'; // Import từ file menuItemApi

export const fetchMenuItems = createAsyncThunk(
    'menuItem/fetchMenuItems', 
    async () => {
        const res = await getMenuItems();
        return res.data; // Giả sử API trả về { data: [...] }
    }
);

export const addMenuItemAsync = createAsyncThunk(
    'menuItem/addMenuItem',
    async (newMenuItem) => {
        const res = await addMenuItem(newMenuItem);
        return res.data; // Giả sử API trả về { data: {...} }
    }
);

export const updateMenuItemAsync = createAsyncThunk(
    'menuItem/updateMenuItem',
    async ({ id, data }) => {
        const res = await updateMenuItem(id, data);
        return res.data; // Giả sử API trả về { data: {...} }
    }
);

export const deleteMenuItemAsync = createAsyncThunk(
    'menuItem/deleteMenuItem',
    async (id) => {
        await deleteMenuItem(id);
        return id; // Trả về id để lọc state
    }
);

// ----- Slice -----
const menuItemSlice = createSlice({
    name: 'menuItem',
    initialState: {
        list: [], // Đổi từ listProducts thành list để rõ ràng hơn
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMenuItems.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchMenuItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // add
            .addCase(addMenuItemAsync.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            // update
            .addCase(updateMenuItemAsync.fulfilled, (state, action) => {
                const index = state.list.findIndex((item) => item._id === action.payload._id); // Sử dụng _id thay vì id
                if (index > -1) {
                    state.list[index] = action.payload;
                }
            })
            // delete
            .addCase(deleteMenuItemAsync.fulfilled, (state, action) => {
                state.list = state.list.filter(item => item._id !== action.payload);
            })
            .addCase(deleteMenuItemAsync.rejected, (state, action) => {
                state.error = action.error.message;
            });
    }
});

export default menuItemSlice.reducer;