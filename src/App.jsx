import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router';
import { ProtectedRoutes } from './auth/ProtectedRoutes.jsx';
import { FULL_PATHS_LIST } from './auth/Paths.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Forbidden from './pages/Forbidden.jsx';
import NotFound from './pages/NotFound.jsx';
import { DataProvider } from './data/Vaccines.jsx';
import { DataComboProvider } from './data/ComboVaccine.jsx';
import { AppointmentProvider } from './context/AppointmentContext.jsx';

export const UserContext = createContext(null);

function App() {

    const [user, setUser] = useState(() => {
        const user = localStorage.getItem('user');
        return user
            ? JSON.parse(user)
            : null;
    });

    const signIn = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('user');
    }

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    return (
        <UserContext.Provider value={{ user, signIn, signOut, updateUser }}>
            <DataProvider>
                <DataComboProvider>
                    <AppointmentProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route element={<ProtectedRoutes />}>
                                    {
                                        FULL_PATHS_LIST.map((path, index) => (
                                            <Route key={index} path={path.path} element={path.element} />
                                        ))
                                    }
                                </Route>

                                <Route path="/dang-nhap" element={<Login />} />
                                <Route path="/dang-ky" element={<Register />} />
                                <Route path="/403" element={<Forbidden />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </BrowserRouter>
                    </AppointmentProvider>
                </DataComboProvider>
            </DataProvider>
        </UserContext.Provider>
    );
}

export default App;