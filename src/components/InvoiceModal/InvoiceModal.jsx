import React from 'react';
import classNames from 'classnames/bind';
import jsPDF from 'jspdf';

import styles from './InvoiceModal.module.scss';
import Modal from '~/components/Modal';
import { formatCurrency } from '~/utils/formatCurrency';
import { formatDateTime } from '~/utils/formatDateTime';

const cx = classNames.bind(styles);

function InvoiceModal({ isOpen, onClose, item }) {
    if (!isOpen) return null;

    const formattedDate = formatDateTime(item?.payment_date || item?.createdAt);

    const handleDownloadInvoice = () => {
        const doc = new jsPDF();
        const margin = 10;
        let y = 20;

        // Tiêu đề
        doc.setFontSize(18);
        doc.text('Chi tiết hóa đơn', margin, y);
        y += 10;

        // Thông tin hóa đơn
        doc.setFontSize(12);
        doc.text(`Mã hóa đơn: ${item?.invoice_number || 'N/A'}`, margin, y);
        y += 10;
        doc.text(`Ngày tạo: ${formattedDate || 'N/A'}`, margin, y);
        y += 10;
        doc.text(`Nhà hàng: ${item?.restaurant_info?.name || 'N/A'} (${item?.restaurant_info?.address || 'N/A'})`, margin, y);
        y += 10;
        doc.text(`Bàn: ${item?.table_id?.name || 'N/A'}`, margin, y);
        y += 10;
        doc.text(`Phương thức thanh toán: ${item?.payment_method || 'N/A'}`, margin, y);
        y += 20;

        // Tiêu đề bảng danh sách món
        doc.setFontSize(14);
        doc.text('Danh sách món:', margin, y);
        y += 10;

        // Bảng danh sách món
        doc.setFontSize(10);
        const headers = ['Tên món', 'Số lượng', 'Đơn giá', 'Thành tiền'];
        const columnWidths = [80, 30, 40, 40];
        let x = margin;

        // Vẽ tiêu đề bảng
        headers.forEach((header, index) => {
            doc.text(header, x, y);
            x += columnWidths[index];
        });
        y += 5;
        doc.line(margin, y, 190, y); // Vẽ đường kẻ ngang
        y += 10;

        // Dữ liệu món
        item?.order_group_id?.items?.forEach((i) => {
            x = margin;
            doc.text(i.item_id.name, x, y, { maxWidth: columnWidths[0] });
            x += columnWidths[0];
            doc.text(i.quantity.toString(), x, y);
            x += columnWidths[1];
            doc.text(formatCurrency(i.price), x, y);
            x += columnWidths[2];
            doc.text(formatCurrency(i.price * i.quantity), x, y);
            y += 10;
        });

        // Tổng cộng
        y += 10;
        doc.setFontSize(12);
        doc.text(`Tổng cộng: ${formatCurrency(item?.total_cost)}`, margin, y);

        // Lưu file PDF
        doc.save(`hoa_don_${item?.invoice_number || 'unknown'}.pdf`);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Chi tiết hoá đơn"
            partition
        >
            <div className={cx('invoice-modal', 'overflow-x-hidden')}>
                <div className={cx('modal-content', 'p-4')}>
                    <p className={cx('text-xl', 'font-semibold', 'mb-2')}>
                        Mã hoá đơn: {item?.invoice_number}
                    </p>
                    <p>Ngày tạo: {formattedDate}</p>
                    <p>
                        Nhà hàng: {item?.restaurant_info?.name} (
                        {item?.restaurant_info?.address})
                    </p>
                    <p>Bàn: {item?.table_id?.name}</p>
                    <p>Phương thức thanh toán: {item?.payment_method}</p>

                    <div className={cx('mt-4')}>
                        <p className={cx('text-xl', 'font-medium')}>
                            Danh sách món:
                        </p>
                        <table
                            className={cx(
                                'w-full',
                                'mt-2',
                                'text-lg',
                                'border-collapse',
                            )}
                        >
                            <thead>
                                <tr>
                                    <th
                                        className={cx(
                                            'text-start',
                                            'border-b',
                                            'pb-1',
                                        )}
                                    >
                                        Tên món
                                    </th>
                                    <th
                                        className={cx(
                                            'text-center',
                                            'border-b',
                                            'pb-1',
                                        )}
                                    >
                                        Số lượng
                                    </th>
                                    <th
                                        className={cx(
                                            'text-center',
                                            'border-b',
                                            'pb-1',
                                        )}
                                    >
                                        <p className={cx('-mr-12')}>Đơn giá</p>
                                    </th>
                                    <th
                                        className={cx(
                                            'text-center',
                                            'border-b',
                                            'pb-1',
                                        )}
                                    >
                                        <p className={cx('-mr-12')}>
                                            Thành tiền
                                        </p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {item?.order_group_id?.items?.map((i) => (
                                    <tr key={i.item_id._id}>
                                        <td className={cx('name', 'font-medium')}>
                                            <p>{i.item_id.name}</p>
                                        </td>
                                        <td className={cx('text-center')}>
                                            <p>{i.quantity}</p>
                                        </td>
                                        <td className={cx('text-right')}>
                                            <p className={cx('mr-8')}>
                                                {formatCurrency(i.price)}
                                            </p>
                                        </td>
                                        <td className={cx('text-right')}>
                                            <p className={cx('mr-8')}>
                                                {formatCurrency(i.price * i.quantity)}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <p
                            className={cx(
                                'text-start',
                                'mt-4',
                                'font-semibold',
                            )}
                        >
                            Tổng cộng: {formatCurrency(item?.total_cost)}
                        </p>
                    </div>
                </div>

                <div
                    className={cx(
                        'button-group',
                        'flex',
                        'justify-around',
                        'items-center',
                        'mt-4',
                        'text-black',
                    )}
                >
                    <button
                        className={cx(
                            'btn-confirm',
                            'w-1/2',
                            'rounded-bl-xl',
                            'cursor-pointer',
                            'p-4',
                        )}
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                    <button
                        className={cx(
                            'btn-download',
                            'w-1/2',
                            'rounded-br-xl',
                            'cursor-pointer',
                            'p-4',
                            'bg-blue-500',
                            'text-white',
                        )}
                        onClick={handleDownloadInvoice}
                    >
                        Tải hóa đơn
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default InvoiceModal;