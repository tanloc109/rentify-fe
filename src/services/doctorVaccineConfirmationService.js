import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1/schedules`;

export const getDoctorSchedulesToday = async (accessToken, doctorId, date) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${API_URL}/doctor/${doctorId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                date: date
            }
        });

        if (response.status === 200) {
            console.log(response.data.data);
            return response.data.data;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getScheduleDetail = async ({accessToken, scheduleId}) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${API_URL}/${scheduleId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            console.log(response.data.data);
            return response.data.data;
        }
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error);
        return {};
    }
}

export const xacNhanTiem = async (accessToken, doctorId, scheduleId) => {
    try {
        const response = await axios({
            method: 'PUT',
            url: `${API_URL}/doctor/${doctorId}/confirm/${scheduleId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log(response);
        return true;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error);
        return false;
    }
}

export const getDoctorHistorySchedules = async (accessToken, doctorId) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${API_URL}/doctor/${doctorId}/history`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            console.log(response.data.data);
            return response.data.data;
        }

    } catch(error) {
        toast.error(error.response.data.error);
        console.log(error);
    }
}
