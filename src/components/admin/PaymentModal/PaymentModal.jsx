import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { io } from 'socket.io-client';

import Modal from '~/components/Modal';
import ConfirmModal from '~/components/ConfirmModal';
import QRPaymentModal from '~/components/admin/QRPaymentModal';
import InvoiceModal from '~/components/InvoiceModal';
import * as odGroupServices from '~/api/orderGroupApi';
import * as invoiceApi from '~/api/invoiceApi';
import { formatCurrency } from '~/utils/formatCurrency';
import styles from './PaymentModal.module.scss';
import { LoadingIcon } from '~/components/Icons';
import toast from 'react-hot-toast';
import socket from '~/socket';

const cx = classNames.bind(styles);

// Kết nối Socket.IO (điều chỉnh URL backend của bạn)
// const socket = io('https://digimenu-backend-production.up.railway.app');

function PaymentModal({ isOpen, onClose, dataOrder }) {
    const [loading, setLoading] = useState(false);
    const [showCfModal, setShowCfModal] = useState(false);
    const [showQRPay, setShowQRPay] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [dataQR, setDataQR] = useState({});
    const [invoiceData, setInvoiceData] = useState({});

    useEffect(() => {
        socket.on('connect', () => {
            console.log("Connect socket")
            socket.emit('join_room', { room: 'staff_room' });
        })

        // Lắng nghe sự kiện thanh toán thành công
        socket.on('payment_success', (data) => {
            console.log("Thanh toán thành công")
            if (data.orderGroupId === dataOrder?.order_group?._id) {
                toast.success(data.message || 'Thanh toán thành công!');
                const fetchInvoice = async () => {
                    const invoiceRes = await invoiceApi.getInvoiceByOrderGroupId(data.orderGroupId);
                    if (invoiceRes) {
                        setInvoiceData(invoiceRes.data);
                        setShowInvoiceModal(true);
                    }
                };
                fetchInvoice();
                setShowQRPay(false); // Đóng QRPaymentModal
                onClose(); // Đóng PaymentModal
            }
        });

        // Lắng nghe sự kiện lỗi
        socket.on('error_notification', (data) => {
            console.log("Lỗi thanh toán");
            if (data.related_id === dataOrder?.order_group?._id.toString()) {
                toast.error(data.message || 'Thanh toán thất bại. Vui lòng thử lại!');
                setShowQRPay(false); // Đóng QRPaymentModal
            }
        });

        // console.log("dataOrder?.order_group?._id: ", dataOrder?.order_group?._id);

        // Cleanup khi component unmount
        return () => {
            socket.off('payment_success');
            socket.off('error_notification');
        };
    }, [dataOrder?.order_group?._id]);

    const handleCashPay = async () => {
        setLoading(true);
        try {
            const res = await odGroupServices.cashPay(dataOrder.order_group._id);
            // console.log("res: ", res);
            if (res) {
                console.log("res?.data.table._id: ", res?.data.table._id)
                localStorage.removeItem(`messages_room_table_${res?.data.table._id}`);
                const invoiceRes = await invoiceApi.getInvoiceByOrderGroupId(dataOrder.order_group._id);
                if (invoiceRes) {
                    setInvoiceData(invoiceRes.data);
                    setShowInvoiceModal(true);
                }
                setLoading(false);
                setShowCfModal(false);
                onClose();
            }
            console.log("res: ", res);
            return res;
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast('Có lỗi khi thanh toán hoặc lấy hóa đơn. Vui lòng thử lại.');
        }
    };

    const handleQRPay = async () => {
        setLoading(true);
        try {
            const res = await odGroupServices.QROrderGroup(dataOrder.order_group._id);
            if (res) {
                setLoading(false);
                setDataQR(res);
                setShowQRPay(true);
                console.log('res qr: ', res);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
            toast('Có lỗi khi tạo mã QR. Vui lòng thử lại.');
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={`Thanh toán hoá đơn bàn ${dataOrder?.table?.name}`}>
                <div className={cx('order-list')}>
                    {dataOrder && dataOrder.order_group && dataOrder.order_group.items.length > 0 ? (
                        <div className={cx('order-group', 'relative')}>
                            <div className={cx('items-list')}>
                                {dataOrder.order_group.items.map((item, itemIndex) => (
                                    <div
                                        key={`${dataOrder.order_group._id}-${item.item_id._id}-${itemIndex}`}
                                        className={cx('item', 'flex items-center mb-4')}
                                    >
                                        <img
                                            src={item.item_id.image_url}
                                            alt={item.item_id.name}
                                            className={cx('item-image')}
                                        />
                                        <div className={cx('item-details', 'flex-1')}>
                                            <div className={cx('item-name', 'text-lg font-medium')}>
                                                {item.item_id.name}
                                            </div>
                                            <div className={cx('item-info', 'text-sm text-gray-600')}>
                                                <span>Giá: {item.price.toLocaleString('vi-VN')} VND</span>
                                                <span className="mx-2">•</span>
                                                <span>Số lượng: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className={cx('item-total', 'text-lg font-semibold')}>
                                            {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                className={cx(
                                    'order-total',
                                    'flex justify-between items-center mt-4 pt-4 border-t sticky bottom-0 bg-white'
                                )}
                            >
                                <div>
                                    <span className="text-lg font-semibold mr-1">Tổng tiền:</span>
                                    <span className="text-xl font-bold text-green-600">
                                        {dataOrder.order_group.total_cost.toLocaleString('vi-VN')} VND
                                    </span>
                                </div>
                                <div className={cx('flex', 'gap-4')}>
                                    <button
                                        onClick={() => setShowCfModal(true)}
                                        className={cx('pay-btn', 'px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer', { 'disable': loading })}
                                    >
                                        Tiền mặt
                                    </button>
                                    <button
                                        className={cx('pay-btn', 'px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer')}
                                        onClick={handleQRPay}
                                    >
                                        QR
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={cx('empty', 'text-center text-gray-500')}>
                            Không có đơn hàng để hiển thị
                        </div>
                    )}
                </div>
            </Modal>

            <ConfirmModal
                isOpen={showCfModal}
                onClose={() => setShowCfModal(false)}
                message={`Xác nhận thanh toán số tiền ${formatCurrency(dataOrder?.order_group?.total_cost)} tại bàn ${dataOrder?.table?.name}`}
                onConfirm={handleCashPay}
            />

            <QRPaymentModal
                isOpen={showQRPay}
                onClose={() => setShowQRPay(false)}
                data={dataQR}
            />

            <InvoiceModal
                isOpen={showInvoiceModal}
                onClose={() => setShowInvoiceModal(false)}
                item={invoiceData}
            />

            {loading && (
                <div className={cx('fixed', 'inset-0', 'bg-transparent', 'bg-opacity-30', 'z-[10000]', 'flex', 'items-center', 'justify-center')}>
                    <div className={cx('animate-spin')}>
                        <LoadingIcon className={cx({ 'disable': loading })} />
                    </div>
                </div>
            )}
        </>
    );
}

export default PaymentModal;