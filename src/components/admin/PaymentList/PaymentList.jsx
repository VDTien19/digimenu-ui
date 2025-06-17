import { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './PaymentList.module.scss';
import PaymentItem from '~/components/admin/PaymentItem';
import PaymentModal from '~/components/admin/PaymentModal';

const cx = classNames.bind(styles);

function PaymentList({ orders }) {
    const [showModalPay, setShowModalPay] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleOpenModal = (order) => {
        setSelectedOrder(order); // Lưu order được click
        setShowModalPay(true); // Mở modal
    };

    return (
        <div className={cx('wrapper')}>
            {orders.map((order, index) => (
                <PaymentItem
                    key={order.order_group._id} // Sử dụng _id thay vì index để tránh trùng key
                    data={order}
                    onClick={() => handleOpenModal(order)}
                />
            ))}
            <PaymentModal
                isOpen={showModalPay}
                onClose={() => {
                    setShowModalPay(false);
                    setSelectedOrder(null); // Reset selectedOrder khi đóng modal
                }}
                dataOrder={selectedOrder} // Truyền selectedOrder thay vì orders
            />
        </div>
    );
}

export default PaymentList;