import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1/transactions`;

export const transactionParams = [
    ["id", "ID"],
    ["date", "Ngày"],
    ["doctorName", "Tên bác sĩ"],
    ["batches", "Danh sách batch"],
];

export const getTransactions = async (
    {
        accessToken,
        filters,
        pageNo,
        pageSize,
        params,
        sortBy
    }
) => {
    let stringMappedParams = params.map(p => p.trim()).join(",");
    try {
        let url = `${API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&params=${stringMappedParams}&${filters}`;
        // console.log(`GET ${url}`);
        const response = await axios({
            method: 'GET',
            url: url,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Unable to get vaccines');
        throw error;
    }
}

export const addTransaction = async ({accessToken, quantityTaken, remaining, date, doctorId, vaccineId}) => {
    try {
        let responseBody = {
            quantityTaken: quantityTaken,
            remaining: remaining,
            date: date,
            doctorId: doctorId,
            vaccineId: vaccineId
        }
        const response = await axios({
            method: 'POST',
            url: API_URL,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: responseBody
        });
        if (response.status === 201) {
            toast.success('Thêm transaction thành công');
            return;
        }
        toast.error('Thêm transaction thất bại');
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
        toast.error(error.response.data.error);
    }
}

export const editTransaction = async ({
    accessToken,
    transactionId,
    remaining,
    date,
    doctorId
 }) => {
    try {
        let responseBody = {
            remaining: remaining,
            date: date,
            doctorId: doctorId
        }

        const response = await axios({
            method: 'PUT',
            url: `${API_URL}/${transactionId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: responseBody
        });

        if (response.status === 200) {
            toast.success('Sửa lô thành công');
            return;
        }
        toast.error('Sửa lô thất bại');
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    }
}

export const deleteTransaction = async ({ accessToken, transactionId }) => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: `${API_URL}/${transactionId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (response.status === 200) {
            toast.success('Xóa transaction thành công');
            return;
        }
        toast.error('Xóa transaction thất bại');
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    }
}