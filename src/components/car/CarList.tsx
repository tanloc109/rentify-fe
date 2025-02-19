import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { Car } from "../../interface/Car";

interface CarListProps {
    cars: Car[];
}

const CarList: React.FC<CarListProps> = ({ cars }) => {
    const navigate = useNavigate();

    return (
        <Grid container spacing={3} mb={3}>
            {cars.map((car) => (
                <Grid item xs={12} sm={6} md={4} key={car.id}>
                    <Card onClick={() => navigate(`/cars/${car.id}`)} sx={{ cursor: "pointer" }}>
                        <CardMedia component="img" height="200" image={car.image} alt={car.name} />
                        <CardContent>
                            <Typography variant="h6">{car.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {car.description}
                            </Typography>
                            <Typography variant="h6" color="primary" mt={1}>
                                {car.pricePerDay.toLocaleString()} VND/day
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Location: {car.location}
                            </Typography>
                            <Typography
                                variant="body2"
                                color={car.carStatus === "AVAILABLE" ? "success.main" : "error.main"}
                                fontWeight="bold"
                                mt={1}
                            >
                                {car.carStatus}
                            </Typography>
                            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Rent Now
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default CarList;
