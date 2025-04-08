import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1/orders`;

export const getOrderSummary = async (accessToken) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${API_URL}/summary`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            return response.data.data;
        }
    } catch (error) {
        console.error("Error fetching order summary:", error);
        return null;
    }
};

export const getRevenueData = async (accessToken) => {
    try {
        const response = await axios.get(`${API_URL}/revenue`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 200) {
            console.log("Revenue data:", response.data.data);
            return response.data.data;
        }
    } catch (error) {
        console.error("Error fetching revenue data:", error.response?.data || error.message);
        return null;
    }
};

