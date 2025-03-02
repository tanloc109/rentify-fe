import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, adminRoutes, renterAndHostRoutes } from './routes/routes';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import ProtectedRoutes from './utils/protectedRoutes';
import { UserProvider } from './contexts/UserContext';
import { TokenProvider } from './contexts/TokenContext';
import Header from "./components/common/Header.tsx";
import Footer from './components/common/Footer.tsx';

function App() {

    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="App">
                <UserProvider>
                    <TokenProvider>
                        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                            {/* Sticky Header */}
                            <Box sx={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                zIndex: 1000, // Ensures it stays on top
                                backgroundColor: 'white',
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                            }}>
                                <Header />
                            </Box>

                            {/* Main Content with padding to prevent overlap */}
                            <Box sx={{ flex: 1, paddingTop: '64px' }}> {/* Adjust based on Header height */}
                                <Routes>
                                    <Route element={<ProtectedRoutes roleName={['ADMIN']} />}>
                                        {adminRoutes.map((route, index) => {
                                            const Page = route.component;
                                            return (
                                                <Route
                                                    key={index}
                                                    path={route.path}
                                                    element={<Page />}
                                                />
                                            );
                                        })}
                                    </Route>
                                    <Route element={<ProtectedRoutes roleName={['RENTER', 'HOST']} />}>
                                        {renterAndHostRoutes.map((route, index) => {
                                            const Page = route.component;
                                            return (
                                                <Route
                                                    key={index}
                                                    path={route.path}
                                                    element={<Page />}
                                                />
                                            );
                                        })}
                                    </Route>
                                    {publicRoutes.map((route, index) => {
                                        const Page = route.component;
                                        return (
                                            <Route
                                                key={index}
                                                path={route.path}
                                                element={<Page />}
                                            />
                                        );
                                    })}
                                </Routes>
                            </Box>

                            {/* Footer */}
                            <Footer />
                        </Box>
                    </TokenProvider>
                </UserProvider>
            </div>
            <ToastContainer />
        </Router>
    );
}

export default App;
