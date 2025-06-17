import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Dot,
} from 'recharts';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRevenueByDay } from '~/store/dashboardSlice';
import { subDays, format } from 'date-fns';

import InvoicePanel from '~/components/admin/InvoicePanel';
import DateFilter from '~/components/admin/DateFilter';

import styles from './RevenueChart.module.scss';

const cx = classNames.bind(styles);

// Khởi tạo khoảng thời gian mặc định: 30 ngày qua
const getDefaultDateRange = () => {
    const to = new Date();
    const from = subDays(to, 29);
    return { from, to };
};

function RevenueChart() {
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
    const [lastCalledRange, setLastCalledRange] = useState(null); // Lưu khoảng thời gian đã gọi API

    const { revenueByDay, loading, error } = useSelector((state) => state.dashboard);

    // Tính tổng doanh thu
    const totalRevenue = revenueByDay
        ? revenueByDay.reduce((sum, item) => sum + item.revenue, 0)
        : 0;

    // Xử lý thay đổi khoảng thời gian
    const handleDateChange = useCallback(({ from, to }) => {
        if (!from || !to) return;

        const fromFormatted = format(from, 'yyyy-MM-dd');
        const toFormatted = format(to, 'yyyy-MM-dd');

        // Chỉ gọi API nếu khoảng thời gian thay đổi
        if (
            !lastCalledRange ||
            lastCalledRange.from !== fromFormatted ||
            lastCalledRange.to !== toFormatted
        ) {
            dispatch(fetchRevenueByDay({ from: fromFormatted, to: toFormatted }));
            setLastCalledRange({ from: fromFormatted, to: toFormatted });
        }
    }, [dispatch, lastCalledRange]);

    // Gọi API lần đầu khi mount
    useEffect(() => {
        const { from, to } = getDefaultDateRange();
        handleDateChange({ from, to });
    }, []); // Chạy một lần khi mount

    // Xử lý resize cho mobile
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 500);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) return <div className={cx('wrapper')}>Đang tải dữ liệu...</div>;
    if (error) return <div className={cx('wrapper')}>Đã có lỗi: {error.toString()}</div>;
    if (!revenueByDay || !revenueByDay.length) return <div className={cx('wrapper')}>Không có dữ liệu để hiển thị</div>;

    return (
        <div className={cx('wrapper')}>
            <motion.div
                className={cx('chart-wrapper', 'flex', 'gap-4', 'items-start')}
                layout
                transition={{ duration: 2, ease: 'easeInOut' }}
            >
                <motion.div
                    className="w-full"
                    layout
                    transition={{ duration: 2, ease: 'easeInOut' }}
                >
                    <div className="mb-4">
                        <DateFilter
                            onChange={handleDateChange}
                            initialFrom={getDefaultDateRange().from}
                            initialTo={getDefaultDateRange().to}
                            initialActiveOption="last30days"
                        />
                    </div>
                    <div className="p-4 bg-white rounded-xl shadow relative">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold">
                                Doanh thu theo ngày
                            </h2>
                            <span className="text-lg text-gray-500">
                                Tổng: {totalRevenue.toLocaleString()} VND
                            </span>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={revenueByDay}
                                onClick={(e) => {
                                    if (e && e.activeLabel)
                                        setSelectedDate(e.activeLabel);
                                }}
                            >
                                <CartesianGrid
                                    stroke="#f0f0f0"
                                    strokeDasharray="3 3"
                                />
                                <XAxis dataKey="date" />
                                <YAxis
                                    tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                                />
                                <Tooltip
                                    formatter={(val) =>
                                        `${val.toLocaleString()} VND`
                                    }
                                    labelFormatter={(label) => `Ngày: ${label}`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                    dot={
                                        <Dot
                                            r={4}
                                            stroke="#4f46e5"
                                            fill="#fff"
                                        />
                                    }
                                    animationDuration={2000}
                                    animationEasing="ease-in-out"
                                    isAnimationActive
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    className={cx('invoice-panel', 'overflow-hidden')}
                    animate={{
                        width: selectedDate ? (isMobile ? '100%' : 320) : 0,
                        maxHeight: selectedDate ? 416 : 0,
                        opacity: selectedDate ? 1 : 0,
                    }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    style={{ flexShrink: 0 }}
                >
                    {selectedDate && (
                        <InvoicePanel
                            date={selectedDate}
                            onClose={() => setSelectedDate(null)}
                        />
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}

export default RevenueChart;