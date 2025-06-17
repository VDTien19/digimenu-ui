import { useEffect } from 'react';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
// import CountUp from 'react-countup';
// import { motion } from 'framer-motion';

import styles from './DashboardStatic.module.scss';
import { fetchCategories } from '~/store/categorySlice';
import { fetchMenuItems } from '~/store/menuItemSlice';
import { fetchTable } from '~/store/tableSlice';
import SlideUpNumber from '~/components/SlideUpNumber';
import { fetchAllRevenue, fetchPopularItems } from '~/store/dashboardSlice';
// import { fetchOrders } from '~/store/orderSlice';

const cx = classNames.bind(styles);

const selectDashboardData = createSelector(
    (state) => state.category.list || [],
    (state) => state.menuItem.list || [],
    (state) => state.table.listTables || [],
    (listCategory, listMenuItem, listTables) => ({
        listCategory,
        listMenuItem,
        listTables,
    })
);

function DashboardStatic() {
    const dispatch = useDispatch();
    const { listCategory, listMenuItem, listTables } = useSelector(selectDashboardData);

    const {
        allRevenue,
        popularItems,
        loading,
        error,
    } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchMenuItems());
        dispatch(fetchTable());
        dispatch(fetchAllRevenue());
        dispatch(fetchPopularItems(5));
    }, [dispatch]);

    // useEffect(() => {
    //     console.log('Categories:', listCategory);
    //     console.log('Products:', listMenuItem);
    //     console.log('Tables:', listTables);
    // }, [listCategory, listMenuItem, listTables]);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div
            className={cx(
                'wrapper',
                'flex',
                'flex-wrap',
                'justify-start',
                'gap-4',
            )}
        >
            <div
                className={cx(
                    'flex',
                    'flex-col',
                    'items-center',
                    'justify-center',
                    'shadow-md',
                    'rounded-2xl',
                    'h-36',
                    'cursor-pointer',
                    'w-full',
                    'sm:w-[200px]',
                    'md:w-[220px]',
                    'lg:w-[230px]',
                    'bg-green-100',
                )}
            >
                <p className={cx('text-2xl', 'font-bold', 'mb-2')}>Tổng bàn</p>
                <span className={cx('text-4xl', 'font-bold')}>
                    <SlideUpNumber number={listTables.length} />
                </span>
            </div>
            <div
                className={cx(
                    'flex',
                    'flex-col',
                    'items-center',
                    'justify-center',
                    'shadow-md',
                    'rounded-2xl',
                    'h-36',
                    'cursor-pointer',
                    'w-full',
                    'sm:w-[200px]',
                    'md:w-[220px]',
                    'lg:w-[230px]',
                    'bg-blue-100',
                )}
            >
                <p className={cx('text-2xl', 'font-bold', 'mb-2')}>
                    Tổng hoá đơn
                </p>
                <span className={cx('text-4xl', 'font-bold')}>
                    <SlideUpNumber number={allRevenue?.count || 0} />
                    {/* <CountUp start={0} end={97283728} duration={2} delay={0} separator="," /> */}
                </span>
            </div>
            <div
                className={cx(
                    'flex',
                    'flex-col',
                    'items-center',
                    'justify-center',
                    'shadow-md',
                    'rounded-2xl',
                    'h-36',
                    'cursor-pointer',
                    'w-full',
                    'sm:w-[200px]',
                    'md:w-[220px]',
                    'lg:w-[230px]',
                    'bg-yellow-100',
                )}
            >
                <p className={cx('text-2xl', 'font-bold', 'mb-2')}>
                    Tổng doanh thu
                </p>
                <span className={cx('text-4xl', 'font-bold')}>
                    <SlideUpNumber number={allRevenue?.total_revenue} />
                </span>
            </div>
            <div
                className={cx(
                    'flex',
                    'flex-col',
                    'items-center',
                    'justify-center',
                    'shadow-md',
                    'rounded-2xl',
                    'h-36',
                    'cursor-pointer',
                    'w-full',
                    'sm:w-[200px]',
                    'md:w-[220px]',
                    'lg:w-[230px]',
                    'bg-purple-100',
                )}
            >
                <p className={cx('text-2xl', 'font-bold', 'mb-2')}>
                    Tổng danh mục
                </p>
                <span className={cx('text-4xl', 'font-bold')}>
                    <SlideUpNumber number={listCategory.length} />
                </span>
            </div>
            <div
                className={cx(
                    'flex',
                    'flex-col',
                    'items-center',
                    'justify-center',
                    'shadow-md',
                    'rounded-2xl',
                    'h-36',
                    'cursor-pointer',
                    'w-full',
                    'sm:w-[200px]',
                    'md:w-[220px]',
                    'lg:w-[230px]',
                    'bg-red-100',
                )}
            >
                <p className={cx('text-2xl', 'font-bold', 'mb-2')}>
                    Tổng món ăn
                </p>
                <span className={cx('text-4xl', 'font-bold')}>
                    <SlideUpNumber number={listMenuItem.length} />
                </span>
            </div>
        </div>
    );
}

export default DashboardStatic;
