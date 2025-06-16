import { useEffect, useState, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './Orders.module.scss';
import AdminContentHeader from '~/components/admin/AdminContentHeader';
import OrderTable from '~/components/admin/OrderTable';
import { getOrdersPending } from '~/api/orderApi';
import { LoadingIcon } from '~/components/Icons';
import { SocketContext } from '~/contexts/SocketProvider';

const cx = classNames.bind(styles);

function Orders() {
    const { orderPending, setOrderPending } = useContext(SocketContext);
    const [loading, setLoading] = useState(true);

    const handleStatusChange = (orderId, newStatus) => {
        // console.log('🔍 Status changed - orderId:', orderId, 'newStatus:', newStatus);
        setOrderPending((prev = []) =>
            prev.map(order => {
                const currentId = order._id || order.data?._id;
                return currentId === orderId ? { ...order, status: newStatus } : order;
            })
        );
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrdersPending();
                // console.log('📊 API orders:', response.data);
                setOrderPending(prev => [...prev, ...response.data.filter(newOrder => 
                    !prev.some(order => (order._id || order.data?._id) === (newOrder._id || newOrder.data?._id))
                )]);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi lấy đơn hàng:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [setOrderPending]);

    return (
        <div className={cx('wrapper', 'p-4')}>
            <div className={cx('mb-8')}>
                <AdminContentHeader title="Quản lý hoá đơn" titleBtn="Thêm mới" />
            </div>
            <div>
                {loading ? (
                    <div className={cx('absolute', 'top-1/2', 'left-1/2', 'animate-spin')}>
                        <LoadingIcon width="2.4rem" height="2.4rem" />
                    </div>
                ) : (
                    <OrderTable orders={orderPending} onStatusChange={handleStatusChange} />
                )}
            </div>
        </div>
    );
}

export default Orders;