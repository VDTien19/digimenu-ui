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

    // Lấy room name: từ tableData nếu có, nếu không thì lấy từ localStorage
    const initialRoomName = tableData
        ? `room_table_${tableData._id}`
        : localStorage.getItem('room_name') || '';

    const [roomName] = useState(initialRoomName);

    // Lấy messages từ localStorage
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem(`messages_${initialRoomName}`);
        return savedMessages ? JSON.parse(savedMessages) : [];
    });

    useEffect(() => {
        if (!roomName) return;

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
                localStorage.setItem(`messages_${roomName}`, JSON.stringify(updatedMessages));
                localStorage.setItem('room_name', roomName);
                return updatedMessages;
            });
        });

        if (orderData && tableData) {
            const callOrderApi = async () => {
                try {
                    const res = await dispatch(createOrder(orderData)).unwrap();
                    if (res.success === true) {
                        dispatch(clearCart());
                        navigate(`/${slug}/status/${tableName}?encode=${tableData.encode}`, {
                            state: { tableData },
                            replace: true,
                        });
                    }
                } catch (err) {
                    console.error('❌ Order failed:', err);
                }
            };
            callOrderApi();
        }

        return () => {
            socket.emit('leave_room', { room: roomName });
            socket.off('customer_notification');
            socket.off('connect');
        };
    }, [roomName, dispatch, navigate, orderData, tableData, tableName, slug]);

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
