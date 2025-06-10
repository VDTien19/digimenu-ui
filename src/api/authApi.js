import * as httpRequest from '~/utils/httpRequest';

export const login = async (email, password) => {
    try {
        const response = await httpRequest.post('/auth/login', { email, password });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to login' };
    }
}

// export const register = async (email, password) => {}

export const getCurrentUser = async () => {
    try {
        const response = await httpRequest.get('/auth/me');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get current user' };
    }
}