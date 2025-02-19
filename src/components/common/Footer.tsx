import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { COLORS } from "../../constants/constant";
import { rentifyLogo } from "../../assets";

const Footer = () => {
    return (
        <Box sx={styles.footerBox}>
            <Box sx={styles.footerLogo}>
                <Link to="/">
                    <img src={rentifyLogo} width={150} alt="rentify-logo" />
                </Link>
                <Typography sx={styles.text}>© Copyright 2025. Rentify. All Right Reserved</Typography>
            </Box>

            <Typography sx={styles.text}>Version 0.1.0</Typography>
        </Box>
    )
}

const styles = {
    footerLogo: {
        display: 'flex',
        alignItems: {
            xs: 'start',
            md: 'center'
        },
        flexDirection: {
            xs: 'column',
            md: 'row'
        },
        gap: { md: 2 }
    },
    footerBox: {
        display: "flex",
        alignItems: {
            xs: 'start',
            md: 'center'
        },
        flexDirection: {
            xs: 'column',
            md: 'row'
        },
        gap: 0.5,
        justifyContent: "space-between",
        paddingY: 2,
        paddingX: 4,
        borderTop: `1px solid ${COLORS.LIGHT_GREY}`,
    },
    text: {
        fontSize: 14,
    }
}

export default Footer;