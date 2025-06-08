import {} from 'react';
import classNames from 'classnames/bind';

import styles from './Orders.module.scss';
import AdminContentHeader from '~/components/admin/AdminContentHeader';
import OrderTable from '~/components/admin/OrderTable';
import orderpending from '~/data/orderpending.json';

const cx = classNames.bind(styles);

function Orders() {
    const data = orderpending.data;
    console.log('Orders data:', data);

    return (
        <div className={cx('wrapper', 'p-4')}>
            <div className={cx('mb-8')}>
                <AdminContentHeader
                    title="Quản lý hoá đơn"
                    titleBtn="Thêm mới"
                />
            </div>
            <div>
                <OrderTable orders={data} />
            </div>
        </div>
    );
}

export default Orders;
