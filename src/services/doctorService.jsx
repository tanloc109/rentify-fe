import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1/doctors`;

export const getAllDoctors = async (accessToken) => {
    try {
        const response = await axios({
            method: 'GET',
            url: API_URL + '',
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