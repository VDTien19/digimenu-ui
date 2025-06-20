const routes = {
    // Home page: digital menu ordering system introduction
    home: '/',
    login: '/:slug/login',

    // Client routes
    client_home: '/:slug',  // query theo tên bàn
    client_menu: '/:slug/menu/:tableName',
    client_message: '/:slug/status/:tableName',
    client_payment: '/:slug/payment/:tableName',
    client_cart: '/:slug/cart/:tableName',
    client_invoice: '/:slug/invoice',
    // client_invoice_detail: '/:slug/invoice/:invoiceId',

    // Admin routes
    admin_dashboard: '/:slug/admin',
    admin_analyst: '/:slug/admin/analyst',
    admin_category: '/:slug/admin/category',
    admin_introduce: '/:slug/admin/introduce',
    admin_menu: '/:slug/admin/menu',
    admin_staff: '/:slug/admin/staff',
    admin_table: '/:slug/admin/table',
    // admin_login: '/:slug/admin/login',
    admin_settings: '/:slug/admin/settings',
    admin_payment_method: '/:slug/admin/payment-method',

    // Service routes
    // service_home: '/:slug/service',
    service_category: '/:slug/service/category',
    service_menu: '/:slug/service/menu',
    service_table: '/:slug/service/table',
    service_order: '/:slug/service',
    service_payment: '/:slug/service/payment',
    // service_login: '/:slug/service/login',
};

export default routes;