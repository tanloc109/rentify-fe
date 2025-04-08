import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1/customers`;

export const getChildrenByCustomerId = async (accessToken, customerId) => {
    try {
        const response = await axios({
            method: 'GET',
            url: API_URL + `/${customerId}/children`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getOrderHistoryByCustomerId = async (accessToken, customerId) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${import.meta.env.VITE_BASE_URL}/api/v1/orders/history/${customerId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(response.data.data);

        if (response.status === 200) {
            return response.data.data;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}