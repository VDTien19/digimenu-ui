import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import classNames from 'classnames/bind';

import styles from './OrderTable.module.scss';
import DataTable from '~/components/admin/DataTable';
import TableActions from '~/components/admin/TableActions';
import ViewOrderModal from '~/components/admin/ViewOrderModal';

const cx = classNames.bind(styles);

function OrderTable({ orders: initialOrders = [] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [filterStatus, setFilterStatus] = useState('Đang chờ');
    const [showViewModal, setShowViewModal] = useState(false);
    const [orderData, setOrderData] = useState([]);

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(prev =>
            prev.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const handleApprove = (orderId) => {
        setOrders(prev =>
            prev.map(order =>
                order._id === orderId ? { ...order, status: 'Đã nhận' } : order
            )
        );
    };

    const filteredOrders = useMemo(
        () => orders.filter(order => order.status === filterStatus),
        [orders, filterStatus]
    );

    const countByStatus = (status) =>
        orders.filter(order => order.status === status).length;

    const columns = [
        {
            key: 'index',
            label: 'STT',
            render: (_, __, index) => index + 1,
            headClass: 'w-12 text-left',
            cellClass: 'pl-4 font-medium'
        },
        {
            key: 'table',
            label: 'Bàn',
            render: (_, row) => `Bàn ${row.table_id?.name || '-'}`,
            headClass: 'text-start pl-8',
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (_, row) => (
                <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row._id, e.target.value)}
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
            render: (value) =>
                format(new Date(value), 'HH:mm:ss dd/MM/yyyy', { locale: vi }),
            headClass: 'text-start pl-12',
            cellClass: 'text-gray-600 text-xl font-medium pl-10',
        },
        {
            key: 'action',
            label: 'Hành động',
            render: (_, row) => (
                <div onClick={() => setShowViewModal(true)} className={cx('view-btn', 'flex', 'justify-center', 'items-center', 'm-auto')}>
                    <span>Xem</span>
                    <div className={cx()}>
                        <TableActions
                            data={row}
                            onView={() => setOrderData(row)}
                            isView={true}
                            isDelete={false}
                            isEdit={false}
                        />
                    </div>
                </div>
            ),
            headClass: 'text-center',
            cellClass: 'text-center',
        },
    ];

    return (
        <div className="space-y-4">
            {/* Bộ lọc trạng thái */}
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium space-x-4 flex gap-1">
                    <div className="flex items-center px-3 py-1 rounded-3xl font-normal text-black text-lg bg-yellow-400">Đang chờ: <strong className="ml-1">{countByStatus('Đang chờ')}</strong></div>
                    <div className="flex items-center px-3 py-1 rounded-3xl font-normal text-black text-lg bg-green-400">Đã nhận: <strong className="ml-1">{countByStatus('Đã nhận')}</strong></div>
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

            {/* Bảng dữ liệu */}
            <DataTable columns={columns} data={filteredOrders} />

            {showViewModal && (
                <ViewOrderModal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    orders={orderData}
                    onApprove={handleApprove}
                />
            )}
        </div>
    );
}

export default OrderTable;
