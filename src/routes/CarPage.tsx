import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { fetchCars } from "../components/car/action";
import { Car } from "../interface/Car";
import CarList from "../components/car/CarList";

const CarPage: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        fetchCars().then(setCars);
    }, []);

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" margin="20px" gutterBottom>
                Available Cars
            </Typography>
            <CarList cars={cars} />
        </Container>
    );
};

export default CarPage;
