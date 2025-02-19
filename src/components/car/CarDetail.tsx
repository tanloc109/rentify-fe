import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, CardMedia, CardContent, Typography, Grid, Chip, Divider, Box } from "@mui/material";
import { AttachMoney, Person, DirectionsCar, LocationOn, CheckCircle, Cancel } from "@mui/icons-material";

interface Car {
    id: number;
    name: string;
    description: string;
    image: string;
    plateLicense: string;
    yearOfManufacture: number;
    seat: number;
    pricePerDay: number;
    deposit: number;
    location: string;
    carStatus: string;
    owner: {
        fullName: string;
        email: string;
        phoneNumber: string;
    };
    brand: {
        name: string;
    };
    carType: {
        name: string;
    };
}

const CarDetail: React.FC = () => {
    const { id } = useParams();
    const [car, setCar] = useState<Car | null>(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/rentify/api/cars/${id}`)
            .then((response) => setCar(response.data.data))
            .catch((error) => console.error("Error fetching car details:", error));
    }, [id]);

    if (!car) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Card sx={{ display: "flex", p: 2, borderRadius: 3, boxShadow: 5, height: "auto" }}>
                {/* Car Image */}
                {/* <CardMedia
                    component="img"
                    sx={{ width: "40%", height: 250, borderRadius: 2 }}
                    image={car.image}
                    alt={car.name}
                /> */}

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3 }}>
                    <CardMedia
                        component="img"
                        sx={{ width: "100%", height: 250, borderRadius: 2 }}
                        image={car.image}
                        alt={car.name}
                    />
                </Box>

                {/* Car Details */}
                <CardContent sx={{ flex: 1, paddingLeft: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h4" fontWeight="bold">
                            {car.name}
                        </Typography>
                        <Chip
                            label={car.carStatus}
                            color={car.carStatus === "AVAILABLE" ? "success" : "error"}
                            icon={car.carStatus === "AVAILABLE" ? <CheckCircle /> : <Cancel />}
                            sx={{ fontSize: "1rem", fontWeight: "bold" }}
                        />
                    </Box>

                    <Typography variant="h6" color="text.secondary" mb={2}>
                        {car.description}
                    </Typography>

                    {/* Car Details Grid */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                <DirectionsCar /> Brand:
                            </Typography>
                            <Typography variant="body2">{car.brand.name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                🚗 Type:
                            </Typography>
                            <Typography variant="body2">{car.carType.name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                🏷️ Plate License:
                            </Typography>
                            <Typography variant="body2">{car.plateLicense}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                📆 Year:
                            </Typography>
                            <Typography variant="body2">{car.yearOfManufacture}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                🚘 Seats:
                            </Typography>
                            <Typography variant="body2">{car.seat} seats</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                <LocationOn /> Location:
                            </Typography>
                            <Typography variant="body2">{car.location}</Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Pricing */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="h5" fontWeight="bold" color="primary">
                                <AttachMoney /> {car.pricePerDay.toLocaleString()} VND/day
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6" fontWeight="bold" color="secondary">
                                Deposit: {car.deposit.toLocaleString()} VND
                            </Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Owner Info */}
                    <Typography variant="h5" fontWeight="bold" mb={1}>
                        <Person /> Owner Information
                    </Typography>
                    <Typography variant="body1">{car.owner.fullName}</Typography>
                    <Typography variant="body2">📧 {car.owner.email}</Typography>
                    <Typography variant="body2">📞 {car.owner.phoneNumber}</Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default CarDetail;
