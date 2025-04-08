import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1/vaccines`;

export const getVaccines = async (accessToken, currentPage = 1, pageSize = 12) => {
    try {
        const response = await axios({
            method: 'GET',
            url: API_URL + '/active',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            // params: { currentPage, pageSize }
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getVaccinesV2 = async (accessToken, params) => {
    try {
        const response = await axios({
            method: 'GET',
            url: API_URL + '/active',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: params
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getVaccinesNoPaging = async (accessToken, params) => {
    try {
        const response = await axios({
            method: 'GET',
            url: API_URL + '/non-paging',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: params
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const searchVaccines = async (accessToken, params) => {

    try {
        const response = await axios({
            method: 'GET',
            url: API_URL + '/search',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: params,
        });

        return response;

    } catch (error) {
        console.log(error);
        return error.response;
    }
}

export const getVaccinesActive = async (accessToken) => {
    try {
        const response = await axios({
            method: 'GET',
            url: API_URL + '/active',
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

export const createVaccine = async (accessToken, params) => {
    try {
        const response = await axios({
            method: 'POST',
            url: API_URL + '',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: params
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            console.error("Error response from server:", error.response.data);
            return error.response.data;
        } else {
            console.error("Unexpected error:", error);
            return { status: "Fail", message: "Unexpected error occurred.", data: null };
        }
    }
}

export const updateVaccine = async (accessToken, params, vaccineID) => {
    try {
        const response = await axios({
            method: 'PUT',
            url: API_URL + `/${vaccineID}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: params
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            console.error("Error response from server:", error.response.data);
            return error.response.data;
        } else {
            console.error("Unexpected error:", error);
            return { status: "Fail", message: "Unexpected error occurred.", data: null };
        }
    }
}

export const undeleteVaccine = async (accessToken, vaccineID) => {
    try {
        const response = await axios({
            method: 'POST',
            url: API_URL + `/${vaccineID}/restore`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            return response.data.data;
        }
    } catch (error) {
        if (error.response) {
            console.error("Error response from server:", error.response.data);
            return error.response.data;
        } else {
            console.error("Unexpected error:", error);
            return { status: "Fail", message: "Unexpected error occurred.", data: null };
        }
    }
}

export const deleteVaccine = async (accessToken, vaccineID) => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: API_URL + `/${vaccineID}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            return response.data.data;
        }
    } catch (error) {
        if (error.response) {
            console.error("Error response from server:", error.response.data);
            return error.response.data;
        } else {
            console.error("Unexpected error:", error);
            return { status: "Fail", message: "Unexpected error occurred.", data: null };
        }
    }
}