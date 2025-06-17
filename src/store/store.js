import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import categoryReducer from './categorySlice';
import menuItemReducer from './menuItemSlice';
import tableReducer from './tableSlice';
import { dashboardApi } from './dashboardSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        category: categoryReducer,
        menuItem: menuItemReducer,
        table: tableReducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        order: orderReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(dashboardApi.middleware),
    // devTools: process.env.NODE_ENV !== 'production',
});
