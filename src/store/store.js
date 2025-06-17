import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import categoryReducer from './categorySlice';
import menuItemReducer from './menuItemSlice';
import tableReducer from './tableSlice';
import dashboardReducer from './dashboardSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        category: categoryReducer,
        menuItem: menuItemReducer,
        table: tableReducer,
        dashboard: dashboardReducer,
        order: orderReducer,
    },
    // Không cần middleware RTK Query nếu không dùng createApi
    // devTools: process.env.NODE_ENV !== 'production',
});
