import * as httpRequest from '~/utils/httpRequest';

export const addOrder = async (order) => {
    try {
        const response = await httpRequest.post('/orders/add', order);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to add order.' };
    }
}

export const getOrdersPending = async () => {
    try {
        const response = await httpRequest.get('/orders/pending');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get pending orders' };
    }
}

export const approveOrder = async (id) => {
    try {
        const response = await httpRequest.put(`/orders/${id}/approve`);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to approve order' };
    }
}

export const getOrders = async () => {
    try {
        const response = await httpRequest.get('/orders');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get orders' };
    }
}