import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1/batches`;

export const batchParams = [
    ["id", "ID"],
    ["batchCode", "Mã lô"],
    ["batchSize", "SL tổng"],
    ["quantity", "SL còn lại"],
    ["expiration", "Hết hạn"],
    ["imported", "Nhập"],
    ["manufactured", "Sản xuất"],
    ["distributer", "Phân phối"],
    ["vaccineId", "ID vaccine"],
    ["vaccineName", "Tên vaccine"],
    ["vaccineDescription", "Mô tả vaccine"],
    ["vaccineCode", "Mã vaccine"],
    ["vaccineManufacturer", "NSX vaccine"],
    ["vaccinePrice", "Giá vaccine"],
    ["vaccineExpiresInDays", "Số ngày hết hạn vaccine"],
    ["vaccineMinAge", "Tuổi tối thiểu"],
    ["vaccineMaxAge", "Tuổi tối đa"],
    ["vaccineDose", "Liều lượng"]
];

export const getBatches = async (
    {
        accessToken,
        filters,
        pageNo,
        pageSize,
        sortBy
    }
) => {
    try {
        let url = `${API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&${filters}`;
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

export const getVaccines = async ({ accessToken }) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${import.meta.env.VITE_BASE_URL}/api/v1/vaccines/v2`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Unable to get vaccines');
        throw error;
    }
}

export const addBatch = async (accessToken, { batchCode, vaccineId, batchSize, manufactured, distributer }) => {
    try {
        let responseBody = {
            batchCode: batchCode,
            vaccineId: vaccineId,
            batchSize: batchSize,
            manufactured: manufactured,
            distributer: distributer
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
            toast.success('Thêm lô thành công');
            return;
        }
        toast.error('Thêm lô thất bại');
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    }
}

export const editBatch = async ({ accessToken, batchId, batchCode, quantity, batchSize, imported, expiration, vaccineId, manufactured, distributer }) => {
    try {
        let responseBody = {
            batchCode: batchCode,
            vaccineId: vaccineId,
            quantity: quantity,
            batchSize: batchSize,
            imported: imported,
            manufactured: manufactured,
            expiration: expiration,
            distributer: distributer
        }

        const response = await axios({
            method: 'PUT',
            url: `${API_URL}/${batchId}`,
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

export const deleteBatch = async ({ accessToken, batchId }) => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: `${API_URL}/${batchId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (response.status === 200) {
            toast.success('Xóa lô thành công');
            return;
        }
        toast.error('Xóa lô thất bại');
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    }
}