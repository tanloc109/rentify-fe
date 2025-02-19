import { Box, Typography, Button } from "@mui/material";
import { COLORS } from "../constants/constant.ts";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const AboutPage = () => {
    return (
        <Box sx={styles.container}>
            {/* Hero Section */}
            <Box sx={styles.heroSection}>
                <Typography variant="h3" sx={styles.heroTitle}>
                    Welcome to Rentify
                </Typography>
                <Typography variant="h5" sx={styles.heroSubtitle}>
                    The Future of Car Rentals – Easy, Fast, and Reliable
                </Typography>
            </Box>

            {/* Mission Statement */}
            <Box sx={styles.section}>
                <Typography variant="h4" sx={styles.sectionTitle}>Our Mission</Typography>
                <Typography variant="body1" sx={styles.text}>
                    At Rentify, we aim to revolutionize the car rental experience by connecting renters with car owners seamlessly. We provide a secure, affordable, and hassle-free way to rent vehicles anytime, anywhere.
                </Typography>
            </Box>

            {/* Core Features */}
            <Box sx={styles.section}>
                <Typography variant="h4" sx={styles.sectionTitle}>Why Choose Rentify?</Typography>
                <Box sx={styles.featuresList}>
                    <Box sx={styles.featureItem}>
                        <DirectionsCarIcon sx={styles.icon} />
                        <Typography variant="h6">Wide Selection</Typography>
                        <Typography variant="body2">Choose from a variety of cars, from economy to luxury.</Typography>
                    </Box>
                    <Box sx={styles.featureItem}>
                        <DirectionsCarIcon sx={styles.icon} />
                        <Typography variant="h6">Affordable Pricing</Typography>
                        <Typography variant="body2">Get the best deals with transparent pricing.</Typography>
                    </Box>
                    <Box sx={styles.featureItem}>
                        <DirectionsCarIcon sx={styles.icon} />
                        <Typography variant="h6">Seamless Booking</Typography>
                        <Typography variant="body2">Book and manage rentals with just a few clicks.</Typography>
                    </Box>
                </Box>
            </Box>

            {/* Call to Action */}
            <Box sx={styles.ctaSection}>
                <Typography variant="h5" sx={styles.ctaText}>
                    Ready to experience the best in car rentals?
                </Typography>
                <Button variant="contained" sx={styles.ctaButton}>Get Started</Button>
            </Box>
        </Box>
    );
};

const styles = {
    container: { padding: 4, textAlign: "center" },
    heroSection: {
        background: `linear-gradient(to right, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`,
        color: "white",
        padding: 6,
        borderRadius: "8px",
    },
    heroTitle: { fontWeight: "bold", marginBottom: 2 },
    heroSubtitle: { opacity: 0.9 },
    section: { marginY: 5 },
    sectionTitle: { color: COLORS.PRIMARY, fontWeight: "bold", marginBottom: 2 },
    text: { maxWidth: "800px", margin: "auto", opacity: 0.8 },
    featuresList: {
        display: "flex",
        justifyContent: "center",
        gap: 4,
        flexWrap: "wrap",
    },
    featureItem: {
        maxWidth: "300px",
        padding: 3,
        border: `1px solid ${COLORS.SECONDARY}`,
        borderRadius: "8px",
        textAlign: "center",
    },
    icon: { fontSize: 40, color: COLORS.PRIMARY, marginBottom: 1 },
    ctaSection: { marginTop: 5, backgroundColor: COLORS.LIGHT_BG, padding: 4, borderRadius: "8px" },
    ctaText: { marginBottom: 2 },
    ctaButton: { backgroundColor: COLORS.PRIMARY, color: "white" },
};

export default AboutPage;
