import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MessageBubble.module.scss';
import Modal from '~/components/Modal';

const cx = classNames.bind(styles);

function MessageBubble({ type, message, orderData }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        if (orderData?.items?.length > 0) {
            setModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const textColor = type === 'order_submitted' ? 'text-white' : 'text-black';

    return (
        <>
            <div
                className={cx(
                    'wrapper',
                    'flex',
                    `${type === 'order_submitted' ? 'justify-end' : 'justify-start'}`,
                    'my-6', 'mx-4'
                )}
            >
                <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md text-2xl cursor-pointer ${
                        type === 'order_submitted'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-black'
                    }`}
                    onClick={handleOpenModal}
                >
                    {message}
                    <p className={cx('underline', 'text-xl', 'mt-1', {textColor})}>
                        Xem các món đã gọi
                    </p>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Chi tiết đơn hàng"
                partition
            >
                <div className="space-y-4">
                    {orderData.items?.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center border-b pb-2"
                        >
                            <div>
                                <p className="font-semibold text-xl">{item?.item_id.name}</p>
                                {item.note && (
                                    <p className="text-gray-500 text-sm italic">
                                        Ghi chú: {item.note}
                                    </p>
                                )}
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                                x{item.quantity}
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    );
}

export default MessageBubble;
