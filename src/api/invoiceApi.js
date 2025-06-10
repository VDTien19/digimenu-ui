import * as httpRequest from '~/utils/httpRequest';

export const getInvoices = async () => {
    try {
        const response = await httpRequest.get('/invoices');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get invoices' };
    }
}

export const getInvoiceById = async (id) => {
    try {
        const response = await httpRequest.get(`/invoices/${id}`);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: '>>> Fail to get invoice by id' };
    }
}