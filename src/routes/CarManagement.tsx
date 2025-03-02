import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
} from "@mui/material";

interface Car {
    id?: number;
    name: string;
    description: string;
    image: string;
    plateLicense: string;
    yearOfManufacture: number;
    seat: number;
    pricePerDay: number;
    deposit: number;
    location: string;
    ownerId: number;
    brandId: number;
    carTypeId: number;
}

const CarManagement: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<Car>({
        name: "",
        description: "",
        image: "",
        plateLicense: "",
        yearOfManufacture: 0,
        seat: 0,
        pricePerDay: 0,
        deposit: 0,
        location: "",
        ownerId: 0,
        brandId: 0,
        carTypeId: 0,
    });
    const [editId, setEditId] = useState<number | null>(null);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await axios.get("http://localhost:8080/rentify/api/cars");
            setCars(response.data.data);
        } catch (error) {
            console.error("Error fetching cars", error);
        }
    };

    const handleOpen = (car: Car | null = null) => {
        if (car) {
            setFormData(car);
            setEditId(car.id || null);
        } else {
            setFormData({
                name: "",
                description: "",
                image: "",
                plateLicense: "",
                yearOfManufacture: 0,
                seat: 0,
                pricePerDay: 0,
                deposit: 0,
                location: "",
                ownerId: 0,
                brandId: 0,
                carTypeId: 0,
            });
            setEditId(null);
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (editId) {
                await axios.put(`http://localhost:8080/rentify/api/cars/${editId}`, formData);
            } else {
                await axios.post("http://localhost:8080/rentify/api/cars", formData);
            }
            fetchCars();
            handleClose();
        } catch (error) {
            console.error("Error saving car", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/rentify/api/cars/${id}`);
            fetchCars();
        } catch (error) {
            console.error("Error deleting car", error);
        }
    };

    return (
        <Box margin={4}>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ marginBottom: 2 }}>Add New Car</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Car Name</TableCell>
                            <TableCell>License Plate</TableCell>
                            <TableCell>Rental Price</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cars.map((car) => (
                            <TableRow key={car.id}>
                                <TableCell>{car.name}</TableCell>
                                <TableCell>{car.plateLicense}</TableCell>
                                <TableCell>{car.pricePerDay.toLocaleString()} VND</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(car)} color="primary">Edit</Button>
                                    <Button onClick={() => handleDelete(car.id!)} color="error">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editId ? "Edit Car" : "Add New Car"}</DialogTitle>
                <DialogContent>
                    {Object.keys(formData).map((key) => (
                        <TextField
                            key={key}
                            margin="dense"
                            name={key}
                            label={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                            type={typeof formData[key as keyof Car] === "number" ? "number" : "text"}
                            fullWidth
                            value={formData[key as keyof Car]}
                            onChange={handleChange}
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CarManagement;