import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.scss";
import Logo from "../assets/logo.png";
import { UserContext } from "../App";
import { getRolePaths } from "../auth/Paths";
import { Container } from "react-bootstrap";
import axios from "axios";

const Header = () => {
    const { user, signOut } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const notificationRef = useRef(null);

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        if (user != null && user.role == 'ROLE_USER') {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await axios({
                url: `${import.meta.env.VITE_BASE_URL}/api/v1/notifications/${user.userId}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            });
            if (response && response.data) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="header-component">
            <div className="container-fluid">
                <Container className="d-flex justify-content-center align-items-center">
                    {/* Logo bên trái */}
                    <div className="header-left pe-2">
                        <Link to={getRolePaths(user.role)[0].path} className="header-title">
                            <img className="header-logo" src={Logo} alt="logo" />
                        </Link>
                    </div>

                    {/* Menu ở giữa */}
                    <nav className="nav-center">
                        <ul className="d-flex justify-content-center nav-list">
                            {getRolePaths(user.role).map((path, index) => (
                                <li key={index} className={`rounded-0 text-center ${isActive(path.path) ? "active" : ""}`}>
                                    <Link className="text" to={path.path}>
                                        {path.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Đăng nhập/đăng xuất và thông báo bên phải */}
                    <div className="header-right d-flex align-items-center">
                        {user && (
                            <div ref={notificationRef} className="notification-wrapper position-relative me-3">
                                {user.role == 'ROLE_USER' && (
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="btn btn-link position-relative"
                                    >
                                        <i className="bi bi-bell-fill text-white" style={{ fontSize: "1.5rem" }}></i>
                                        {notifications.length > 0 && (
                                            <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
                                                {notifications.length}
                                            </span>
                                        )}
                                    </button>
                                )}
                                {showNotifications && (
                                    <div
                                        className="notifications-dropdown position-absolute end-0 mt-2 bg-white shadow rounded"
                                        style={{ width: "300px", zIndex: 1000 }}
                                    >
                                        <div className="p-3">
                                            <h6 className="mb-3">Thông báo</h6>
                                            <ul className="list-unstyled mb-0">
                                                {notifications.length > 0 ? (
                                                    notifications.map((noti) => (
                                                        <li key={noti.id} className="border-bottom pb-2 mb-2">
                                                            <p className="mb-1 fw-bold">{noti.message}</p>
                                                            <small className="text-muted">
                                                                {new Date(noti.scheduleDate).toLocaleString()}
                                                            </small>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>Không có thông báo nào.</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {user ? (
                            <div className="d-flex align-items-center">
                                <Link className="text text-white button-custom rounded-0" to="/ho-so">
                                    <i className="bi bi-person-fill p-2"></i>
                                    {user.firstName} {user.lastName}
                                </Link>
                                <button
                                    className="btn btn-danger rounded-0 ms-3"
                                    onClick={() => {
                                        signOut();
                                        navigate("/dang-nhap");
                                    }}
                                >
                                    Đăng Xuất
                                </button>
                            </div>
                        ) : (
                            <Link className="text button-custom" to="/dang-nhap">
                                <i className="bi bi-person-fill p-2"></i>
                                Đăng Nhập
                            </Link>
                        )}
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default Header;
