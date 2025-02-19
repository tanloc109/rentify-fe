import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { iconLogo } from "../../assets";
import { COLORS } from "../../constants/constant";

const AgileLogo = () => {
    return (
        <Link to="/" style={{ textDecoration: 'none' }}>
            <Box sx={styles.display}>
                <img src={iconLogo} alt="logo" width={30} />
                <Typography color={COLORS.PRIMARY} sx={styles.appTitle}>
                    Rentify
                </Typography>
            </Box>
        </Link>
    )
}

const styles = {
    appTitle: {
        fontSize: 18,
        textDecoration: 'none'
    },
    display: {
        display: "flex",
        alignItems: "center",
        gap: 1,
        marginRight: { xs: 2, md: 4 }
    }
}

export default AgileLogo;