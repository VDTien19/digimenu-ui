import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTables, getTableByName, addTable as createTable, updateTable as updateTableById, deleteTable as deleteTableById } from '~/api/tableApi';

export const fetchTable = createAsyncThunk(
    'table/fetchTable',
    async () => {
        const res = await getTables();
        return res.data;
    }
)

export const addTable = createAsyncThunk(
    'table/addTable',
    async (newTable) => {
        const res = createTable(newTable);
        return res;
    }
);

export const updateTable = createAsyncThunk(
    'table/updateTable',
    async ({ id, data }) => {
        const res = updateTableById(id, data);
        return res;
    }
);

export const deleteTable = createAsyncThunk(
    'table/deleteTable',
    async (id) => {
        await deleteTableById(id);
        return id;
    }
);

export const fetchTableByName = createAsyncThunk(
    'table/fetchTableByName',
    async (name, { rejectWithValue }) => {
        try {
            const res = await getTableByName(name);
            return res;
        } catch (err) {
            return rejectWithValue(err.message || 'Không thể lấy bàn theo tên');
        }
    }
);

// ----- Slice -----
const tableSlice = createSlice({
    name: 'table',
    initialState: {
        listTables: [],
        currentTable: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTable.fulfilled, (state, action) => {
                state.loading = false;
                state.listTables = action.payload;
            })
            .addCase(fetchTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // add
            .addCase(addTable.fulfilled, (state, action) => {
                state.listTables.push(action.payload);
            })
            // update
            .addCase(updateTable.fulfilled, (state, action) => {
                const index = state.listTables.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.listTables[index] = action.payload;
                }
            })
            // delete
            .addCase(deleteTable.fulfilled, (state, action) => {
                const index = state.listTables.findIndex((item) => item._id === action.payload);
                if (index !== -1) {
                    state.listTables.splice(index, 1);
                }
            })
            // fetchTableByName
            .addCase(fetchTableByName.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTable = action.payload;
            })
    },
});

export default tableSlice.reducer;