import React from 'react';
import classNames from 'classnames/bind';

import styles from './ViewCateModal.module.scss';
import Modal from '~/components/Modal';
import Image from '~/components/Images';

const cx = classNames.bind(styles);

function ViewCateModal({ isOpen, onClose, category }) {
    if (!isOpen || !category) return null;

    // Giả sử category có structure: { name, items: [{ image_url, name, price, description }, ...] }
    const { name, menu_items = [] } = category;

    console.log("menu_items: ", menu_items);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Các món ăn trong "${name}"`}>
            <div className={cx('wrapper')}>
                {menu_items.length > 0 ? (
                    menu_items.map((item, index) => (
                        <div key={index} className={cx('flex', 'gap-4', 'bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'mb-4', 'product-item')}>
                            <div className={cx('image', 'w-32', 'h-32', 'flex-shrink-0')}>
                                <Image
                                    className={cx('image-url', 'w-full', 'h-full', 'object-cover', 'rounded-lg')}
                                    src={item.image_url || 'https://via.placeholder.com/128'} // Fallback nếu không có image
                                    alt={item.name}
                                />
                            </div>
                            <div className={cx('flex', 'flex-col', 'justify-between', 'flex-1')}>
                                <div>
                                    <h4 className={cx('name', 'text-lg', 'font-semibold', 'text-gray-800', 'mb-1')}>
                                        {item.name}
                                    </h4>
                                    <p className={cx('price', 'text-xl', 'font-bold', 'text-amber-600', 'mb-2')}>
                                        {item.price}đ
                                    </p>
                                    <p className={cx('description', 'text-sm', 'text-gray-600', 'leading-relaxed', 'line-clamp-3')}>
                                        {item.description || 'Không có mô tả'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={cx('text-center', 'text-gray-500', 'py-4')}>
                        Không có món ăn trong danh mục này.
                    </div>
                )}
                {/* <div className={cx('mt-4', 'text-right')}>
                    <button
                        onClick={onClose}
                        className={cx(
                            'px-4',
                            'py-2',
                            'bg-amber-500',
                            'text-white',
                            'rounded-md',
                            'hover:bg-amber-600',
                            'transition-colors',
                            'duration-300',
                            'focus:outline-none',
                            'focus:ring-2',
                            'focus:ring-amber-400'
                        )}
                    >
                        Đóng
                    </button>
                </div> */}
            </div>
        </Modal>
    );
}

export default ViewCateModal;