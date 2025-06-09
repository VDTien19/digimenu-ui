import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './PaymentList.module.scss';
import PaymentItem from '~/components/admin/PaymentItem';

const cx = classNames.bind(styles);

function PaymentList () {
    return (
        <div className={cx('wrapper')}>
            <PaymentItem />
            <PaymentItem />
            <PaymentItem />
            <PaymentItem />
            <PaymentItem />
            <PaymentItem />
            <PaymentItem />
            <PaymentItem />
        </div>
    );
}

export default PaymentList;
