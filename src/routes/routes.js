import config from '~/config';

// page
import { Category, Dashboard, Introduce, Menu as AdminMenu, Staff, Table, Setting, Analyst, PaymentMethod } from '~/pages/admin';
import { Cart, Home as ClientHome, Invoice, Menu as ClientMenu, Message, Payment as ClientPayment } from '~/pages/client';
import { Home as ServiceHome, Orders, Payment as ServicePayment } from '~/pages/service';
import Home from '~/pages/Home';
import Login from '~/pages/Login';

// layout
import HeaderOnly from '~/layouts/HeaderOnly';
import FooterOnly from '~/layouts/FooterOnly';

const publicRoutes = [
    // Public routes
    { path: config.routes.home, component: Home, layout: null },
    { path: config.routes.login, component: Login, layout: null, guestOnly: true },
    // { path: config.routes.admin_login, component: Login, layout: null },
    // { path: config.routes.service_login, component: Login, layout: null },

    // Client routes
    { path: config.routes.client_home, component: ClientHome, layout: FooterOnly },
    { path: config.routes.client_menu, component: ClientMenu },
    { path: config.routes.client_message, component: Message },
    { path: config.routes.client_payment, component: ClientPayment, layout: FooterOnly },
    { path: config.routes.client_cart, component: Cart, layout: FooterOnly },
    { path: config.routes.client_invoice, component: Invoice },
];

const privateRoutes = [
    // Admin routes
    { path: config.routes.admin_dashboard, component: Dashboard, layout: 'admin', roleRequired: 'admin' },
    { path: config.routes.admin_analyst, component: Analyst, layout: 'admin', roleRequired: 'admin' },
    { path: config.routes.admin_category, component: Category, layout: 'admin', roleRequired: 'admin' },
    { path: config.routes.admin_introduce, component: Introduce, layout: 'admin', roleRequired: 'admin' },
    { path: config.routes.admin_menu, component: AdminMenu, layout: 'admin', roleRequired: 'admin' },
    { path: config.routes.admin_staff, component: Staff, layout: 'admin', roleRequired: 'admin' },
    { path: config.routes.admin_table, component: Table, layout: 'admin', roleRequired: 'admin' },
    { path: config.routes.admin_settings, component: Setting, layout: 'admin', roleRequired: 'admin' },
    { path: config.routes.admin_payment_method, component: PaymentMethod, layout: 'admin', roleRequired: 'admin' },

    // Service (staff) routes
    { path: config.routes.service_home, component: ServiceHome, layout: 'staff', roleRequired: 'staff' },
    { path: config.routes.service_order, component: Orders, layout: 'staff', roleRequired: 'staff' },
    { path: config.routes.service_payment, component: ServicePayment, layout: 'staff', roleRequired: 'staff' },
    { path: config.routes.service_table, component: Table, layout: 'staff', roleRequired: 'staff' },
    { path: config.routes.service_menu, component: AdminMenu, layout: 'staff', roleRequired: 'staff' },
    { path: config.routes.service_category, component: Category, layout: 'staff', roleRequired: 'staff' },
];


export { publicRoutes, privateRoutes }