import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import styles from './Category.module.scss';
import { useSearch } from '~/contexts/SearchContext';
import AdminContentHeader from '~/components/admin/AdminContentHeader';
import DataTable from '~/components/admin/DataTable';
import TableActions from '~/components/admin/TableActions';
import ConfirmModal from '~/components/ConfirmModal';
import CategoryModal from '~/components/admin/CategoryModal';
import ViewCateModal from '~/components/admin/ViewCateModal'; // Import ViewCateModal
import { useSlug } from '~/contexts/SlugContext';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '~/store/categorySlice';
import { toast } from 'react-hot-toast';
import { getCategoryById } from '~/api/categoryApi'; // Giả sử có API này

const cx = classNames.bind(styles);

function Category() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { slug } = useSlug();
    const { categories, hasSearched, searchValue, setHasSearched } = useSearch();
    const { list, loading } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showModalCategory, setShowModalCategory] = useState(false);
    const [showViewCateModal, setShowViewCateModal] = useState(false); // State cho ViewCateModal
    const [selectedItem, setSelectedItem] = useState(null);
    const [categoryData, setCategoryData] = useState(null); // Lưu dữ liệu danh mục từ API

    const cateColumns = [
        {
            key: 'index',
            label: 'STT',
            cellClass: 'cell-order',
            headClass: 'head-order',
        },
        {
            key: 'name',
            label: 'Tên',
            cellClass: 'cell-name',
            headClass: 'head-name',
        },
        { key: 'item_count', label: 'Số lượng món', cellClass: 'cell-quantity' },
        {
            key: 'actions',
            label: '',
            render: (_, row) => (
                <TableActions
                    data={row}
                    onView={async () => {
                        try {
                            const data = await getCategoryById(row._id); // Gọi API theo _id
                            setCategoryData(data); // Lưu dữ liệu
                            setShowViewCateModal(true); // Mở modal
                            console.log("data: ", data);
                        } catch (error) {
                            console.error('Lỗi khi lấy danh mục:', error);
                            toast('Không thể xem danh mục. Vui lòng thử lại.');
                        }
                    }}
                    onEdit={() => {
                        setShowModalCategory(true);
                        setSelectedItem(row);
                    }}
                    onDelete={() => {
                        setShowModalConfirm(true);
                        setSelectedItem(row);
                    }}
                />
            ),
            cellClass: 'cell-actions',
        },
    ];

    const cateDataFilter = list.map((data, index) => ({
        _id: data._id,
        index: index + 1,
        name: data.name,
        item_count: data.item_count || 0,
    }));

    const categoriesFilter = categories.map((data, index) => ({
        _id: data._id,
        index: index + 1,
        name: data.name,
        item_count: data.item_count || 0,
    }));

    const handleSave = async (formData) => {
        try {
            if (selectedItem?._id) {
                await dispatch(updateCategory({ id: selectedItem._id, data: formData })).unwrap();
                toast(`Cập nhật danh mục "${formData.name}" thành công!`);
            } else {
                await dispatch(addCategory(formData)).unwrap();
                toast(`Thêm danh mục "${formData.name}" thành công!`);
            }
            await dispatch(fetchCategories()).unwrap();
            setShowModalCategory(false);
            setSelectedItem(null);
            if (hasSearched) {
                setHasSearched(false);
            }
        } catch (error) {
            console.error('Lỗi khi lưu danh mục:', error);
            toast('Lưu danh mục thất bại. Vui lòng thử lại.');
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log('🔍 Deleting category with ID:', id);
            await dispatch(deleteCategory(id)).unwrap();
            toast(`Xoá danh mục "${selectedItem?.name}" thành công!`);
            await dispatch(fetchCategories()).unwrap();
            setShowModalConfirm(false);
            setSelectedItem(null);
        } catch (err) {
            console.error('Lỗi khi xoá danh mục:', err);
            toast('Xoá danh mục thất bại. Vui lòng thử lại.');
        }
    };

    useEffect(() => {
        if (searchValue.trim() === '') {
            setHasSearched(false);
        }
    }, [searchValue, setHasSearched]);

    useEffect(() => {
        console.log('🔍 Current list:', list);
    }, [list]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('mb-8')}>
                <AdminContentHeader
                    title="Quản lý danh mục"
                    titleBtn="Thêm mới"
                    onClick={() => {
                        setSelectedItem(null);
                        setShowModalCategory(true);
                    }}
                />
            </div>
            {loading && <div className="text-center py-4">Đang tải...</div>}
            {hasSearched ? (
                categories.length ? (
                    <DataTable columns={cateColumns} data={categoriesFilter} />
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        Không tìm thấy kết quả cho từ khoá '<strong>{searchValue}</strong>'
                    </div>
                )
            ) : (
                <DataTable columns={cateColumns} data={cateDataFilter} />
            )}
            <ConfirmModal
                message={
                    <div>
                        Bạn chắc chắn muốn xoá <b>"{selectedItem?.name}"</b> chứ?
                    </div>
                }
                isOpen={showModalConfirm}
                onClose={() => setShowModalConfirm(false)}
                onConfirm={() => handleDelete(selectedItem?._id)}
            />
            <CategoryModal
                data={selectedItem}
                title={selectedItem ? `Sửa danh mục "${selectedItem.name}"` : 'Thêm danh mục mới'}
                isOpen={showModalCategory}
                onClose={() => {
                    setShowModalCategory(false);
                    setSelectedItem(null);
                }}
                onSave={handleSave}
            />
            <ViewCateModal
                isOpen={showViewCateModal}
                onClose={() => {
                    setShowViewCateModal(false);
                    setCategoryData(null);
                }}
                category={categoryData}
            />
        </div>
    );
}

export default Category;