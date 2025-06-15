import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './Orders.module.scss';
import AdminContentHeader from '~/components/admin/AdminContentHeader';
import OrderTable from '~/components/admin/OrderTable';
import orderpending from '~/data/orderpending.json';
import { getOrdersPending } from '~/api/orderApi';

const cx = classNames.bind(styles);

function Orders() {
    const data = orderpending.data;
    const [orderPending, setOrderPending] = useState([]);

    console.log("orderPending: ", orderPending);
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrdersPending();
                // console.log('Fetched orders:', response.data);
                setOrderPending(response.data); 
                // console.log(orderPending) 
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
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
                <OrderTable orders={orderPending} />
            </div>
        </div>
    );
}

export default Orders;
