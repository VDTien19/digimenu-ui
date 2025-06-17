import * as httpRequest from '~/utils/httpRequest';

export const addCategory = async (category) => {
    try {
        const response = await httpRequest.post('/categories/add', category);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to add category' };
    }
}

export const getCategories = async () => {
    try {
        const response = await httpRequest.get('/categories/all');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get categories' };
    }
}

export const getCategoryById = async (id) => {
    try {
        const response = await httpRequest.get(`/categories/get/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get category by id' };
    }
}

export const updateCategory = async (id, category) => {
    try {
        const response = await httpRequest.put(`/categories/update/${id}`, category);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to update category' };
    }
}

export const deleteCategory = async (id) => {
    try {
        const response = await httpRequest.deleted(`/categories/delete/${id}`);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to delete category' };
    }
}