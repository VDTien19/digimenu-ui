import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Payment.module.scss';
import AdminContentHeader from '~/components/admin/AdminContentHeader';
import PaymentList from '~/components/admin/PaymentList';

const cx = classNames.bind(styles);

function Payment () {
    return (
        <div className={cx('wrapper', 'p-4')}>
            <AdminContentHeader
                title="Quản lý thanh toán"
                isAdd={false}
            />
            <div className={cx('content', 'mt-4')}>
                <PaymentList />
            </div>
        </div>
    );
}

export default Payment;
