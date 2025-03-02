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

interface Brand {
    id: number;
    name: string;
    country: string;
}

const BrandManagement: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Omit<Brand, "id">>({ name: "", country: "" });
    const [editId, setEditId] = useState<number | null>(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await axios.get("http://localhost:8080/rentify/api/brands");
            setBrands(response.data.data);
        } catch (error) {
            console.error("Error fetching brands", error);
        }
    };

    const handleOpen = (brand: Brand | null = null) => {
        if (brand) {
            setFormData({ name: brand.name, country: brand.country });
            setEditId(brand.id);
        } else {
            setFormData({ name: "", country: "" });
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
                await axios.put(`http://localhost:8080/rentify/api/brands/${editId}`, formData);
            } else {
                await axios.post("http://localhost:8080/rentify/api/brands", formData);
            }
            fetchBrands();
            handleClose();
        } catch (error) {
            console.error("Error saving brand", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/rentify/api/brands/${id}`);
            fetchBrands();
        } catch (error) {
            console.error("Error deleting brand", error);
        }
    };

    return (
        <Box margin={4}>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ marginBottom: 2 }}>
                Add New Brand
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Brand Name</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {brands.map((brand) => (
                            <TableRow key={brand.id}>
                                <TableCell>{brand.name}</TableCell>
                                <TableCell>{brand.country}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(brand)} color="primary">Edit</Button>
                                    <Button onClick={() => handleDelete(brand.id)} color="error">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editId ? "Edit Brand" : "Add New Brand"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Brand Name"
                        type="text"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="country"
                        label="Country"
                        type="text"
                        fullWidth
                        value={formData.country}
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

export default BrandManagement;
