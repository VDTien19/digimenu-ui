import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useLocation, useParams } from 'react-router-dom';
import socket from '~/socket';

import styles from './Message.module.scss';
import MessageBubble from '~/components/MessageBubble';
import { getTableByName } from '~/api/tableApi';

const cx = classNames.bind(styles);

function Message() {
    const location = useLocation();
    const isCustomer = location.pathname.includes('/status/');
    const { tableName } = useParams();

    const [messages, setMessages] = useState([]);
    const [tableId, setTableId] = useState(null);

    // useEffect(() => {
    //     // Gọi API để lấy tableId dựa trên tableName
    //     const fetchTableId = async () => {
    //         try {
    //             const tableData = await getTableByName(tableName);
    //             console.log('tableData: ', tableData.data._id);
    //             const { _id } = tableData.data;
    //             setTableId(_id);
    //             console.log(`Fetched tableId: ${_id}`);

    //             // Tham gia room khi có tableId
    //             const roomName = `room_table_${_id}`;
    //             socket.emit('join_room', { room: roomName });
    //             console.log(`Joined room: ${roomName}`);
    //         } catch (error) {
    //             console.error('Error fetching table info:', error.message);
    //         }
    //     };

    //     // Khởi tạo kết nối WebSocket
    //     socket.connect();

    //     // Gọi API khi component mount
    //     fetchTableId();

    //     // Lắng nghe sự kiện
    //     socket.on('connect', () => {
    //         console.log('Socket connected:', socket.id);
    //         if (tableId) {
    //             const roomName = `room_table_${tableId}`;
    //             socket.emit('join_room', { room: roomName });
    //         }
    //     });

    //     socket.on('connect_error', (error) => {
    //         console.log('Socket connect error:', error.message);
    //     });

    //     socket.on('customer_notification', (data) => {
    //         const { message, target, data: orderData, timestamp } = data;
    //         console.log('Received customer_notification:', data);
    //         if (target === 'customer' && orderData?.table_id?._id === tableId) {
    //             setMessages((prev) => [
    //                 ...prev,
    //                 { message, target, orderData, timestamp },
    //             ]);
    //         }
    //     });

    //     // Cleanup
    //     return () => {
    //         if (tableId) {
    //             const roomName = `room_table_${tableId}`;
    //             socket.emit('leave_room', { room: roomName });
    //         }
    //         socket.off('connect');
    //         socket.off('connect_error');
    //         socket.off('customer_notification');
    //         socket.disconnect();
    //     };
    // }, [tableName]);

    

    return (
        <div className={cx('wrapper')}>
            {messages.map((msg, index) => (
                <MessageBubble
                    key={index}
                    isCustomer={msg.target === 'customer'}
                    message={msg.message}
                    orderData={msg.orderData}
                />
            ))}
        </div>
    );
}

export default Message;
