import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import socket from '~/socket';
import { createOrder } from '~/store/orderSlice';
import { clearCart } from '~/store/cartSlice';
import { useSlug } from '~/contexts/SlugContext';
import MessageBubble from '~/components/MessageBubble';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';

const cx = classNames.bind(styles);

function Message() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { tableName } = useParams();
    const { slug } = useSlug();

    const { orderData, tableData } = location.state || {};
    const roomName = tableData ? `room_table_${tableData._id}` : '';

    // Khởi tạo messages từ localStorage
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem(`messages_${roomName}`);
        return savedMessages ? JSON.parse(savedMessages) : [];
    });

    useEffect(() => {
        if (!tableData) return;

        socket.connect();

        socket.on('connect', () => {
            console.log('✅ Socket connected');
            socket.emit('join_room', { room: roomName });
            console.log(`✅ Joined room: ${roomName}`);
        });

        socket.on('customer_notification', (data) => {
            console.log('🔥 [customer_notification]:', data);
            setMessages((prev) => {
                const updatedMessages = [...prev, data];
                // Lưu messages vào localStorage
                localStorage.setItem(`messages_${roomName}`, JSON.stringify(updatedMessages));
                return updatedMessages;
            });
            console.log('Target:', data.target);
        });

        const callOrderApi = async () => {
            try {
                if (orderData) {
                    const res = await dispatch(createOrder(orderData)).unwrap();
                    console.log('✅ Order created:', res);
                    console.log('✅ Success:', res.success);
                    if (res.success === true) {
                        dispatch(clearCart());
                        console.log('Đã xoá');
                        // Xóa orderData khỏi state, giữ tableData
                        navigate(`/${slug}/status/${tableName}?encode=${tableData.encode}`, {
                            state: { tableData }, // Không cần orderData: null
                            replace: true, // Thay thế history entry
                        });
                    }
                }
            } catch (err) {
                console.error('❌ Order failed:', err);
            }
        };

        callOrderApi();

        return () => {
            socket.emit('leave_room', { room: roomName });
            socket.off('customer_notification');
            socket.off('connect');
        };
    }, [tableName, dispatch, navigate, orderData, tableData, roomName, slug]);

    return (
        <div className={cx('wrapper')}>
            {messages.map((msg, index) => (
                <MessageBubble
                    key={index}
                    type={msg.type}
                    message={msg.message}
                    orderData={msg.data}
                />
            ))}
        </div>
    );
}

export default Message;