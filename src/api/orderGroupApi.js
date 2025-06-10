import * as httpRequest from '~/utils/httpRequest';

export const getOrderGroups = async () => {
    try {
        const response = await httpRequest.get('/order-groups');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get order groups' };
    }
}

export const updateOrderGroup = async (id, orderGroup) => {
    try {
        const response = await httpRequest.put(`/order-groups/${id}`, orderGroup);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to update order group' };
    }
}

// export const getOrderGroupById = async (id) => {
//     try {
//         const response = await httpRequest.get(`/order-groups/${id}`);
//         return response;
//     } catch (error) {
//         throw error.response ? error.response.data : { message: '>>> Fail to get order group by id' };
//     }
// }