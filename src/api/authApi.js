import * as httpRequest from '~/utils/httpRequest';

export const login = async (username, password) => {
    try {
        const response = await httpRequest.post('/auth/login', { username, password });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to login' };
    }
}

// export const register = async (email, password) => {}

export const getCurrentUser = async (token) => {
    try {
        const respone = await httpRequest.get('auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return respone.data;
    } catch (err) {
        console.log('>>> Get current user FALSE: ', err);
        throw err;
    }
};