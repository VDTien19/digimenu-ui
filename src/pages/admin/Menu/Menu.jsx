import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import styles from './Menu.module.scss';
import AdminContentHeader from '~/components/admin/AdminContentHeader';
import TableActions from '~/components/admin/TableActions';
import DataTable from '~/components/admin/DataTable';
import {
    fetchMenuItems,
    addMenuItemAsync,
    updateMenuItemAsync,
    deleteMenuItemAsync,
} from '~/store/menuItemSlice';
import MenuModal from '~/components/admin/MenuModal';
import ConfirmModal from '~/components/ConfirmModal';
import { formatCurrency } from '~/utils/formatCurrency';
import { fetchCategories } from '~/store/categorySlice';
import { useSearch } from '~/contexts/SearchContext';
import * as httpRequest from '~/utils/httpRequest';
import images from '~/assets/images';
import Image from '~/components/Images';
import toast from 'react-hot-toast';
import { LoadingIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

const selectMenuData = createSelector(
    (state) => state.menuItem.list || [],
    (state) => state.category.list || [],
    (menuItemList, categoryList) => ({
        menuItemList,
        categoryList,
    })
)

function Menu() {
    const [searchParams] = useSearchParams();
    const catid = searchParams.get('catid');

    const { dishes, setDishes, hasSearched, searchValue, setHasSearched } =
        useSearch();

    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [selectItem, setSelectItem] = useState(null);
    const [formattedDishes, setFormattedDishes] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    // const { menuItemList, categoryList } = useSelector((state) => ({
    //     menuItemList: state.menuItem.list,
    //     categoryList: state.category.list,
    // }));
    const { menuItemList, categoryList } = useSelector(selectMenuData);

    useEffect(() => {
        dispatch(fetchMenuItems());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        console.log("isLoading Menu: ", isLoading);
    })

    const menuColumns = [
        {
            key: 'index',
            label: 'STT',
            cellClass: 'cell-order',
            headClass: 'head-order',
        },
        {
            key: 'name',
            label: 'Tên món',
            cellClass: 'cell-name',
            headClass: 'head-name',
        },
        {
            key: 'price',
            label: 'Giá',
            cellClass: 'cell-price',
        },
        {
            key: 'description',
            label: 'Mô tả',
            headClass: 'hidden sm:block',
            cellClass: 'cell-desc hidden sm:block',
        },
        {
            key: 'actions',
            label: '',
            render: (_, row) => (
                <TableActions
                    data={row}
                    onEdit={() => {
                        setSelectItem(row);
                        setShowMenuModal(true);
                    }}
                    onDelete={() => {
                        setSelectItem(row);
                        setShowModalConfirm(true);
                    }}
                    isView={false}
                />
            ),
            cellClass: 'cell-actions',
        },
    ];

    useEffect(() => {
        const fetchByCategoryId = async () => {
            if (catid) {
                setIsFetching(true);
                try {
                    setHasSearched(true);
                    const res = await httpRequest.get(
                        `menu_items?category_id=${catid}`,
                    );

                    const formatted = res.map((product, index) => ({
                        index: index + 1,
                        _id: product._id,
                        name: product.name,
                        price: formatCurrency(product.price),
                        description: product.description,
                        image: product.image_url,
                        category_id: product.category_id,
                    }));

                    setFormattedDishes(formatted);
                } catch (error) {
                    console.error('Fetch by category_id failed:', error);
                    setFormattedDishes([]);
                } finally {
                    setIsFetching(false);
                }
            }
        };

        fetchByCategoryId();
    }, [catid]);

    useEffect(() => {
        if (dishes.length > 0) {
            const formatted = dishes.map((product, index) => ({
                index: index + 1,
                _id: product._id,
                name: product.name,
                price: formatCurrency(product.price),
                description: product.description,
                image: product.image_url,
                category_id: product.category_id,
            }));
            setFormattedDishes(formatted);
        } else {
            setFormattedDishes([]);
        }
    }, [dishes]);

    // const getProducts = listProducts.flatMap(product => product.products);
    const formatProd = menuItemList.map((product, index) => ({
        index: index + 1,
        _id: product._id,
        name: product.name,
        price: formatCurrency(product.price),
        description: product.description,
        image: product.image_url,
        category_id: product.category_id,
    }));

    const handleSave = async (formData) => {
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('price', formData.price);
        payload.append('description', formData.description);
        payload.append('category_id', formData.selectedCategory);
        // payload.append('image', formData.imageUrl);

        if (formData.imageFile) {
            payload.append('image', formData.imageFile);
        }

        try {
            setIsLoading(true);
            if (formData.id) {
                await dispatch(
                    updateMenuItemAsync({ id: formData.id, data: payload }),
                ).unwrap();
                setIsLoading(false);
                toast('Cập nhật món ăn thành công.');
            } else {
                await dispatch(addMenuItemAsync(payload)).unwrap();
                setIsLoading(false);
                toast('Thêm món ăn thành công.');
            }
            return true;
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            toast('Có lỗi xảy ra. Vui lòng thử lại.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setIsLoading(true);
        if (id) {
            try {
                await dispatch(deleteMenuItemAsync(id)).unwrap();
                toast('Đã xoá món ăn.')
                setShowModalConfirm(false);
                setIsLoading(false);
            } catch (e) {
                toast('Có lỗi xảy ra khi xoá món ăn.')
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (searchValue.trim() === '') {
            setHasSearched(false);
            const params = new URLSearchParams(window.location.search);
            if (params.has('catid')) {
                params.delete('catid');
                window.history.replaceState(
                    {},
                    '',
                    `${window.location.pathname}?${params.toString()}`,
                );
            }

            setDishes(formatProd);
        }
    }, [searchValue, setHasSearched]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('mb-8')}>
                <AdminContentHeader
                    title="Quản lý sản phẩm"
                    titleBtn="Thêm mới"
                    onClick={() => {
                        setSelectItem(null);
                        setShowMenuModal(true);
                    }}
                />
            </div>

            {isFetching ? (
                <div
                    className={cx(
                        'w-full',
                        'mt-50',
                        'flex',
                        'justify-center',
                        'items-center',
                    )}
                >
                    <Image className={cx('w-90')} src={images.loading} />
                </div>
            ) : catid || hasSearched ? (
                formattedDishes.length > 0 ? (
                    <div>
                        <DataTable
                            columns={menuColumns}
                            data={formattedDishes}
                        />
                    </div>
                ) : (
                    <div
                        className={cx(
                            'w-full',
                            'mt-50',
                            'flex',
                            'justify-center',
                            'items-center',
                        )}
                    >
                        <Image
                            className={cx('w-90')}
                            src={images.searchNotFound}
                        />
                    </div>
                )
            ) : (
                <DataTable columns={menuColumns} data={formatProd} />
            )}

            <MenuModal
                isOpen={showMenuModal}
                onClose={() => setShowMenuModal(false)}
                onSave={handleSave}
                data={selectItem}
                categories={categoryList}
                isLoading={isLoading}
            />

            <ConfirmModal
                message={
                    <div>
                        Bạn chắc chắn muốn xoá <b>"{selectItem?.name}"</b> chứ ?
                    </div>
                }
                isOpen={showModalConfirm}
                onClose={() => setShowModalConfirm(false)}
                onConfirm={() => handleDelete(selectItem?._id)}
            />

            {/* {isLoading && ( */}
                    {/* <>
                        <div
                            className={cx(
                                'fixed',
                                'top-0',
                                'left-0',
                                'w-full',
                                'h-full',
                                'bg-opacity-10000',
                                'z-50',
                                'flex',
                                'items-center',
                                'justify-center'
                            )}
                        >
                            <div className={cx('fixed', 'top-1/2', 'left-1/2', 'animate-spin', 'z-10000', '-translate-1/2')}>
                                <LoadingIcon width='2.4rem' height='2.4rem' />
                            </div>
                        </div>
                    </> */}
                {/* )} */}
        </div>
    );
}

export default Menu;
