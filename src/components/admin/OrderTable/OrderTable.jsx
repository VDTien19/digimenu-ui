import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import classNames from 'classnames/bind';
import { toast } from 'react-hot-toast';
import styles from './OrderTable.module.scss';
import DataTable from '~/components/admin/DataTable';
import TableActions from '~/components/admin/TableActions';
import ViewOrderModal from '~/components/admin/ViewOrderModal';
import { approveOrder } from '~/api/orderApi';

const cx = classNames.bind(styles);

function OrderTable({ orders = [], onStatusChange }) {
    const [filterStatus, setFilterStatus] = useState('Đang chờ');
    const [showViewModal, setShowViewModal] = useState(false);
    const [orderData, setOrderData] = useState(null);

    const filteredOrders = useMemo(
        () => orders.filter(order => order.status === filterStatus),
        [orders, filterStatus]
    );

    const countByStatus = (status) => orders.filter(order => order.status === status).length;

    const handleApproveOrder = async (orderId) => {
        try {
            console.log('🔍 Approving order with ID:', orderId);
            const response = await approveOrder(orderId);
            console.log('✅ Order approved:', response);
            onStatusChange(orderId, 'Đã nhận'); // Cập nhật state
            toast('Phê duyệt đơn hàng thành công!');
            setShowViewModal(false); // Đóng modal nếu mở
        } catch (error) {
            console.error('❌ Approve order failed:', error);
            toast.error('Phê duyệt đơn hàng thất bại. Vui lòng thử lại.');
        }
    };

    const columns = [
        {
            key: 'index',
            label: 'STT',
            render: (_, __, index) => index + 1,
            headClass: 'w-12 text-left',
            cellClass: 'pl-4 font-medium',
        },
        {
            key: 'table',
            label: 'Bàn',
            render: (_, row) => `Bàn ${row.table_id?.name || row?.data?.table_id?.name || '-'}`,
            headClass: 'text-start pl-8',
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (_, row) => (
                <select
                    value={row.status}
                    onChange={(e) => {
                        const newStatus = e.target.value;
                        const orderId = row._id || row?.data?._id;
                        // console.log('🔍 row._id:', row._id);
                        // console.log('🔍 row?.data?._id:', row?.data?._id);
                        // console.log('🔍 Order ID used:', orderId);
                        if (newStatus === 'Đã nhận') {
                            handleApproveOrder(orderId); // Gọi API approveOrder
                        } else {
                            onStatusChange(orderId, newStatus);
                            // console.log('🔍 Updated status:', newStatus);
                        }
                    }}
                    className={cx('status-select', 'border', 'rounded', 'px-2', 'py-1', 'outline-0', 'cursor-pointer')}
                >
                    <option value="Đang chờ">Đang chờ</option>
                    <option value="Đã nhận">Đã nhận</option>
                </select>
            ),
            headClass: 'text-start',
        },
        {
            key: 'createdAt',
            label: 'Thời gian tạo',
            render: (value) => {
                if (!value || isNaN(new Date(value).getTime())) {
                    return '-';
                }
                return format(new Date(value), 'HH:mm:ss dd/MM/yyyy', { locale: vi });
            },
            headClass: 'text-start pl-12',
            cellClass: 'text-gray-600 text-xl font-medium pl-10',
        },
        {
            key: 'action',
            label: 'Hành động',
            render: (_, row) => (
                <div
                    onClick={() => {
                        setOrderData(row);
                        setShowViewModal(true);
                    }}
                    className={cx('view-btn', 'flex', 'justify-center', 'items-center', 'm-auto')}
                >
                    <span>Xem</span>
                    <TableActions
                        data={row}
                        onView={() => {
                            setOrderData(row);
                            setShowViewModal(true);
                        }}
                        isView={true}
                        isDelete={false}
                        isEdit={false}
                    />
                </div>
            ),
            headClass: 'text-center',
            cellClass: 'text-center',
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium space-x-4 flex gap-1">
                    <div className="flex items-center px-3 py-1 rounded-3xl font-normal text-black text-lg bg-yellow-400">
                        Đang chờ: <strong className="ml-1">{countByStatus('Đang chờ')}</strong>
                    </div>
                    <div className="flex items-center px-3 py-1 rounded-3xl font-normal text-black text-lg bg-green-400">
                        Đã nhận: <strong className="ml-1">{countByStatus('Đã nhận')}</strong>
                    </div>
                </div>
                <div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={cx('status-select', 'border', 'rounded', 'px-2', 'py-1', 'outline-0', 'cursor-pointer')}
                    >
                        <option value="Đang chờ">Chờ xác nhận</option>
                        <option value="Đã nhận">Đã nhận</option>
                    </select>
                </div>
            </div>
            <DataTable columns={columns} data={filteredOrders} />
            {showViewModal && (
                <ViewOrderModal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    orders={orderData || orderData?.data}
                    onApprove={() => handleApproveOrder(orderData?._id || orderData?.data?._id)}
                />
            )}
        </div>
    );
}

export default OrderTable;