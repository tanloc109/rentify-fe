import { Box, Typography, TextField, Button, Grid, Container } from "@mui/material";
import { LocationOn, Email, Phone } from "@mui/icons-material";

const ContactPage = () => {
    return (
        <Container maxWidth="md" sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                Contact Us
            </Typography>
            <Typography variant="h6" color="textSecondary" mb={4}>
                Have questions or need assistance? Reach out to us!
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={4}>
                    <LocationOn color="primary" fontSize="large" />
                    <Typography variant="h6" fontWeight="bold">Our Location</Typography>
                    <Typography color="textSecondary">123 Rentify Street, Ho Chi Minh City</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Email color="primary" fontSize="large" />
                    <Typography variant="h6" fontWeight="bold">Email Us</Typography>
                    <Typography color="textSecondary">support@rentify.com</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Phone color="primary" fontSize="large" />
                    <Typography variant="h6" fontWeight="bold">Call Us</Typography>
                    <Typography color="textSecondary">+84 123 456 789</Typography>
                </Grid>
            </Grid>

            {/* Contact Form */}
            <Box mt={5} component="form" sx={{ maxWidth: 500, mx: "auto" }}>
                <TextField fullWidth label="Your Name" variant="outlined" margin="normal" />
                <TextField fullWidth label="Your Email" variant="outlined" margin="normal" type="email" />
                <TextField fullWidth label="Message" variant="outlined" margin="normal" multiline rows={4} />
                <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
                    Send Message
                </Button>
            </Box>
        </Container>
    );
};

export default ContactPage;
