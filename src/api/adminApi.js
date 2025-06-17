import * as httpRequest from '~/utils/httpRequest';

export const getAllUsers = async () => {
    try {
        const response = await httpRequest.get('/admin/users');
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const getRevenue = async (from, to) => {
    try {
        const response = await httpRequest.get(`/admin/revenue?from=${from}&to=${to}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getRevenueByDay = async (from, to) => {
    try {
        const response = await httpRequest.get(`/admin/revenue-by-day?from=${from}&to=${to}`);
        return response.data;
    } catch (err) {
        console.error(err);
    }
}

export const getRevenueByMonth = async () => {
    try {
        const response = await httpRequest.get('/admin/revenue-by-month');
        return response.data;
    } catch (err) {
        console.error(err);
    }
}

export const getPopularItem = async (limit) => {
    try {
        const response = await httpRequest.get(`/admin/popular-item?limit=${limit}`);
        return response.data;
    } catch (err) {
        console.error(err);
    }
}