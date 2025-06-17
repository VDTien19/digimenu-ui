import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './Payment.module.scss';
import AdminContentHeader from '~/components/admin/AdminContentHeader';
import PaymentList from '~/components/admin/PaymentList';
import * as odGroupServices from '~/api/orderGroupApi';

const cx = classNames.bind(styles);

function Payment () {
    const [dataOdGroup, setDataOdGroup] = useState([]);

    useEffect(() => {
        const fetchOdGroup = async () => {
            try {
                const response = await odGroupServices.getOrderGroupPayYet();
                setDataOdGroup(response.data);
                console.log("respone: ", response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchOdGroup();
    }, [])

    return (
        <div className={cx('wrapper', 'p-4')}>
            <AdminContentHeader
                title="Quản lý thanh toán"
                isAdd={false}
            />
            <div className={cx('content', 'mt-4')}>
                <PaymentList orders={dataOdGroup} />
            </div>
        </div>
    );
}

export default Payment;
