import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import "./Register.scss";
import BackgroundImage from "../assets/background.png";
import Logo from "../assets/logo.png";
import { toast } from "react-toastify";
import { register } from "../services/accountService";

const Register = () => {
    const [inputFirstName, setInputFirstName] = useState("");
    const [inputLastName, setInputLastName] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [inputPhone, setInputPhone] = useState("");
    const [inputAddress, setInputAddress] = useState("");
    const [inputDob, setInputDob] = useState("");
    const [inputPassword, setInputPassword] = useState("");

    // Validation states
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        password: ""
    });

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Validation functions
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        // Validate Vietnamese phone numbers
        const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        return re.test(phone);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            dob: "",
            password: ""
        };

        // First name validation
        if (!inputFirstName.trim()) {
            newErrors.firstName = "Vui lòng nhập họ";
            isValid = false;
        } else if (inputFirstName.trim().length < 2) {
            newErrors.firstName = "Họ phải có ít nhất 2 ký tự";
            isValid = false;
        }

        // Last name validation
        if (!inputLastName.trim()) {
            newErrors.lastName = "Vui lòng nhập tên";
            isValid = false;
        } else if (inputLastName.trim().length < 2) {
            newErrors.lastName = "Tên phải có ít nhất 2 ký tự";
            isValid = false;
        }

        // Email validation
        if (!inputEmail.trim()) {
            newErrors.email = "Vui lòng nhập email";
            isValid = false;
        } else if (!validateEmail(inputEmail)) {
            newErrors.email = "Email không hợp lệ";
            isValid = false;
        }

        // Phone validation
        if (!inputPhone.trim()) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
            isValid = false;
        } else if (!validatePhone(inputPhone)) {
            newErrors.phone = "Số điện thoại không hợp lệ";
            isValid = false;
        }

        // Address validation
        if (!inputAddress.trim()) {
            newErrors.address = "Vui lòng nhập địa chỉ";
            isValid = false;
        } else if (inputAddress.trim().length < 5) {
            newErrors.address = "Địa chỉ phải có ít nhất 5 ký tự";
            isValid = false;
        }

        // Date of birth validation
        if (!inputDob) {
            newErrors.dob = "Vui lòng chọn ngày sinh";
            isValid = false;
        } else {
            const today = new Date();
            const birthDate = new Date(inputDob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 18) {
                newErrors.dob = "Người dùng phải từ 18 tuổi trở lên";
                isValid = false;
            } else if (birthDate > today) {
                newErrors.dob = "Ngày sinh không hợp lệ";
                isValid = false;
            }
        }

        // Password validation (simple - just 6 characters minimum as requested)
        if (!inputPassword) {
            newErrors.password = "Vui lòng nhập mật khẩu";
            isValid = false;
        } else if (inputPassword.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Chỉ set validated thành true nếu form hợp lệ
        const isValid = validateForm();
        setValidated(isValid);
        
        if (!isValid) {
            return;
        }

        setLoading(true);
        setErrorMessage("");

        const body = {
            email: inputEmail,
            password: inputPassword,
            firstName: inputFirstName,
            lastName: inputLastName,
            phone: inputPhone,
            address: inputAddress,
            dob: inputDob,
        };

        try {
            await register(body);
            navigate("/dang-nhap");
            toast.success("Đăng ký thành công. Vui lòng đăng nhập!");
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!");
        }

        setLoading(false);
    };

    return (
        <div className="register-component">
            <div
                className="sign-in__wrapper"
                style={{ backgroundImage: `url(${BackgroundImage})` }}
            >
                {/* Overlay */}
                <div className="sign-in__backdrop"></div>

                {/* Form */}
                <Form className="shadow p-4 bg-white rounded" noValidate onSubmit={handleSubmit}>
                    {/* Header */}
                    <img className="img-thumbnail mx-auto d-block mb-2" src={Logo} alt="logo" />
                    <div className="h4 mb-2 text-center">Đăng ký</div>

                    {/* Alerts */}
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2" controlId="firstName">
                                <Form.Label>Họ</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={inputFirstName}
                                    placeholder="Nhập họ"
                                    onChange={(e) => setInputFirstName(e.target.value)}
                                    isInvalid={!!errors.firstName}
                                    isValid={validated && !errors.firstName}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.firstName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2" controlId="lastName">
                                <Form.Label>Tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={inputLastName}
                                    placeholder="Nhập tên"
                                    onChange={(e) => setInputLastName(e.target.value)}
                                    isInvalid={!!errors.lastName}
                                    isValid={validated && !errors.lastName}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.lastName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={inputEmail}
                                    placeholder="Email"
                                    onChange={(e) => setInputEmail(e.target.value)}
                                    isInvalid={!!errors.email}
                                    isValid={validated && !errors.email}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2" controlId="phone">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={inputPhone}
                                    placeholder="Nhập số điện thoại"
                                    onChange={(e) => setInputPhone(e.target.value)}
                                    isInvalid={!!errors.phone}
                                    isValid={validated && !errors.phone}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phone}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-2" controlId="address">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control
                            type="text"
                            value={inputAddress}
                            placeholder="Nhập địa chỉ"
                            onChange={(e) => setInputAddress(e.target.value)}
                            isInvalid={!!errors.address}
                            isValid={validated && !errors.address}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.address}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="dob">
                        <Form.Label>Ngày sinh</Form.Label>
                        <Form.Control
                            type="date"
                            value={inputDob}
                            onChange={(e) => setInputDob(e.target.value)}
                            isInvalid={!!errors.dob}
                            isValid={validated && !errors.dob}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dob}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="password">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control
                            type="password"
                            value={inputPassword}
                            placeholder="Nhập mật khẩu"
                            onChange={(e) => setInputPassword(e.target.value)}
                            isInvalid={!!errors.password}
                            isValid={validated && !errors.password}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {!loading ? (
                        <Button className="w-100" variant="primary" type="submit">
                            Đăng ký
                        </Button>
                    ) : (
                        <Button className="w-100" variant="primary" type="submit" disabled>
                            Đang đăng ký...
                        </Button>
                    )}

                    <div className="d-grid justify-content-end">
                        <Button className="text-muted px-0" variant="link" onClick={() => navigate("/dang-nhap")}>
                            Bạn đã có tài khoản? Đăng nhập ngay
                        </Button>
                    </div>

                    <div className="d-grid justify-content-end">
                        <Button className="text-muted px-0" variant="link" onClick={() => navigate("/")}>
                            Trở về trang chính
                        </Button>
                    </div>
                </Form>

                {/* Footer */}
                <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
                    &copy; 2025 Child Vaccine Tracker. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Register;