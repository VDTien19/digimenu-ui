import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './PaymentItem.module.scss';

const cx = classNames.bind(styles);

function PaymentItem () {
    return (
        <div className={cx('wrapper', 'relative', 'p-4', 'flex', 'items-center', 'rounded-xl', 'w-full', 'h-36', 'bg-white', 'shadow-md','cursor-pointer', 'gap-4')}> 
            <div className={cx('table-name', 'shadow', 'flex', 'flex-col', 'items-center', 'justify-center', 'gap-2', 'rounded-lg', 'text-xl', 'font-medium')}>
                <p>Bàn 1</p>
                <div className={cx('w-4', 'h-4', 'rounded-lg', 'bg-green-500')}></div>
            </div>
            <div className={cx('payment-info', 'flex', 'flex-col', 'items-start', 'mb-4')}>
                <div className={cx('payment-id', 'text-lg', 'font-semibold')}>
                    Mã thanh toán: <span className={cx('text-primary')}>#123456</span>
                </div>
                <div className={cx('payment-time', 'text-sm', 'text-gray-500')}>
                    Thời gian: 12/10/2023 14:30
                </div>
                <div className={cx('payment-amount', 'text-lg', 'font-semibold')}>
                    Tổng tiền: <span className={cx('text-primary')}>1.000.000đ</span>
                </div>
            </div>
            <div className={cx('payment-btn', 'absolute', 'right-4', 'bottom-4', 'px-2', 'py-1', 'rounded-lg', 'font-medium')}>
                Thanh toán
            </div>
        </div>
    );
}

export default PaymentItem;
