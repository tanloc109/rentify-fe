import { Navigate, Outlet, useLocation } from "react-router";
import Header from "/src/common/Header.jsx";
import Footer from "/src/common/Footer.jsx";
import React, { useContext } from 'react';
import './ProtectedRoutes.scss';
import { UserContext } from "../App";
import { getRolePaths, isAuthorized } from "./Paths";
import { ToastContainer } from "react-toastify";
import { ROLES } from "./Roles";

export const ProtectedRoutes = () => {
    const { user } = useContext(UserContext);
    const location = useLocation().pathname;

    if (!user) {
        return <Navigate to="/dang-nhap" />;
    }

    if (location == '/' && user.role !== ROLES.USER) {
        return <Navigate to={getRolePaths(user.role)[0].path} />
    }

    if (!isAuthorized(user.role, location)) {
        return <Navigate to="/403" />;
    }

    return (
        <div className="app">
            <ToastContainer />
            <Header />
            <div className="content">
                <Outlet />
            </div>
            <Footer className="footer" />
        </div>
    );
}
