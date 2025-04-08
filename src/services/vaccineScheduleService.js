import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1/warehouses`;

export const laySoLuongVaccineCanXuat = async (accessToken, doctorId, shift, date) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${API_URL}/reports?doctorId=${doctorId}&shift=${shift}&date=${date}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            return response.data.data;
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
        return [];
    }
}

export const exportVaccine = async (accessToken, doctorId, vaccinesList) => {
    try {
        const response = await axios({
            method: 'POST',
            url: `${API_URL}/export`,
            data: {
                vaccines: vaccinesList,
                doctorId: doctorId
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return true;
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
        return false;
    }
}

export const getVaccinesByCustomer = async ({ accessToken, customerId, pageNo, pageSize }) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${import.meta.env.VITE_BASE_URL}/api/v1/customers/${customerId}/schedules?pageNo=${pageNo}&pageSize=${pageSize}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
        return [];
    }
}

export const getScheduleDetails = async ({ scheduleId, accessToken }) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${import.meta.env.VITE_BASE_URL}/api/v1/schedules/${scheduleId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (response.status === 200) {
            console.log(response.data.data);
            return response.data.data;
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
        return null;
    }
}

export const saveFeedback = async ({ scheduleId, feedback, accessToken }) => {
    try {
        const response = await axios({
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            url: `${import.meta.env.VITE_BASE_URL}/api/v1/customers/schedules/${scheduleId}/feedback`,
            data: {
                feedback: feedback
            }
        })
        toast.success('Cập nhật đánh giá thành công!');
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
    }
}

export const addVaccineReaction = async ({ scheduleId, reaction, accessToken, userFullName }) => {
    try {
        const response = await axios({
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            url: `${import.meta.env.VITE_BASE_URL}/api/v1/customers/schedules/${scheduleId}/reaction`,
            data: {
                reaction: reaction,
                reportedBy: userFullName
            }
        })
        toast.success('Thêm phản ứng thành công!');
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
    }
}

export const updateExistingSchedule = async ({scheduleId, accessToken, newDate}) => {
    try {
        const response = await axios({
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            url: `${import.meta.env.VITE_BASE_URL}/api/v1/schedules/existing/${scheduleId}`,
            params: {
                newDate: newDate
            }
        })
        if(response.status === 200) {
            toast.success('Cập nhật lịch tiêm thành công!');
        }
        return response;
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
    }
}
