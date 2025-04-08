import React, { useContext, useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card, Spinner, Alert, Badge } from "react-bootstrap";
import { UserContext } from "../App";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaEdit, FaSave } from "react-icons/fa";

const CustomerProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [updateMessage, setUpdateMessage] = useState(null);
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});

    const { user, updateUser } = useContext(UserContext);
    const token = user?.accessToken;
    const userId = user?.userId;

    useEffect(() => {
        if (userId && token) {
            fetchCustomerData();
        }
    }, [userId, token]);

    const fetchCustomerData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/customers/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': '*/*'
                }
            });
            setCustomer(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching customer data:", error);
            setError("Failed to fetch customer data. Please try again later.");
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
        setValidated(false);
        setErrors({});
        setUpdateMessage(null);
    };

    const handleChange = (e) => {
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [e.target.name]: e.target.value,
        }));
    };

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
        const newErrors = {};

        // First name validation
        if (!customer.firstName?.trim()) {
            newErrors.firstName = "Vui lòng nhập họ";
            isValid = false;
        } else if (customer.firstName.trim().length < 2) {
            newErrors.firstName = "Họ phải có ít nhất 2 ký tự";
            isValid = false;
        }

        // Last name validation
        if (!customer.lastName?.trim()) {
            newErrors.lastName = "Vui lòng nhập tên";
            isValid = false;
        } else if (customer.lastName.trim().length < 2) {
            newErrors.lastName = "Tên phải có ít nhất 2 ký tự";
            isValid = false;
        }

        // Email validation
        if (!customer.email?.trim()) {
            newErrors.email = "Vui lòng nhập email";
            isValid = false;
        } else if (!validateEmail(customer.email)) {
            newErrors.email = "Email không hợp lệ";
            isValid = false;
        }

        // Phone validation
        if (!customer.phone?.trim()) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
            isValid = false;
        } else if (!validatePhone(customer.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ";
            isValid = false;
        }

        // Address validation
        if (!customer.address?.trim()) {
            newErrors.address = "Vui lòng nhập địa chỉ";
            isValid = false;
        } else if (customer.address.trim().length < 5) {
            newErrors.address = "Địa chỉ phải có ít nhất 5 ký tự";
            isValid = false;
        }

        // Date of birth validation
        if (!customer.dob) {
            newErrors.dob = "Vui lòng chọn ngày sinh";
            isValid = false;
        } else {
            const today = new Date();
            const birthDate = new Date(customer.dob);
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

        setErrors(newErrors);
        return isValid;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setValidated(true);

        if (!validateForm()) {
            return;
        }

        try {
            setUpdateMessage(null);
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/api/v1/customers/${userId}`,
                customer,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                }
            );
            setUpdateMessage("Cập nhật thành công!");
            setIsEditing(false);

            // Update user context with new data
            updateUser({ ...user, ...customer });

            // Reset validation state
            setValidated(false);
            setErrors({});
        } catch (error) {
            console.error("Error updating customer data:", error);
            setUpdateMessage("Cập nhật thất bại. Vui lòng thử lại.");
        }
    };

    const calculateAge = (dob) => {
        if (!dob) return null;
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    if (loading) {
        return (
            <Container className="customer-profile my-5">
                <Card className="shadow-lg p-4 rounded">
                    <Card.Body className="text-center">
                        <Spinner animation="border" variant="primary" role="status" className="mb-3">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="text-muted">Đang tải thông tin khách hàng...</p>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="customer-profile my-5">
                <Card className="shadow-lg p-4 rounded">
                    <Card.Body className="text-center">
                        <Alert variant="danger">{error}</Alert>
                        <Button variant="outline-primary" onClick={() => window.location.reload()}>
                            Thử lại
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="customer-profile my-5">
            <Card className="shadow-lg rounded border-0">
                <Card.Header className="bg-primary text-white py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-0">
                            <FaUser className="me-2" />
                            Thông Tin Khách Hàng
                        </h3>
                        <Badge bg="light" text="dark" pill>
                            ID Khách hàng: {userId}
                        </Badge>
                    </div>
                </Card.Header>
                <Card.Body className="p-4">
                    {updateMessage && (
                        <Alert
                            variant={updateMessage.includes("thành công") ? "success" : "danger"}
                            dismissible
                            onClose={() => setUpdateMessage(null)}
                        >
                            {updateMessage}
                        </Alert>
                    )}
                    <Form noValidate validated={validated} onSubmit={handleUpdate}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">
                                        <FaUser className="me-2" />
                                        Họ
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={customer?.firstName || ""}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        isInvalid={validated && !!errors.firstName}
                                        className={!isEditing ? "bg-light" : ""}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.firstName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">
                                        <FaUser className="me-2" />
                                        Tên
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={customer?.lastName || ""}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        isInvalid={validated && !!errors.lastName}
                                        className={!isEditing ? "bg-light" : ""}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lastName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                                <FaEnvelope className="me-2" />
                                Email
                            </Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={customer?.email || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                                isInvalid={validated && !!errors.email}
                                className={!isEditing ? "bg-light" : ""}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                                <FaPhone className="me-2" />
                                Số điện thoại
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={customer?.phone || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                                isInvalid={validated && !!errors.phone}
                                className={!isEditing ? "bg-light" : ""}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phone}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                                <FaMapMarkerAlt className="me-2" />
                                Địa chỉ
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={customer?.address || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                                isInvalid={validated && !!errors.address}
                                className={!isEditing ? "bg-light" : ""}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.address}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        <FaBirthdayCake className="me-2" />
                                        Ngày sinh
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dob"
                                        value={customer?.dob || ""}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        isInvalid={validated && !!errors.dob}
                                        className={!isEditing ? "bg-light" : ""}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.dob}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                {customer?.dob && (
                                    <div className="h-100 d-flex align-items-center">
                                        <Badge bg="info" className="mt-4 py-2 px-3">
                                            <FaBirthdayCake className="me-2" />
                                            Tuổi: {calculateAge(customer.dob)} tuổi
                                        </Badge>
                                    </div>
                                )}
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-center mt-4">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="success"
                                    type="submit"
                                    className="me-2 px-4"
                                >
                                    <FaSave className="me-2" />
                                    Lưu thông tin
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleEdit}
                                    className="px-4"
                                >
                                    Hủy
                                </Button>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    </Form>
                    <div className="d-flex justify-content-center mt-4">
                        {isEditing ? (
                            <>
                            </>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={handleEdit}
                                className="px-4"
                            >
                                <FaEdit className="me-2" />
                                Chỉnh sửa thông tin
                            </Button>
                        )}
                    </div>
                </Card.Body>
                <Card.Footer className="bg-light py-3 text-center text-muted">
                    <small>Cập nhật thông tin cá nhân của bạn để nhận được trải nghiệm tốt nhất</small>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default CustomerProfile;