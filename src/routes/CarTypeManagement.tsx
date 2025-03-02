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

interface CarType {
    id?: number;
    name: string;
    description: string;
}

const CarTypeManagement: React.FC = () => {
    const [carTypes, setCarTypes] = useState<CarType[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<CarType>({ name: "", description: "" });
    const [editId, setEditId] = useState<number | null>(null);

    useEffect(() => {
        fetchCarTypes();
    }, []);

    const fetchCarTypes = async () => {
        try {
            const response = await axios.get("http://localhost:8080/rentify/api/types");
            setCarTypes(response.data.data);
        } catch (error) {
            console.error("Error fetching car types", error);
        }
    };

    const handleOpen = (carType: CarType | null = null) => {
        if (carType) {
            setFormData(carType);
            setEditId(carType.id || null);
        } else {
            setFormData({ name: "", description: "" });
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
                await axios.put(`http://localhost:8080/rentify/api/types/${editId}`, formData);
            } else {
                await axios.post("http://localhost:8080/rentify/api/types", formData);
            }
            fetchCarTypes();
            handleClose();
        } catch (error) {
            console.error("Error saving car type", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/rentify/api/types/${id}`);
            fetchCarTypes();
        } catch (error) {
            console.error("Error deleting car type", error);
        }
    };

    return (
        <Box margin={4}>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ marginBottom: 2 }}>Add Car Type</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Car Type Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {carTypes.map((type) => (
                            <TableRow key={type.id}>
                                <TableCell>{type.name}</TableCell>
                                <TableCell>{type.description}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(type)} color="primary">Edit</Button>
                                    <Button onClick={() => handleDelete(type.id!)} color="error">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editId ? "Edit Car Type" : "Add Car Type"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Car Type Name"
                        type="text"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        value={formData.description}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CarTypeManagement;
