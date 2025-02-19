import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    TextField, Button, Typography, Box,
    Container, CircularProgress, MenuItem, Select, InputLabel, FormControl,
    SelectChangeEvent
} from '@mui/material';
import { showToast, TimeDisplayed } from '../components/common/Toast.tsx';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: 'RENTER',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});

    const validate = () => {
        let tempErrors: Record<string, string | undefined> = {};
        if (!formData.fullName) tempErrors.fullName = 'Full name is required';
        if (!formData.email) tempErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) tempErrors.email = 'Invalid email format';
        if (!formData.phoneNumber) tempErrors.phoneNumber = 'Phone number is required';
        if (!formData.password) tempErrors.password = 'Password is required';
        else if (formData.password.length < 8) tempErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/rentify/api/auth/register`, formData);
            showToast({ type: 'success', info: 'Success!', message: 'Registered successfully!', timeDisplayed: TimeDisplayed.LONG });
            navigate('/login');
        } catch (error) {
            showToast({ type: 'error', info: 'Error!', message: error.response?.data?.message || 'Registration failed', timeDisplayed: TimeDisplayed.LONG });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mb: 5 }}>
            <Box display="flex" flexDirection="column" gap={2} mt={5} p={4} boxShadow={3} borderRadius={2}>
                <Typography variant="h4" textAlign="center" fontWeight={600}>Register</Typography>
                <TextField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={!!errors.fullName} helperText={errors.fullName} fullWidth />
                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} fullWidth />
                <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} error={!!errors.phoneNumber} helperText={errors.phoneNumber} fullWidth />
                <TextField label="Password" type="password" name="password" value={formData.password} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)} error={!!errors.password} helperText={errors.password} fullWidth />
                <TextField label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} fullWidth />

                {/* Role Selection Dropdown */}
                <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select name="role" value={formData.role} onChange={(e) => handleChange(e as SelectChangeEvent<string>)}>
                        <MenuItem value="RENTER">Renter</MenuItem>
                        <MenuItem value="HOST">Host</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading} fullWidth>
                    {loading ? <CircularProgress size={24} /> : 'Register'}
                </Button>
            </Box>
        </Container>
    );
};

export default RegisterPage;
