import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import styles from './Cart.module.scss';
import CartList from '~/components/CartList';
import images from '~/assets/images';
import Image from '~/components/Images';
import { TrashIcon } from '~/components/Icons';
import ConfirmModal from '~/components/ConfirmModal';
import { formatCurrency } from '~/utils/formatCurrency';
import { createOrder } from '~/store/orderSlice';
import { fetchTableByName } from '~/store/tableSlice';
import { useSlug } from '~/contexts/SlugContext';
import socket from '~/socket'; // Import socket

const cx = classNames.bind(styles);

function Cart() {
    const { tableName } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { slug } = useSlug();

    const { totalQuantity, totalPrice, cartItems } = useSelector(
        (state) => state.cart,
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState(null);

    // Lấy ID bàn từ tên bàn
    useEffect(() => {
        if (!tableName) return;
        const fetchTableCurrent = async () => {
            try {
                const table = await dispatch(
                    fetchTableByName(tableName),
                ).unwrap();
                setDataTable(table);
            } catch (error) {
                alert(error.message || 'Không tìm thấy bàn.');
            }
        };
        fetchTableCurrent();
    }, [tableName, setDataTable, dispatch]);

    const handleConfirm = () => {
        dispatch({ type: 'cart/clearCart' });
        setIsModalOpen(false);
    };

    const handleOrder = async () => {
        if (!dataTable) {
            alert("Không tìm thấy bàn. Vui lòng kiểm tra lại.");
            return;
        }

        const orderData = {
            table_id: dataTable._id,
            notes,
            items: cartItems.map(item => ({
            item_id: item.id,
            quantity: item.quantity
            }))
        };

        // Thay vì gọi API, chuyển sang trang status, mang theo orderData
        navigate(`/${slug}/status/${tableName}?encode=${dataTable.encode}`, {
            state: { orderData, tableData: dataTable }
        });
    };

    return (
        <div className={cx('wrapper')}>
            <header
                className={cx(
                    'header',
                    'top-0',
                    'h-16',
                    'flex',
                    'items-center',
                    'justify-between',
                )}
            >
                <div
                    onClick={() => navigate(-1)}
                    className={cx(
                        'icon-back',
                        'w-12',
                        'h-10',
                        'rotate-180',
                        'flex',
                        'items-center',
                        'justify-center',
                        'ml-4',
                        'rounded',
                        'cursor-pointer',
                    )}
                >
                    <Image
                        className={cx('icon-image', 'w-4', 'h-4')}
                        src={images.arrow}
                    />
                </div>
                <h2
                    className={cx(
                        'title',
                        'w-full',
                        'h-full',
                        'font-medium',
                        'flex',
                        'items-center',
                        'justify-center',
                    )}
                >
                    Các món đã chọn ({totalQuantity})
                </h2>
                <div
                    className={cx('mr-4', 'cursor-pointer')}
                    onClick={() => setIsModalOpen(true)}
                >
                    <TrashIcon />
                </div>
            </header>

            <div className={cx('w-full')}>
                <CartList cartItems={cartItems} />
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                message="Bạn có chắc chắn muốn xóa tất cả món ăn trong giỏ hàng không?"
                onConfirm={handleConfirm}
            />

            {totalQuantity >= 1 && (
                <footer
                    className={cx('footer', 'bottom-0', 'bg-white', 'py-4')}
                >
                    <div className={cx('order-note', 'px-4')}>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className={cx(
                                'w-full',
                                'h-40',
                                'bg-white',
                                'p-2',
                                'border',
                                'border-gray-300',
                                'rounded-lg',
                                'outline-0',
                            )}
                            placeholder="Ghi chú cho đơn hàng (nếu có)"
                        />
                    </div>
                    <div
                        className={cx(
                            'w-full',
                            'h-18',
                            'flex',
                            'items-center',
                            'justify-between',
                            'px-4',
                            'gap-8',
                        )}
                    >
                        <div
                            className={cx(
                                'total-price',
                                'w-3/7',
                                'h-full',
                                'bg-amber-200',
                                'rounded-xl',
                                'flex',
                                'items-center',
                                'justify-center',
                            )}
                        >
                            Tổng: {formatCurrency(totalPrice)}
                        </div>
                        <div
                            className={cx(
                                'checkout-btn',
                                'w-4/7',
                                'h-full',
                                'bg-amber-400',
                                'rounded-xl',
                                'flex',
                                'items-center',
                                'justify-center',
                                'cursor-pointer',
                            )}
                            onClick={loading ? null : handleOrder}
                        >
                            {loading ? 'Đang gửi...' : 'Xác nhận và gọi món'}
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}

export default Cart;
