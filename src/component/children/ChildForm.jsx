import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "sonner";
import dayjs from "dayjs";
import "./ChildForm.scss";

const ChildForm = ({ childData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: childData?.firstName || "",
        lastName: childData?.lastName || "",
        dob: childData?.dob || "",
        gender: childData?.gender || "MALE",
        weight: childData?.weight || "",
        height: childData?.height || "",
        bloodType: childData?.bloodType || "",
        healthNote: childData?.healthNote || ""
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Số ký tự tối đa cho ghi chú sức khỏe
    const MAX_HEALTH_NOTE_LENGTH = 300;

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Xử lý đặc biệt cho ghi chú sức khỏe để giới hạn số ký tự
        if (name === "healthNote" && value.length > MAX_HEALTH_NOTE_LENGTH) {
            return;
        }

        // Đánh dấu trường này đã được chạm vào
        if (!touched[name]) {
            setTouched({ ...touched, [name]: true });
        }

        setFormData({ ...formData, [name]: value });
    };

    // Kiểm tra lỗi khi người dùng rời khỏi trường nhập liệu
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        validateField(name, formData[name]);
    };

    // Kiểm tra một trường cụ thể
    const validateField = (fieldName, value) => {
        let fieldError = "";

        switch (fieldName) {
            case "firstName":
                if (!value) {
                    fieldError = "Họ không được để trống";
                } else if (value.length > 50) {
                    fieldError = "Họ phải có độ dài từ 1 đến 50 ký tự";
                } else if (!/^[\p{L} .'-]+$/u.test(value)) {
                    fieldError = "Họ chỉ được chứa chữ cái, khoảng trắng và dấu câu cơ bản";
                }
                break;
                
            case "lastName":
                if (!value) {
                    fieldError = "Tên không được để trống";
                } else if (value.length > 50) {
                    fieldError = "Tên phải có độ dài từ 1 đến 50 ký tự";
                } else if (!/^[\p{L} .'-]+$/u.test(value)) {
                    fieldError = "Tên chỉ được chứa chữ cái, khoảng trắng và dấu câu cơ bản";
                }
                break;
                
            case "dob":
                if (!value) {
                    fieldError = "Ngày sinh không được để trống";
                } else {
                    const dobDate = dayjs(value);
                    const today = dayjs();
                    const minDate = today.subtract(18, 'year');

                    if (dobDate.isAfter(today)) {
                        fieldError = "Ngày sinh phải là ngày trong quá khứ";
                    } else if (dobDate.isBefore(minDate)) {
                        fieldError = "Trẻ phải trong độ tuổi từ 0 đến 18";
                    }
                }
                break;
                
            case "weight":
                if (!value) {
                    fieldError = "Cân nặng không được để trống";
                } else {
                    const weight = parseFloat(value);
                    if (isNaN(weight)) {
                        fieldError = "Cân nặng phải là số";
                    } else if (weight < 0.5) {
                        fieldError = "Cân nặng phải từ 0.5 kg trở lên";
                    } else if (weight > 200.0) {
                        fieldError = "Cân nặng không được vượt quá 200.0 kg";
                    }
                }
                break;
                
            case "height":
                if (!value) {
                    fieldError = "Chiều cao không được để trống";
                } else {
                    const height = parseFloat(value);
                    if (isNaN(height)) {
                        fieldError = "Chiều cao phải là số";
                    } else if (height < 30.0) {
                        fieldError = "Chiều cao phải từ 30.0 cm trở lên";
                    } else if (height > 200.0) {
                        fieldError = "Chiều cao không được vượt quá 200.0 cm";
                    }
                }
                break;
                
            case "bloodType":
                if (!value) {
                    fieldError = "Nhóm máu không được để trống";
                } else if (!/^(A|B|AB|O)[+-]$/.test(value)) {
                    fieldError = "Nhóm máu phải là một trong các loại: A+, A-, B+, B-, AB+, AB-, O+, O-";
                }
                break;
                
            case "healthNote":
                if (value && value.length > 300) {
                    fieldError = "Ghi chú sức khỏe không được vượt quá 300 ký tự";
                }
                break;
                
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: fieldError }));
        return !fieldError;
    };

    // Kiểm tra toàn bộ form
    const validateForm = () => {
        // Đánh dấu tất cả các trường đã được chạm vào
        const allTouched = {};
        Object.keys(formData).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        // Kiểm tra từng trường
        let isValid = true;
        const newErrors = {};

        // Kiểm tra họ
        if (!formData.firstName) {
            newErrors.firstName = "Họ không được để trống";
            isValid = false;
        } else if (formData.firstName.length > 50) {
            newErrors.firstName = "Họ phải có độ dài từ 1 đến 50 ký tự";
            isValid = false;
        } else if (!/^[\p{L} .'-]+$/u.test(formData.firstName)) {
            newErrors.firstName = "Họ chỉ được chứa chữ cái, khoảng trắng và dấu câu cơ bản";
            isValid = false;
        }

        // Kiểm tra tên
        if (!formData.lastName) {
            newErrors.lastName = "Tên không được để trống";
            isValid = false;
        } else if (formData.lastName.length > 50) {
            newErrors.lastName = "Tên phải có độ dài từ 1 đến 50 ký tự";
            isValid = false;
        } else if (!/^[\p{L} .'-]+$/u.test(formData.lastName)) {
            newErrors.lastName = "Tên chỉ được chứa chữ cái, khoảng trắng và dấu câu cơ bản";
            isValid = false;
        }

        // Kiểm tra ngày sinh
        if (!formData.dob) {
            newErrors.dob = "Ngày sinh không được để trống";
            isValid = false;
        } else {
            const dobDate = dayjs(formData.dob);
            const today = dayjs();
            const minDate = today.subtract(18, 'year');

            if (dobDate.isAfter(today)) {
                newErrors.dob = "Ngày sinh phải là ngày trong quá khứ";
                isValid = false;
            } else if (dobDate.isBefore(minDate)) {
                newErrors.dob = "Trẻ phải trong độ tuổi từ 0 đến 18";
                isValid = false;
            }
        }

        // Kiểm tra cân nặng
        if (!formData.weight) {
            newErrors.weight = "Cân nặng không được để trống";
            isValid = false;
        } else {
            const weight = parseFloat(formData.weight);
            if (isNaN(weight)) {
                newErrors.weight = "Cân nặng phải là số";
                isValid = false;
            } else if (weight < 0.5) {
                newErrors.weight = "Cân nặng phải từ 0.5 kg trở lên";
                isValid = false;
            } else if (weight > 200.0) {
                newErrors.weight = "Cân nặng không được vượt quá 200.0 kg";
                isValid = false;
            }
        }

        // Kiểm tra chiều cao
        if (!formData.height) {
            newErrors.height = "Chiều cao không được để trống";
            isValid = false;
        } else {
            const height = parseFloat(formData.height);
            if (isNaN(height)) {
                newErrors.height = "Chiều cao phải là số";
                isValid = false;
            } else if (height < 30.0) {
                newErrors.height = "Chiều cao phải từ 30.0 cm trở lên";
                isValid = false;
            } else if (height > 200.0) {
                newErrors.height = "Chiều cao không được vượt quá 200.0 cm";
                isValid = false;
            }
        }

        // Kiểm tra nhóm máu
        if (!formData.bloodType) {
            newErrors.bloodType = "Nhóm máu không được để trống";
            isValid = false;
        } else if (!/^(A|B|AB|O)[+-]$/.test(formData.bloodType)) {
            newErrors.bloodType = "Nhóm máu phải là một trong các loại: A+, A-, B+, B-, AB+, AB-, O+, O-";
            isValid = false;
        }

        // Kiểm tra ghi chú sức khỏe (trường không bắt buộc)
        if (formData.healthNote && formData.healthNote.length > 300) {
            newErrors.healthNote = "Ghi chú sức khỏe không được vượt quá 300 ký tự";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra validation
        if (!validateForm()) {
            // Hiển thị thông báo lỗi
            const firstError = Object.values(errors).find(error => error);
            if (firstError) toast.error(firstError);
            return;
        }

        const dataToSend = {
            ...formData,
            gender: formData.gender.toUpperCase() // Đảm bảo gender viết hoa
        };

        try {
            await onSave(dataToSend);
        } catch (error) {
            // Xử lý lỗi từ backend
            if (error.response && error.response.data) {
                const { error: backendErrors } = error.response.data;

                if (backendErrors) {
                    // Hiển thị lỗi từ backend
                    Object.values(backendErrors).forEach(errorMsg => {
                        toast.error(errorMsg);
                    });

                    // Cập nhật trạng thái lỗi
                    setErrors({ ...errors, ...backendErrors });
                } else if (error.response.data.message) {
                    toast.error(error.response.data.message);
                }
            } else {
                toast.error("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại sau.");
            }
        }
    };

    // Renderer cho thông báo lỗi
    const renderError = (fieldName) => {
        if (touched[fieldName] && errors[fieldName]) {
            return <div className="text-danger mt-1">{errors[fieldName]}</div>;
        }
        return null;
    };

    return (
        <Form className="child-form" onSubmit={handleSubmit} noValidate>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group controlId="firstName">
                        <Form.Label>Họ</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.firstName && errors.firstName ? "border-danger" : ""}
                        />
                        {renderError("firstName")}
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="lastName">
                        <Form.Label>Tên</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.lastName && errors.lastName ? "border-danger" : ""}
                        />
                        {renderError("lastName")}
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={12}>
                    <Form.Group controlId="dob">
                        <Form.Label>Ngày sinh</Form.Label>
                        <Form.Control
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.dob && errors.dob ? "border-danger" : ""}
                        />
                        {renderError("dob")}
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group controlId="gender">
                        <Form.Label>Giới tính</Form.Label>
                        <Form.Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.gender && errors.gender ? "border-danger" : ""}
                        >
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                        </Form.Select>
                        {renderError("gender")}
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="bloodType">
                        <Form.Label>Nhóm máu</Form.Label>
                        <Form.Select
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.bloodType && errors.bloodType ? "border-danger" : ""}
                        >
                            <option value="">Chọn nhóm máu</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </Form.Select>
                        {renderError("bloodType")}
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group controlId="weight">
                        <Form.Label>Cân nặng (kg)</Form.Label>
                        <Form.Control
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            step="0.1"
                            min="0.5"
                            max="200"
                            className={touched.weight && errors.weight ? "border-danger" : ""}
                        />
                        {renderError("weight")}
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="height">
                        <Form.Label>Chiều cao (cm)</Form.Label>
                        <Form.Control
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            step="0.1"
                            min="30"
                            max="200"
                            className={touched.height && errors.height ? "border-danger" : ""}
                        />
                        {renderError("height")}
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={12}>
                    <Form.Group controlId="healthNote">
                        <Form.Label>
                            Ghi chú sức khỏe
                            <small className="text-muted ms-2">
                                ({formData.healthNote.length}/{MAX_HEALTH_NOTE_LENGTH})
                            </small>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="healthNote"
                            value={formData.healthNote}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Nhập thông tin sức khỏe..."
                            className={touched.healthNote && errors.healthNote ? "border-danger" : ""}
                        />
                        {renderError("healthNote")}
                    </Form.Group>
                </Col>
            </Row>

            <div className="form-buttons mt-3 d-flex justify-content-center">
                <Button variant="primary" type="submit" className="me-2 px-4">Lưu</Button>
                <Button variant="secondary" onClick={onCancel} className="px-4">Hủy</Button>
            </div>
        </Form>
    );
};

export default ChildForm;