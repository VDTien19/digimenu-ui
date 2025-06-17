import * as httpRequest from '~/utils/httpRequest';

export const getOrderGroups = async () => {
    try {
        const response = await httpRequest.get('/order-groups');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get order groups' };
    }
}

export const getOrderGroupPayYet = async () => {
    try {
        const response = await httpRequest.get('/order-groups?payment_status=Ch%C6%B0a%20thanh%20to%C3%A1n');
        return response;
    } catch (error) {
        console.log(error)
    }
}

export const cashPay = async (id, orderGroup) => {
    try {
        const response = await httpRequest.put(`/order-groups/${id}/pay`, orderGroup);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to update order group' };
    }
}

export const getOrderGroupById = async (id) => {
    try {
        const response = await httpRequest.get(`/order-groups/${id}`);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get order group by id' };
    }
}

export const getOrderGroupByTable = async (name) => {
    try {
        const response = await httpRequest.get(`/order-groups/table/${name}`);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get order group by table name' };
    }
}

export const QROrderGroup = async (id) => {
    try {
        const response = await httpRequest.post(`/order-groups/${id}/create-qr`);
        return response.data;
    } catch (err) {
        throw err.response;
    }
}