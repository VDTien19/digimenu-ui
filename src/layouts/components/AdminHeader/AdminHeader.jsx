import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './AdminHeader.module.scss';
import { BarIcon, LogoutIcon, SettingIcon } from '~/components/Icons';
import AdminSearch from '../AdminSearch';
import { Link } from 'react-router-dom';
import config from '~/config';
import { useAuth } from '~/contexts/AuthContext';
import ConfirmModal from '~/components/ConfirmModal';
import { toast } from 'react-hot-toast';

const cx = classNames.bind(styles);

function AdminHeader ({ onToggleSidebar }) {
    // const location = useLocation();
    // const isCategory = location.pathname.includes('/admin/category');
    // const isMenu = location.pathname.includes('/admin/menu');
    // const isTable = location.pathname.includes('/admin/table');
    // const isStaff = location.pathname.includes('/admin/staff');
    const isSetting = location.pathname.includes('/admin/settings');

    const [showModal, setShowModal] = useState(false);

    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        toast('Đăng xuất thành công.')
        setShowModal(false);
    }

    return (
        <div className={cx('wrapper', 'w-full', 'h-24', 'bg-transparent', 'flex', 'items-center', 'justify-between')}>
            <button className={cx('lg:hidden', 'cursor-pointer')} onClick={onToggleSidebar}>
                <BarIcon width='2.4rem' height='2.4rem' className={cx('bar-icon', 'rotate-90')} />
            </button>
            {/* {(isCategory || isMenu || isTable || isStaff) && (
                <div className={cx('search', 'flex-1', 'mx-8', 'lg:ml-0')}>
                    <AdminSearch />
                </div>
            )} */}
            <div className={cx('search', 'flex-1', 'mx-8', 'lg:ml-0', { "hidden-f": isSetting })}>
                <AdminSearch />
            </div>
            <button className={cx('setting-icon', 'cursor-pointer', 'lg:hidden')} >
                <Link to={config.routes.admin_settings}><SettingIcon /></Link>
            </button>
            <button className={cx('p-4', 'cursor-pointer')} onClick={() => setShowModal(true)} >
                <LogoutIcon />
            </button>

            <ConfirmModal message='Bạn chắc chắn muốn đăng xuất?' isOpen={showModal} onConfirm={handleLogout} onClose={() => setShowModal(false)} />
        </div>
    );
}

export default AdminHeader;
