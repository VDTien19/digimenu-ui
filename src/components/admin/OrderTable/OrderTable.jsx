import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import DataTable from '~/components/admin/DataTable';

function OrderTable({ orders: initialOrders = [], onView }) {
    const [orders, setOrders] = useState(initialOrders);
    const [filterStatus, setFilterStatus] = useState('Đang chờ');

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(prev =>
            prev.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
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
        },
        {
            key: 'table',
            label: 'Bàn',
            render: (_, row) => `Bàn ${row.table_id?.name || '-'}`,
            headClass: 'text-center',
        },
        {
            key: 'createdAt',
            label: 'Thời gian tạo',
            render: (value) =>
                format(new Date(value), 'HH:mm:ss dd/MM/yyyy', { locale: vi }),
            headClass: 'text-center',
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (_, row) => (
                <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row._id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                >
                    <option value="Đang chờ">Đang chờ</option>
                    <option value="Đã nhận">Đã nhận</option>
                </select>
            ),
            headClass: 'text-center',
        },
        {
            key: 'action',
            label: 'Hành động',
            render: (_, row) => (
                <button
                    onClick={() => onView?.(row)}
                    className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                >
                    Xem
                </button>
            ),
            headClass: 'text-center',
        },
    ];

    return (
        <div className="space-y-4">
            {/* Bộ lọc trạng thái */}
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium space-x-4">
                    <span>Chờ xét duyệt: <strong>{countByStatus('Đang chờ')}</strong></span>
                    <span>Đã duyệt: <strong>{countByStatus('Đã nhận')}</strong></span>
                </div>
                <div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        <option value="Đang chờ">Chờ xác nhận</option>
                        <option value="Đã nhận">Đã nhận</option>
                    </select>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <DataTable columns={columns} data={filteredOrders} />
        </div>
    );
}

export default OrderTable;
