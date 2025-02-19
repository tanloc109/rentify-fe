import axios from "axios";
import { Car } from "../../interface/Car";

const API_URL = "http://localhost:8080/rentify/api/cars";

export const fetchCars = async (): Promise<Car[]> => {
    try {
        const response = await axios.get<{ data: Car[] }>(API_URL);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching cars:", error);
        return [];
    }
};

export const fetchCarById = async (id: number): Promise<Car | null> => {
    try {
        const response = await axios.get<{ data: Car }>(`${API_URL}/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching car details:", error);
        return null;
    }
};
