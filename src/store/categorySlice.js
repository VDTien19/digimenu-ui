import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as httpRequest from '~/utils/httpRequest';
import { addCategory as createCate, getCategories, updateCategory as upCategory, deleteCategory as delCategory } from '~/api/categoryApi';

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async () => {
        const res = await getCategories();
        return res.data;
    }
);

export const addCategory = createAsyncThunk(
    'category/addCategory',
    async (newCategory) => {
        const res = await createCate(newCategory);
        return res.data; // Giả sử API trả về đối tượng category đã thêm
    }
);

export const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async ({ id, data }) => {
        const res = await upCategory(id, data);
        return res.data; // Giả sử API trả về đối tượng category đã cập nhật
    }
);

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (id) => {
        await delCategory(id); // Giả sử delCategory không trả dữ liệu, chỉ xóa
        return id; // Trả về id để cập nhật state
    }
);

// ----- Slice -----
const categorySlice = createSlice({
    name: 'category',
    initialState: {
        list: [],
        loading: false,
        error: null,
        filters: {
            name: '',
            type: ''
        },
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { name: '', type: '' };
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // add
            .addCase(addCategory.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            // update
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.list.findIndex(item => item._id === action.payload._id);
                if (index > -1) {
                    state.list[index] = action.payload;
                }
            })
            // delete
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.list = state.list.filter(item => item._id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.error = action.error.message;
            });
    }
});

export const { setFilters, clearFilters } = categorySlice.actions;
export default categorySlice.reducer;