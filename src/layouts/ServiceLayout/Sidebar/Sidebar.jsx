import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faChartBar, faUtensils, faTableList, faCartArrowDown, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons'

import config from '~/config';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import { useSlug } from '~/contexts/SlugContext';
import Image from '~/components/Images';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    // {
    //     title: 'Dashboard',
    //     to: config.routes.service_home,
    //     icon: <FontAwesomeIcon icon={faHouse} />
    // },
    {
        title: 'Quản lý đơn hàng',
        to: config.routes.service_order,
        icon: <FontAwesomeIcon icon={faCartArrowDown} />
    }, 
    {
        title: 'Quản lý thanh toán',
        to: config.routes.service_payment,
        icon: <FontAwesomeIcon icon={faMoneyCheckDollar} />
    }, 
    {
        title: 'Quản lý bàn',
        to: config.routes.service_table,
        icon: <FontAwesomeIcon icon={faTableList} />
    },
    {
        title: 'Quản lý loại danh mục',
        to: config.routes.service_category,
        icon: <FontAwesomeIcon icon={faChartBar} />
    },
    {
        title: 'Quản lý sản phẩm',
        to: config.routes.service_menu,
        icon: <FontAwesomeIcon icon={faUtensils} />
    }
];

function Sidebar() {

    const { slug } = useSlug();

    return (
        <aside className={cx('wrapper', 'bg-white')}>
            {/* <div className="flex justify-end mb-4 lg:hidden">
                <button onClick={closeSidebar} className="text-gray-600 text-2xl font-bold">
                    ✕
                </button>
            </div> */}

            <div className={cx('sidebar-header', 'flex', 'flex-col', 'items-center', 'justify-center', 'mb-8')} onClick={(e) => e.stopPropagation()}>
                <Image src='a' alt="Logo" className={cx('image-url', 'w-50', 'h-50', 'rounded-full', 'object-cover')} />
                <p className={cx('text-3xl', 'mt-4', 'font-medium', '')}>Admin</p>
                <p className={cx('text-xl', 'text-gray-500')}>@slug</p>
            </div>

            <Menu>
                {MENU_ITEMS.map((item, index) => (
                    <MenuItem
                        key={index}
                        title={item.title}
                        to={item.to.replace(':slug', slug)}
                        icon={item.icon}
                    />
                ))}
            </Menu>
        </aside>
    );
}

export default Sidebar;
