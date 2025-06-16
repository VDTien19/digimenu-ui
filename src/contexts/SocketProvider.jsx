import { createContext, useEffect, useState } from 'react';
import socket from '~/socket';
import { toast } from 'react-toastify';
import { getTableById } from '~/api/tableApi'; // Giả định API lấy thông tin bàn

export const SocketContext = createContext();

export function SocketProvider({ children }) {
    const [orderPending, setOrderPending] = useState([]);

    useEffect(() => {
        const handleNewOrder = async (orderData) => {
            console.log('🆕 [new_order]:', orderData);

            // Lấy thông tin bàn nếu table_id là ID
            let tableInfo = orderData?.data.table_id._id;
            if (typeof orderData.table_id === 'string') {
                try {
                    const response = await getTableById(orderData.table_id);
                    tableInfo = response.data; // Giả định: { _id: "123", name: "Bàn 1" }
                } catch (error) {
                    console.error('Lỗi lấy thông tin bàn:', error);
                    tableInfo = { _id: orderData.table_id, name: '-' };
                }
            }

            const normalizedOrder = {
                ...orderData,
                status: orderData.status || 'Đang chờ',
                createdAt: orderData.createdAt && !isNaN(new Date(orderData.createdAt).getTime())
                    ? orderData.createdAt
                    : new Date().toISOString(),
                table_id: tableInfo, // Đảm bảo table_id là object
            };

            // Trì hoãn setState để tránh lỗi render
            setTimeout(() => {
                setOrderPending((prev = []) => {
                    const updatedOrders = [normalizedOrder, ...prev];
                    console.log('✅ Cập nhật danh sách đơn:', updatedOrders);
                    toast.success(`Đơn hàng mới: Bàn ${normalizedOrder?.data.table_id.name || '-'}`);
                    return updatedOrders;
                });
            }, 0);
        };

        socket.on('new_order', handleNewOrder);

        return () => {
            console.log('🧹 Dọn dẹp socket listeners toàn cục');
            socket.off('new_order', handleNewOrder);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ orderPending, setOrderPending }}>
            {children}
        </SocketContext.Provider>
    );
}