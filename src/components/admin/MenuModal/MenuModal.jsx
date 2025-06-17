import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Select from 'react-select';

import styles from './MenuModal.module.scss';
import Modal from '~/components/Modal';
import Image from '~/components/Images'; // Giả sử là custom component
import { EditIcon } from '~/components/Icons';
import PriceInput from '~/components/PriceInput';
import { ChangeCameraIcon } from '~/components/Icons';
import images from '~/assets/images';

const cx = classNames.bind(styles);

const parseCurrency = (currencyString) => {
    if (!currencyString) return 0;
    return Number(currencyString.replace(/[^\d]/g, ''));
};

function MenuModal({ isOpen, onClose, data, onSave, categories }) {
    const [name, setName] = useState(data?.name || '');
    const [price, setPrice] = useState(data?.price || '');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(data?.image || images.uploadImage); // Fallback
    const [description, setDescription] = useState(data?.description || '');
    const [selectedCategory, setSelectedCategory] = useState(data?.category_id?._id || '');

    useEffect(() => {
        if (data) {
            console.log('🔍 Data received:', data); // Debug data
            setName(data.name || '');
            setImageUrl(data.image || images.uploadImage); // Đảm bảo lấy image_url
            setDescription(data.description || '');
            setPrice(parseCurrency(data.price) || 0);
            setSelectedCategory(data.category_id?._id || '');
        } else {
            setName('');
            setImageUrl(images.uploadImage);
            setDescription('');
            setPrice(0);
            setSelectedCategory('');
        }
    }, [data, isOpen]);

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const imagePreviewUrl = URL.createObjectURL(file);
            setImageUrl(imagePreviewUrl);
            setImageFile(file);
        } else {
            console.log('File không hợp lệ');
            setImageUrl(images.uploadImage);
        }
    };

    useEffect(() => {
        return () => {
            if (imageUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    useEffect(() => {
        console.log('🔍 Image URL:', imageUrl); // Debug imageUrl
    }, [imageUrl]);

    if (!isOpen) return null;

    const handleSaveClick = () => {
        onSave({
            name,
            price,
            imageFile,
            description,
            selectedCategory,
            id: data?._id,
        });
        onClose();
    };

    // Hàm xử lý lỗi khi ảnh không tải được
    const handleImageError = () => {
        console.log('🔍 Image failed to load, using fallback:', images.uploadImage);
        setImageUrl(images.uploadImage);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={cx('wrapper', 'p-8')}>
                <div
                    className={cx(
                        'image',
                        'relative',
                        'w-full',
                        'flex',
                        'justify-center',
                        'rounded-2xl',
                        'cursor-pointer',
                        'group',
                    )}
                >
                    <Image
                        src={imageUrl}
                        alt={name || 'Hình ảnh món ăn'}
                        className={cx('rounded-2xl', 'w-96', 'h-64', 'object-cover')}
                        width={384}
                        height={256}
                        onError={handleImageError} // Xử lý lỗi tải ảnh
                    />
                    <div
                        className={cx(
                            'image-overlay',
                            'absolute',
                            'top-0',
                            'left-0',
                            'w-full',
                            'h-full',
                            'rounded-2xl',
                            'opacity-0',
                            'group-hover:opacity-100',
                            'transition-opacity',
                            'duration-300',
                            'bg-black/50',
                        )}
                    >
                        <ChangeCameraIcon
                            className={cx(
                                'absolute',
                                'top-1/2',
                                'left-1/2',
                                '-translate-1/2',
                                'text-white',
                            )}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            title="Chọn ảnh"
                            className={cx(
                                'opacity-0',
                                'absolute',
                                'top-0',
                                'left-0',
                                'w-full',
                                'h-full',
                                'cursor-pointer',
                            )}
                            onChange={handleChangeImage}
                        />
                    </div>
                </div>
                <div className={cx('flex', 'flex-col', 'gap-8', 'items-center')}>
                    <div
                        className={cx(
                            'flex',
                            'justify-center',
                            'w-full',
                            'px-8',
                            'relative',
                        )}
                    >
                        <input
                            className={cx(
                                'peer',
                                'w-full',
                                'text-center',
                                'name-input',
                                'font-medium',
                            )}
                            type="text"
                            placeholder="Tên sản phẩm"
                            value={name || ''}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <EditIcon
                            width="1.6rem"
                            stroke="#c19c58"
                            className={cx(
                                'absolute',
                                'right-2',
                                'top-1/2',
                                '-translate-y-1/2',
                                'text-gray-400',
                                'pointer-events-none',
                                'peer-focus:hidden',
                            )}
                        />
                    </div>
                    <div className={cx('flex', 'items-center', 'relative')}>
                        <label className={cx('mr-2')}>Mức giá: </label>
                        <PriceInput
                            value={price || 0}
                            onChange={(val) => setPrice(val === '' ? 0 : val)}
                            className={cx('price-input', 'w-1/2', 'peer')}
                        />
                        <EditIcon
                            width="1.6rem"
                            stroke="#c19c58"
                            className={cx(
                                'absolute',
                                'right-20',
                                'top-1/2',
                                '-translate-y-1/2',
                                'text-gray-400',
                                'pointer-events-none',
                                'peer-focus:hidden',
                            )}
                        />
                    </div>
                    <div className={cx('flex', 'items-center', 'gap-2')}>
                        <label className={cx('mr-2', 'whitespace-nowrap')}>
                            Danh mục:{' '}
                        </label>
                        <Select
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    borderBottom: `2px solid ${
                                        state.isFocused ? '#c19c58' : '#ccc'
                                    }`,
                                    boxShadow: 'none',
                                    borderRadius: 0,
                                    minHeight: 'unset',
                                    height: '36px',
                                    minWidth: '180px',
                                    '&:hover': {
                                        borderBottom: '2px solid #c19c58',
                                    },
                                    cursor: 'pointer',
                                    fontSize: '1.4rem',
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                }),
                                valueContainer: (base) => ({
                                    ...base,
                                    height: '36px',
                                    padding: '0px 8px',
                                }),
                                input: (base) => ({
                                    ...base,
                                    margin: 0,
                                    padding: 0,
                                }),
                                indicatorsContainer: (base) => ({
                                    ...base,
                                    height: '36px',
                                }),
                            }}
                            className={cx('w-full')}
                            options={categories.map((c) => ({
                                value: c._id,
                                label: c.name,
                            }))}
                            defaultValue={
                                data?.category_id?._id
                                    ? {
                                          value: data.category_id._id,
                                          label: data.category_id.name,
                                      }
                                    : null
                            }
                            onChange={(selected) =>
                                setSelectedCategory(selected.value)
                            }
                            placeholder="Chọn danh mục..."
                            isSearchable
                        />
                    </div>
                    <div className={cx('flex-1', 'w-full')}>
                        <p>Mô tả</p>
                        <textarea
                            className={cx('w-full', 'input-desc')}
                            value={description || ''}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <div
                    className={cx(
                        'flex',
                        'items-center',
                        'justify-around',
                        'mt-4',
                    )}
                >
                    <button
                        className={cx('py-2', 'px-4', 'action-btn')}
                        onClick={handleSaveClick}
                    >
                        <span>Lưu</span>
                    </button>
                    <button
                        className={cx('py-2', 'px-4', 'action-btn')}
                        onClick={onClose}
                    >
                        <span>Đóng</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default MenuModal;