import * as httpRequest from '~/utils/httpRequest';

export const getTables = async () => {
    try {
        const response = await httpRequest.get('/tables');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get tables' };
    }
}

export const getTableById = async (id) => {
    try {
        const response = await httpRequest.get(`/tables/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get table by id' };
    }
}

export const addTable = async (table) => {
    try {
        const response = await httpRequest.post('/tables/add', table);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to add table' };
    }
}

export const updateTable = async (id, table) => {
    try {
        const response = await httpRequest.put(`/tables/update/${id}`, table);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to update table' };
    }
}

export const deleteTable = async (id) => {
    try {
        const response = await httpRequest.deleted(`/tables/delete/${id}`);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to delete table' };
    }
}

export const getTableWithOrders = async (id) => {
    try {
        const response = await httpRequest.get(`/tables/${id}/orders`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get table with orders' };
    }
}

export const getTableByName = async (name) => {
    try {
        const response = await httpRequest.get(`/tables/name/${name}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get table by name' };
    }
}