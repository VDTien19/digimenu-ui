import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // ✅
import socket from '~/socket';
import { createOrder } from '~/store/orderSlice';
import { clearCart } from '~/store/cartSlice';
import MessageBubble from '~/components/MessageBubble';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';

const cx = classNames.bind(styles);

function Message() {
    const dispatch = useDispatch(); // ✅
    const location = useLocation();
    const { tableName } = useParams();
    const [messages, setMessages] = useState([]);

    const { orderData, tableData } = location.state || {};
    const roomName = tableData ? `room_table_${tableData._id}` : '';

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
            setMessages((prev) => [...prev, data]);
            console.log(data.target)
        });

        // ✅ Gọi API order sau khi join room
        const callOrderApi = async () => {
            try {
                if (orderData) {
                    const res = await dispatch(createOrder(orderData)).unwrap();
                    console.log('✅ Order created:', res);
                    if(res) {
                        dispatch(clearCart());
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
    }, [tableName]);

    return (
        <div className={cx('wrapper')}>
            {/* {messages.map((msg, index) => (
                <MessageBubble
                    key={index}
                    isCustomer={msg.target === 'customer'}
                    message={msg.message}
                    orderData={msg.orderData}
                />
            ))} */}
            {messages.map((msg, index) => (
                <MessageBubble
                    key={index}
                    // isCustomer={msg.target === 'customer'}
                    type={msg.type}
                    message={msg.message}
                    orderData={msg.data}
                />
            ))}
        </div>
    );
}

export default Message;
