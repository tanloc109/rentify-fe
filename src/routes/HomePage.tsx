import { Box, Typography } from "@mui/material";
import { COLORS } from "../constants/constant.ts";

const coreValues = [
    "Convenience",
    "Trust & Safety",
    "Flexibility",
    "Affordability",
    "Seamless Experience"
];

const HomePage = () => {
    return (
        <Box>
            <Box sx={styles.welcomeBg}>
                <Typography variant="h4" sx={styles.welcomeTitle}>Welcome to Rentify Platform</Typography>
                <Typography variant="h5" sx={styles.text}>For car owners and renters, <span style={{ color: `${COLORS.PRIMARY}` }}>Rentify</span> is a platform that provides</Typography>
                <Box sx={[styles.coreValue, { marginBottom: 6 }]}>
                    {coreValues.slice(0, 2).map((value, index) => (
                        <Typography key={index} sx={styles.coreValueText}>{value}</Typography>
                    ))}
                </Box>
                <Typography variant="h5" sx={styles.text}>Unlike traditional car rental services, our platform offers</Typography>
                <Box sx={styles.coreValue}>
                    {coreValues.slice(2, 5).map((value, index) => (
                        <Typography key={index} sx={styles.coreValueText}>{value}</Typography>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

const styles = {
    welcomeBg: {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        paddingX: { xs: 5, md: 10 },
        paddingY: 5
    },
    welcomeTitle: {
        color: `${COLORS.PRIMARY}`,
        fontStyle: "italic",
        fontWeight: "bold",
        marginBottom: 6
    },
    coreValue: {
        display: 'flex',
        flexDirection: {
            xs: 'column',
            md: 'row'
        },
        justifyContent: 'center',
        gap: { xs: 2, md: 4 }
    },
    coreValueText: {
        fontSize: { xs: 22, md: 28 },
        color: `${COLORS.SECONDARY}`,
        fontWeight: "bold",
        textTransform: 'uppercase'
    },
    text: {
        fontWeight: "bold",
        marginBottom: 3
    }
};

export default HomePage;
