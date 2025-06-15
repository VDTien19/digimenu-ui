import * as httpRequest from '~/utils/httpRequest';

export const getRestaurants = async () => {
    try {
        const response = await httpRequest.get('/restaurants');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get restaurants' };
    }
}

export const getRestaurantBySlug = async ({ slug }) => {
    try {
        const response = await httpRequest.get(`/restaurants?${slug}`);
        // console.log(`Fetched restaurant by slug:`, response.data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get restaurant info' };
    }
}