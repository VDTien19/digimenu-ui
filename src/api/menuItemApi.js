import * as httpRequest from '~/utils/httpRequest';

export const addMenuItem = async (menuItem) => {
    try {
        const response = await httpRequest.post('/menu-items/add', menuItem);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to add menu item.' };
    }
}

export const getMenuItems = async () => {
    try {
        const response = await httpRequest.get('/menu-items');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get menu items' };
    }
}

export const getMenuItemById = async (id) => {
    try {
        const response = await httpRequest.get(`/menu-items/${id}`);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get menu item by id' };
    }
}

export const getMenuByCategory = async () => {
    try {
        const response = await httpRequest.get('/menu-items/grouped-by-category');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get menu by category' };
    }
}

export const getMenuItemsByCategoryId = async (categoryId) => {
    try {
        const response = await httpRequest.get(`/menu-items/category/${categoryId}`);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get menu items by category' };
    }
}

export const updateMenuItem = async (id, menuItem) => {
    try {
        const response = await httpRequest.put(`/menu-items/update/${id}`, menuItem);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to update menu item' };
    }
}

export const deleteMenuItem = async (id) => {
    try {
        const response = await httpRequest.deleted(`/menu-items/delete/${id}`);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to delete menu item' };
    }
}