import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1/combos`;

export const getCombos = async (accessToken, params) => {
    try {
        const response = await axios({
            method: 'GET',
            url: API_URL + '',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            // params: params
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}
export const getCombosV2 = async (accessToken, pageNo = 1, pageSize = 12, sortBy = "id") => {
    try {
        const response = await axios({
            method: 'GET',
            url: API_URL,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            // params: { pageNo, pageSize, sortBy }
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getCombosActive = async (accessToken) => {
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

export const searchCombos = async (accessToken, params) => {

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

export const createCombo = async (accessToken, params) => {
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

export const updateCombo = async (accessToken, params, vaccineComboID) => {
    try {
        const response = await axios({
            method: 'PUT',
            url: API_URL + `/${vaccineComboID}`,
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

export const undeleteVaccineCombo = async (accessToken, vaccineComboID) => {
    try {
        const response = await axios({
            method: 'POST',
            url: API_URL + `/${vaccineComboID}/restore`,
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

export const deleteVaccineCombo = async (accessToken, vaccineComboID) => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: API_URL + `/${vaccineComboID}`,
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