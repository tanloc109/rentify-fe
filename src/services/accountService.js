import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1/authentication`;

export const login = async (email, password) => {
    try {
        let responseBody = {
            email: email,
            password: password
        }
        const response = await axios({
            method: 'POST',
            url: API_URL + '/login',
            data: responseBody
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
    }
};

export const register = async (body) => {
    try {
        const response = await axios.post(`${API_URL}/register`, body);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
