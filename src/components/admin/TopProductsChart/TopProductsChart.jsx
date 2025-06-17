import React, { useState, useMemo, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularItems } from '~/store/dashboardSlice';

const getColor = (value, max) => {
    const ratio = value / max;
    if (ratio > 0.8) return '#4f46e5';
    if (ratio > 0.6) return '#6366f1';
    if (ratio > 0.4) return '#818cf8';
    if (ratio > 0.2) return '#a5b4fc';
    return '#c7d2fe';
};

function TopProductsChart() {
    const dispatch = useDispatch();
    const [limit, setLimit] = useState(5);
    const [sortOrder, setSortOrder] = useState('desc');

    const { topProducts, loading, error } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchPopularItems(limit));
    }, [dispatch, limit]);

    const sortedData = useMemo(() => {
        if (!topProducts) return [];
        const copied = [...topProducts];
        copied.sort((a, b) =>
            sortOrder === 'desc' ? b.quantity - a.quantity : a.quantity - b.quantity
        );
        return copied.slice(0, limit);
    }, [topProducts, limit, sortOrder]);

    const maxQuantity = useMemo(() => {
        return topProducts.length ? Math.max(...topProducts.map((p) => p.quantity)) : 1;
    }, [topProducts]);

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div>Đã có lỗi: {error.toString()}</div>;

    return (
        <div className="bg-white p-4 rounded-xl shadow w-full space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-xl font-semibold">Top sản phẩm bán chạy</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-gray-600">Hiển thị:</span>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                            className="border rounded px-2 py-1 h-10 font-medium cursor-pointer"
                        >
                            <option value={5}>Top 5</option>
                            <option value={10}>Top 10</option>
                            <option value={15}>Top 15</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-gray-600">Sắp xếp:</span>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="border rounded px-2 py-1 h-10 font-medium cursor-pointer"
                        >
                            <option value="desc">Nhiều nhất</option>
                            <option value="asc">Ít nhất</option>
                        </select>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={sortedData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
                    <Tooltip
                        formatter={(value) => [`${value} đơn`, 'Số lượng']}
                        labelFormatter={(label) => `Sản phẩm: ${label}`}
                    />
                    <Bar
                        dataKey="quantity"
                        radius={[0, 6, 6, 0]}
                        isAnimationActive={true}
                        label={{ position: 'right', fontSize: 12 }}
                    >
                        {sortedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getColor(entry.quantity, maxQuantity)}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TopProductsChart;
