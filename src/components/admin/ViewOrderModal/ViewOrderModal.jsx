import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './ViewOrderModal.module.scss';
import Modal from '~/components/Modal';
import Image from '~/components/Images';

const cx = classNames.bind(styles);

function ViewOrderModal ({ isOpen, onClose, orders, onApprove }) {
    if (!isOpen) {
        return null;
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Order bàn ${orders.table_id.name}`}>
            <div className={cx('order-details', 'flex', 'flex-col')}>
                {orders.items.map((item, index) => (
                    <div key={index} className={cx('order-item', 'flex', 'items-center', 'gap-4', 'p-4')}>
                        <div className={cx('order-image')}>
                            <Image
                                src={item.item_id.image_url}
                                alt={item.item_id.name}
                                className={cx('image')}
                            />
                        </div>
                        <div className={cx('order-desc')}>
                            <div className={cx('item-name', 'font-medium', 'mb-2')}>{item.item_id.name}</div>
                            <div className={cx('item-quantity', 'text-xl')}><span>Số lượng:</span> <b>{item.quantity}</b></div>
                            <div className={cx('item-price', 'text-xl')}><span>Đơn giá:</span> <b>{item.price.toLocaleString()} VNĐ</b></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={cx('order-note', 'p-4')}>
                <span className={cx('font-medium', 'text-xl')}>Ghi chú:</span> <span className={cx('text-xl')}>{orders.notes || 'Không có ghi chú'}</span>
            </div>
            <div className={cx('total-price', 'p-4', 'flex', 'items-center', 'justify-between')}>
                <div>
                    <span className={cx('text-xl')}>Tổng giá:</span>{' '}
                    <b>{orders.total_cost.toLocaleString()} VNĐ</b>
                </div>
                {orders.status === 'Đang chờ' && (
                    <button
                        onClick={() => {
                            onApprove?.(orders._id);
                            onClose();
                        }}
                        className={cx('approve-button')}
                    >
                        Duyệt đơn
                    </button>
                )}
            </div>

        </Modal>
    );
}

export default ViewOrderModal;
