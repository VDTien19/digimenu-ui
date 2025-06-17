import { createContext, useEffect, useState } from 'react';
import socket from '~/socket';
import { toast } from 'react-toastify';
import { getTableById } from '~/api/tableApi';

export const SocketContext = createContext();

export function SocketProvider({ children }) {
    const [orderPending, setOrderPending] = useState([]);

    useEffect(() => {
        const handleNewOrder = async (orderData) => {
            console.log('🆕 [new_order]:', orderData);

            // Lấy thông tin bàn từ data.table_id
            let tableInfo = orderData.data?.table_id;
            if (typeof orderData.data?.table_id === 'string') {
                try {
                    const response = await getTableById(orderData.data.table_id);
                    tableInfo = response.data;
                } catch (error) {
                    console.error('Lỗi lấy thông tin bàn:', error);
                    tableInfo = { _id: orderData.data.table_id, name: '-' };
                }
            }

            // Chuẩn hóa dữ liệu socket để đồng bộ với API
            const normalizedOrder = {
                _id: orderData.data?._id, // Lấy _id từ data
                status: orderData.data?.status || 'Đang chờ',
                createdAt: orderData.data?.createdAt || orderData.timestamp || new Date().toISOString(),
                table_id: tableInfo,
                items: orderData.data?.items || [],
                notes: orderData.data?.notes || '',
                order_group_id: orderData.data?.order_group_id,
                restaurant_id: orderData.data?.restaurant_id,
                total_cost: orderData.data?.total_cost,
                updatedAt: orderData.data?.updatedAt,
                __v: orderData.data?.__v,
                // Giữ data gốc để debug hoặc backward compatibility
                data: orderData.data,
            };

            setTimeout(() => {
                setOrderPending((prev = []) => {
                    const updatedOrders = [normalizedOrder, ...prev.filter(order => order._id !== normalizedOrder._id)];
                    // console.log('✅ Cập nhật danh sách đơn:', updatedOrders);
                    if (window.location.pathname.includes('service')) {
                        toast.success(`Đơn hàng mới: Bàn ${normalizedOrder.table_id?.name || '-'}`);
                    }
                    return updatedOrders;
                });
            }, 0);
        };

        socket.on('new_order', handleNewOrder);

        return () => {
            // console.log('🧹 Dọn dẹp socket listeners toàn cục');
            socket.off('new_order', handleNewOrder);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ orderPending, setOrderPending }}>
            {children}
        </SocketContext.Provider>
    );
}