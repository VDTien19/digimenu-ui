import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useLocation, useParams } from 'react-router-dom';

import styles from './Message.module.scss';
// import socket from '~/socket';
import MessageBubble from '~/components/MessageBubble';

const cx = classNames.bind(styles);

function Message () {
    const location = useLocation();
    // console.log("location", location.pathname);
    const isCustomer = location.pathname.includes('/status/');
    const { tableName } = useParams();
    console.log('tableName', tableName);

    const [messages, setMessages] = useState([]);

    // useEffect(() => {
    //     // Lắng nghe tin nhắn từ server
    //     socket.on('new_message', (msg) => {
    //         setMessages((prev) => [...prev, msg]);
    //     });

    //     // Cleanup
    //     return () => socket.off('new_message');
    // }, []);

    // useEffect(() => {
    //     // Gửi tin đầu tiên khi user vào page (tự động)
    //     if (isCustomer) {
    //         socket.emit('order_submited', { table: 5 }); // tuỳ bạn muốn gửi gì
    //     }
    // }, [isCustomer]);

    return (
        <div className={cx('wrapper')}>
            {messages.map((msg, index) => (
                <MessageBubble
                    key={index}
                    isCustomer={msg?.target === 'customer'}
                    message={msg?.message}
                />
            ))}
        </div>
    );
}

export default Message;
