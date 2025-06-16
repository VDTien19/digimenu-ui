import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './Orders.module.scss';
import AdminContentHeader from '~/components/admin/AdminContentHeader';
import OrderTable from '~/components/admin/OrderTable';
import { getOrdersPending } from '~/api/orderApi';
import { LoadingIcon } from '~/components/Icons';
import socket from '~/socket';

const cx = classNames.bind(styles);

function Orders() {
    const [orderPending, setOrderPending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrdersPending();
                setOrderPending(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();

        // Chỉ lắng nghe sự kiện socket, không connect ở đây nữa
        const handleNewOrder = (orderData) => {
            console.log('🆕 [new_order]:', orderData);
            setOrderPending((prev = []) => {
                const updatedOrders = [orderData, ...prev];
                console.log('✅ Updated order list:', updatedOrders);
                return updatedOrders;
            });
        };

        socket.on('new_order', handleNewOrder);

        return () => {
            console.log('🧹 Cleaning up socket listeners in Orders');
            socket.off('new_order', handleNewOrder);
        };
    }, []);

    return (
        <div className={cx('wrapper', 'p-4')}>
            <div className={cx('mb-8')}>
                <AdminContentHeader
                    title="Quản lý hoá đơn"
                    titleBtn="Thêm mới"
                />
            </div>
            <div>
                {loading ? (
                    <div
                        className={cx(
                            'absolute',
                            'top-1/2',
                            'left-1/2',
                            'animate-spin',
                        )}
                    >
                        <LoadingIcon width="2.4rem" height="2.4rem" />
                    </div>
                ) : (
                    <OrderTable orders={orderPending} />
                )}
            </div>
        </div>
    );
}

export default Orders;
