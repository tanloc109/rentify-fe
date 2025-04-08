import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button, Table, Form, Card, Modal } from "react-bootstrap";
import { exportVaccine, laySoLuongVaccineCanXuat } from "../services/vaccineScheduleService";
import { getAllDoctors } from "../services/doctorService"; // Assuming this service exists or needs to be created
import { UserContext } from '../App';
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { getVaccines } from "../services/batchService";
import axios from "axios";

export const DoctorVaccineSchedulePage = () => {
    const { user } = useContext(UserContext);
    const [vaccinesList, setVaccinesList] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [shift, setShift] = useState('morning');
    const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // State for Return Vaccine modal - completely independent from main page state
    const [showReturnModal, setShowReturnModal] = useState(false);
    
    const fetchVaccines = async () => {
        try {
            setIsLoading(true);
            const response = await getVaccines({ accessToken: user.accessToken });
            
            if (response) {
                console.log(response);
                setVaccines(response);
            } else {
                toast.error("Không thể lấy danh sách vaccine");
            }
        } catch (error) {
            console.error("Error fetching vaccines:", error);
            toast.error("Lỗi khi lấy danh sách vaccine");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch all doctors when component mounts
    useEffect(() => {
        const getDoctors = async () => {
            try {
                setIsLoading(true);
                const accessToken = user.accessToken;
                const response = await getAllDoctors(accessToken);

                if (response && response.status === "200 OK" && response.data) {
                    setDoctors(response.data);
                    // Set the first doctor as default if doctors exist
                    if (response.data.length > 0) {
                        setSelectedDoctor(response.data[0].id);
                    }
                } else {
                    toast.error("Không thể lấy danh sách bác sĩ");
                }
            } catch (error) {
                console.error("Error fetching doctors:", error);
                toast.error("Lỗi khi lấy danh sách bác sĩ");
            } finally {
                setIsLoading(false);
            }
        };

        getDoctors();
        fetchVaccines(); // Fetch vaccines for the return form
    }, [user.accessToken]);

    const callAPI = async () => {
        if (!selectedDoctor) {
            toast.warning("Vui lòng chọn bác sĩ");
            return;
        }

        try {
            setIsLoading(true);
            let accessToken = user.accessToken;
            let data = await laySoLuongVaccineCanXuat(accessToken, selectedDoctor, shift, date);
            setVaccinesList(data);
        } catch (error) {
            console.error("Error fetching vaccine list:", error);
            toast.error("Không thể lấy danh sách vaccine");
            setVaccinesList([]);
        } finally {
            setIsLoading(false);
        }
    }

    const exportVaccines = async () => {
        if (!selectedDoctor) {
            toast.warning("Vui lòng chọn bác sĩ");
            return;
        }

        if (vaccinesList.length === 0) {
            toast.warning("Không có vaccine nào để xuất");
            return;
        }

        try {
            setIsLoading(true);
            let accessToken = user.accessToken;
            let vaccines_list = [...vaccinesList].map(v => ({
                vaccineId: v.id,
                quantity: v.quantity
            }));

            let result = await exportVaccine(accessToken, selectedDoctor, vaccines_list);
            if (result) {
                toast.success('Xuất vaccine thành công!');
            } else {
                toast.error('Không thể xuất vaccine');
            }
        } catch (error) {
            console.error("Error exporting vaccines:", error);
            toast.error('Lỗi khi xuất vaccine');
        } finally {
            setIsLoading(false);
            await callAPI(); // Refresh vaccine list after export
        }
    }

    useEffect(() => {
        if (selectedDoctor) {
            callAPI();
        }
    }, [selectedDoctor, shift, date]);

    const ScheduleReport = () => {
        return (
            <Card className="mb-4 rounded-0">
                <Card.Body>
                    <Card.Title>Báo cáo số lượng vaccine cần</Card.Title>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Bác sĩ:</Form.Label>
                                <Form.Select
                                    className="rounded-0"
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    disabled={isLoading}
                                >
                                    <option value="">Chọn bác sĩ</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.firstName} {doctor.lastName}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Ngày:</Form.Label>
                                <Form.Control
                                    type="date"
                                    className="rounded-0"
                                    value={date}
                                    onChange={(e) => setDate(dayjs(e.target.value).format("YYYY-MM-DD"))}
                                    disabled={isLoading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Ca:</Form.Label>
                                <Form.Select
                                    className="rounded-0"
                                    value={shift}
                                    onChange={(e) => setShift(e.target.value)}
                                    disabled={isLoading}
                                >
                                    <option value="morning">Sáng</option>
                                    <option value="afternoon">Chiều</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {isLoading ? (
                        <div className="text-center py-3">
                            <span>Đang tải dữ liệu...</span>
                        </div>
                    ) : (
                        <>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Mã vaccine</th>
                                        <th>Vaccine</th>
                                        <th>Nhà sản xuất</th>
                                        <th>Số mũi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vaccinesList.length > 0 ? (
                                        vaccinesList.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.vaccineCode}</td>
                                                <td>{item.name}</td>
                                                <td>{item.manufacturer}</td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        min={item.quantity}
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            let new_array = [...vaccinesList];
                                                            new_array[index].quantity = e.target.value;
                                                            setVaccinesList(new_array);
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                {selectedDoctor ? "Không có dữ liệu vaccine" : "Vui lòng chọn bác sĩ"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>

                            <div className="d-flex justify-content-end">
                                <Button
                                    variant="success rounded-0"
                                    onClick={exportVaccines}
                                    disabled={isLoading || vaccinesList.length === 0 || !selectedDoctor}
                                    className="me-2"
                                >
                                    Xuất vaccine
                                </Button>
                                <Button
                                    variant="primary rounded-0"
                                    onClick={() => setShowReturnModal(true)}
                                    disabled={isLoading}
                                >
                                    Hoàn vaccine
                                </Button>
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        );
    };

    // Completely independent Return Vaccine Modal Component
    const ReturnVaccineModal = () => {
        // Independent state for the return modal
        const [returnFormDoctor, setReturnFormDoctor] = useState(selectedDoctor || '');
        const [returnFormShift, setReturnFormShift] = useState('morning');
        const [returnVaccinesList, setReturnVaccinesList] = useState([]);
        const [selectedVaccineId, setSelectedVaccineId] = useState('');
        const [quantity, setQuantity] = useState(1);
        const [showConfirmation, setShowConfirmation] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false);

        // Add a vaccine to the return list
        const addVaccineToReturn = () => {
            if (!selectedVaccineId) {
                toast.warning("Vui lòng chọn vaccine");
                return;
            }

            if (!quantity || quantity <= 0) {
                toast.warning("Số lượng phải lớn hơn 0");
                return;
            }

            // Find the selected vaccine
            const selectedVaccine = vaccines.find(v => v.id === parseInt(selectedVaccineId) || v.id === selectedVaccineId);
            
            if (!selectedVaccine) {
                toast.error("Không tìm thấy vaccine");
                return;
            }

            // Check if vaccine already exists in the list
            const existingIndex = returnVaccinesList.findIndex(v => v.vaccineId === selectedVaccine.id);
            
            if (existingIndex !== -1) {
                // Update quantity if vaccine already exists
                const updatedList = [...returnVaccinesList];
                updatedList[existingIndex].quantity = parseInt(updatedList[existingIndex].quantity) + parseInt(quantity);
                setReturnVaccinesList(updatedList);
            } else {
                // Add new vaccine to the list
                setReturnVaccinesList([
                    ...returnVaccinesList,
                    {
                        vaccineId: selectedVaccine.id,
                        vaccineCode: selectedVaccine.vaccineCode,
                        name: selectedVaccine.name,
                        quantity: parseInt(quantity)
                    }
                ]);
            }

            // Reset selection
            setSelectedVaccineId('');
            setQuantity(1);
        };

        // Remove a vaccine from the return list
        const removeVaccine = (index) => {
            const updatedList = [...returnVaccinesList];
            updatedList.splice(index, 1);
            setReturnVaccinesList(updatedList);
        };

        // Handle form submission
        const handleSubmit = (e) => {
            e.preventDefault();
            
            if (!returnFormDoctor) {
                toast.warning("Vui lòng chọn bác sĩ");
                return;
            }

            if (returnVaccinesList.length === 0) {
                toast.warning("Vui lòng thêm vaccine để hoàn trả");
                return;
            }

            setShowConfirmation(true);
        };

        // Submit the return request to the API
        const submitReturnRequest = async () => {
            try {
                setIsSubmitting(true);
                
                const response = await axios({
                    method: 'PUT',
                    url: `${import.meta.env.VITE_BASE_URL}/api/v1/batches/returns`,
                    data: {
                        doctorId: returnFormDoctor,
                        shift: returnFormShift.toUpperCase(),
                        returned: returnVaccinesList.map(rv => ({
                            vaccineId: rv.vaccineId,
                            quantity: parseInt(rv.quantity)
                        }))
                    },
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                });
                
                if (response.status === 200) {
                    toast.success('Hoàn vaccine thành công');
                    setShowConfirmation(false);
                    setShowReturnModal(false);
                    // Refresh vaccine list if needed
                    if (selectedDoctor) {
                        callAPI();
                    }
                }
            } catch (error) {
                console.error("Error returning vaccines:", error);
                toast.error(error.response?.data?.error || "Lỗi khi hoàn vaccine");
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <>
                {/* Main Return Form Modal */}
                <Modal
                    show={showReturnModal && !showConfirmation}
                    onHide={() => setShowReturnModal(false)}
                    size="lg"
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Hoàn trả vaccine</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Bác sĩ:</Form.Label>
                                        <Form.Select
                                            className="rounded-0"
                                            value={returnFormDoctor}
                                            onChange={(e) => setReturnFormDoctor(e.target.value)}
                                            required
                                        >
                                            <option value="">Chọn bác sĩ</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.id} value={doctor.id}>
                                                    {doctor.firstName} {doctor.lastName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Ca:</Form.Label>
                                        <Form.Select
                                            className="rounded-0"
                                            value={returnFormShift}
                                            onChange={(e) => setReturnFormShift(e.target.value)}
                                            required
                                        >
                                            <option value="morning">Sáng</option>
                                            <option value="afternoon">Chiều</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Add vaccine section */}
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Thêm vaccine cần hoàn trả</Card.Title>
                                    <Row className="mb-2">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Vaccine:</Form.Label>
                                                <Form.Select
                                                    className="rounded-0"
                                                    value={selectedVaccineId}
                                                    onChange={(e) => setSelectedVaccineId(e.target.value)}
                                                >
                                                    <option value="">Chọn vaccine</option>
                                                    {vaccines.map((vaccine) => (
                                                        <option key={vaccine.id} value={vaccine.id}>
                                                            {vaccine.name} ({vaccine.vaccineCode})
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label>Số lượng:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="1"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                    className="rounded-0"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={2} className="d-flex align-items-end">
                                            <Button 
                                                variant="secondary" 
                                                onClick={addVaccineToReturn}
                                                className="w-100 rounded-0"
                                            >
                                                Thêm
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Selected vaccines table */}
                            <Card>
                                <Card.Body>
                                    <Card.Title>Danh sách vaccine hoàn trả</Card.Title>
                                    {returnVaccinesList.length > 0 ? (
                                        <Table striped bordered hover className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Mã vaccine</th>
                                                    <th>Tên vaccine</th>
                                                    <th>Số lượng</th>
                                                    <th>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {returnVaccinesList.map((vaccine, index) => (
                                                    <tr key={index}>
                                                        <td>{vaccine.vaccineCode}</td>
                                                        <td>{vaccine.name}</td>
                                                        <td>
                                                            <Form.Control
                                                                type="number"
                                                                min="1"
                                                                value={vaccine.quantity}
                                                                onChange={(e) => {
                                                                    const updatedList = [...returnVaccinesList];
                                                                    updatedList[index].quantity = e.target.value;
                                                                    setReturnVaccinesList(updatedList);
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <Button 
                                                                variant="danger" 
                                                                size="sm"
                                                                onClick={() => removeVaccine(index)}
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-3">
                                            Chưa có vaccine nào được thêm
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowReturnModal(false)}>
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit" disabled={returnVaccinesList.length === 0}>
                                Xác nhận hoàn trả
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                {/* Confirmation Modal */}
                <Modal
                    show={showConfirmation}
                    onHide={() => setShowConfirmation(false)}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận hoàn trả vaccine</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Bạn có chắc chắn muốn hoàn trả các vaccine sau đây?</p>
                        <ul>
                            {returnVaccinesList.map((vaccine, index) => (
                                <li key={index}>
                                    {vaccine.name} ({vaccine.vaccineCode}): {vaccine.quantity} liều
                                </li>
                            ))}
                        </ul>
                        <p className="fw-bold">Tổng cộng: {returnVaccinesList.reduce((sum, v) => sum + parseInt(v.quantity), 0)} liều</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            onClick={submitReturnRequest}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    };

    return (
        <>
            <Container className="mt-4">
                <Row className="d-flex">
                    <Col><ScheduleReport /></Col>
                </Row>
            </Container>
            
            {/* Return Vaccine Modal */}
            {showReturnModal && <ReturnVaccineModal />}
        </>
    );
};