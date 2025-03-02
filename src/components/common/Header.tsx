import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Box, CssBaseline, Drawer, IconButton, Stack, Toolbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import AgileLogo from "./AgileLogo.tsx";
import { COLORS } from "../../constants/constant.ts";
import CustomButton from "./CustomButton.tsx";
import { useUserContext } from "../../contexts/UserContext.tsx";
import { useTokenContext } from '../../contexts/TokenContext.tsx';

const getNavLinks = (role: string | undefined) => {
    switch (role) {
        case 'ADMIN':
            return [
                { name: 'Car', path: '/car-management' },
                { name: 'Brand', path: '/brand-management' },
                { name: 'Type', path: '/type-management' },
                { name: 'User', path: '/user-management' },
                { name: 'Wallet', path: '/wallet-management' },
                { name: 'Rental', path: '/rental-management' },
            ];
        case 'RENTER':
        case 'HOST':
            return [
                { name: 'Cars', path: '/cars' },
                { name: 'Rental', path: '/rentals' },
                { name: 'Wallet', path: '/wallet' },
                { name: 'About', path: '/abouts' },
                { name: 'Contact', path: '/contacts' },
            ];
        default:
            return [
                { name: 'Cars', path: '/cars' },
                { name: 'About', path: '/abouts' },
                { name: 'Contact', path: '/contacts' },
            ];
    }
};

const Header = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { userData, setUserData } = useUserContext();
    const { setTokens } = useTokenContext();
    const navigate = useNavigate();

    const navLinks = getNavLinks(userData?.role);

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        setUserData(null);
        setTokens({ accessToken: null, refreshToken: null });
        navigate('/login');
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="static" sx={styles.appBar} elevation={0}>
                <Toolbar sx={styles.toolBar}>
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                        <AgileLogo />
                    </Box>

                    <Box sx={{ flex: 2, display: "flex", justifyContent: "center" }}>
                        {navLinks.map((link, index) => (
                            <NavLink
                                key={index}
                                to={link.path}
                                style={({ isActive }) => ({
                                    fontSize: 14,
                                    textDecoration: "none",
                                    color: "black",
                                    fontWeight: isActive ? "bold" : "normal",
                                    textAlign: "center",
                                })}
                            >
                                <Box
                                    sx={{
                                        paddingY: 1,
                                        paddingX: 2,
                                        "&:hover": {
                                            backgroundColor: `${COLORS.HOVER}`,
                                            borderRadius: "5px",
                                        },
                                        width: 120,
                                        display: "inline-block",
                                        textAlign: "center",
                                    }}
                                >
                                    {link.name}
                                </Box>
                            </NavLink>
                        ))}
                    </Box>

                    <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                        {userData ? (
                            <CustomButton styling="primary" label="Log out" size="m" onClick={handleLogout} />
                        ) : (
                            <CustomButton styling="primary" label="Log in" size="m" onClick={handleLogin} />
                        )}
                    </Box>
                </Toolbar>

            </AppBar>

            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box sx={styles.drawer} onClick={toggleDrawer(false)}>
                    <Box sx={styles.drawerHeader}>
                        <AgileLogo />

                        <IconButton edge="end" color="error" aria-label="close" onClick={toggleDrawer(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Stack spacing={2} sx={styles.drawerStack}>
                        {navLinks.map((link, index) => (
                            <NavLink key={index} to={link.path} style={({ isActive }) => ({
                                fontSize: 14,
                                textDecoration: "none",
                                color: 'black',
                                fontWeight: isActive ? "bold" : "normal"
                            })}>
                                {link.name}
                            </NavLink>
                        ))}

                        {userData ? (
                            <CustomButton
                                styling="primary"
                                label="Log out"
                                size="m"
                                disabled={false}
                                onClick={() => handleLogout()}
                            />
                        ) : (
                            <CustomButton
                                styling="primary"
                                label="Log in"
                                size="m"
                                disabled={false}
                                onClick={() => handleLogin()}
                            />
                        )}

                    </Stack>
                </Box>
            </Drawer>
        </>
    );
};

const styles = {
    appBar: {
        borderBottom: `1px solid ${COLORS.LIGHT_GREY}`,
        paddingX: { md: 5 },
        bgcolor: "white",
    },
    toolBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    flexRow: {
        display: "flex",
        alignItems: "center",
        gap: { xs: 2, md: 5 }
    },
    navLink: {
        display: { xs: 'none', md: 'flex' },
        gap: 3,
        justifyContent: 'center',
        flexGrow: 1,
    },
    drawer: {
        width: '100vw',
        height: '100vh',
        bgcolor: "white",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        paddingX: 2,
        paddingY: 1,
        width: '100%',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${COLORS.LIGHT_GREY}`,
        marginBottom: 3
    },
    drawerStack: {
        width: '100%',
        textAlign: 'center'
    },
    menuIcon: {
        color: `${COLORS.PRIMARY}`,
        display: { md: 'none' }
    },
    logout: {
        display: { xs: 'none', md: 'block' }
    }
};

export default Header;