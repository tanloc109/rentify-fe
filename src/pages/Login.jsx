import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Form, Button, Alert } from "react-bootstrap";
import "./Login.scss";
import BackgroundImage from "../assets/background.png";
import Logo from "../assets/logo.png";
import { UserContext } from "../App";
import { login } from "../services/accountService";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import { getRolePaths } from "../auth/Paths";

const Login = () => {
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, signIn, signOut } = useContext(UserContext);
    const navigate = useNavigate();

    // Sửa đổi phần xử lý token trong Login.js
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const userData = await login(inputUsername, inputPassword);
            const decodedToken = jwtDecode(userData['token']);

            // Lấy đúng giá trị role từ token
            const role = decodedToken.role;

            console.log("Decoded token:", decodedToken);
            console.log("Role from token:", role);

            const user = {
                accessToken: userData['token'],
                refreshToken: userData['refreshToken'],
                role: role,
                userId: userData['userId'],
                firstName: userData['firstName'],
                lastName: userData['lastName']
            }

            signIn(user);

            // Thêm log để kiểm tra
            console.log("Available paths for role:", getRolePaths(role));

            // Chuyển hướng tới trang đầu tiên trong danh sách đường dẫn cho vai trò
            const paths = getRolePaths(role);
            if (paths && paths.length > 0) {
                navigate(paths[0].path);
            } else {
                console.error("No paths available for role:", role);
            }
        } catch (error) {
            console.error("Login error:", error);
            setShow(true);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => navigate("/dang-ky");
    const handleBackHome = () => navigate("/");

    return (
        <div className="sign-in__wrapper" style={{ backgroundImage: `url(${BackgroundImage})` }}>
            <ToastContainer />
            <div className="sign-in__backdrop"></div>
            <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
                <img className="img-thumbnail mx-auto d-block mb-2" src={Logo} alt="logo" />
                <div className="h4 mb-2 text-center">Đăng nhập</div>

                {show && (
                    <Alert className="mb-2" variant="danger" onClose={() => setShow(false)} dismissible>
                        Sai tài khoản hoặc mật khẩu.
                    </Alert>
                )}

                <Form.Group className="mb-2" controlId="username">
                    <Form.Label>Tài khoản</Form.Label>
                    <Form.Control
                        className="rounded-0"
                        type="text"
                        value={inputUsername}
                        placeholder="Nhập tài khoản"
                        onChange={(e) => setInputUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                        className="rounded-0"
                        type="password"
                        value={inputPassword}
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => setInputPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button className="w-100 rounded-0" variant="primary" type="submit" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>

                <div className="d-grid justify-content-end">
                    <Button className="text-muted px-0" variant="link" onClick={handleRegister}>
                        Bạn chưa có tài khoản? Đăng ký ngay
                    </Button>
                </div>

                <div className="d-grid justify-content-end">
                    <Button className="text-muted px-0" variant="link" onClick={handleBackHome}>
                        Trở về trang chủ
                    </Button>
                </div>
            </Form>

            <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
                &copy; 2025 Child Vaccine Tracker. All rights reserved.
            </div>
        </div>
    );
};

export default Login;
