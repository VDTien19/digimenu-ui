import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './QRPaymentModal.module.scss';
import Modal from '~/components/Modal';

const cx = classNames.bind(styles);

function QRPaymentModal ({ isOpen, onClose, data }) {

    if(!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title=' '>
            <div className={cx('flex', 'items-center', 'justify-center', 'p-8')}><img src={data.qr_code_url} alt="Thanh toán QR Code" /></div>
        </Modal>
    );
}

export default QRPaymentModal;
