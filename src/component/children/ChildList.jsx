import React, { useState, useEffect, useContext } from "react";
import ChildForm from "./ChildForm";
import { Container, Row, Col, Modal, Button, ListGroup, Table, Card } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../../App";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { getScheduleDetail } from "../../services/doctorVaccineConfirmationService";
import { scheduleEnums } from "../../context/enums";

const ChildList = () => {
    const [children, setChildren] = useState([]);
    const [editingChild, setEditingChild] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedChildHistory, setSelectedChildHistory] = useState(null);
    const [deleteChildId, setDeleteChildId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { user } = useContext(UserContext);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [scheduleModal, setScheduleModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const token = user.accessToken;

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/children/parent`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });
            setChildren(response.data.data);
        } catch (error) {
            console.error("Error fetching children:", error);
            toast.error("Không thể tải danh sách trẻ. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (childData) => {
        try {
            setIsLoading(true);

            if (editingChild) {
                // Update existing child
                const response = await axios.put(
                    `${import.meta.env.VITE_BASE_URL}/api/v1/children/${editingChild.id}`,
                    childData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'accept': '*/*'
                        }
                    }
                );

                // Update local state
                setChildren(children.map(child =>
                    child.id === editingChild.id ? { ...child, ...response.data.data } : child
                ));

                toast.success("Cập nhật thông tin trẻ thành công!");
                setShowForm(false);
                setEditingChild(null);
            } else {
                // Add new child
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/v1/children`,
                    childData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'accept': '*/*'
                        }
                    }
                );

                // Update local state
                setChildren([...children, response.data.data]);

                toast.success("Thêm trẻ mới thành công!");
                setShowForm(false);
            }
        } catch (error) {
            console.error("Error saving child:", error);

            // Handle validation errors from backend
            if (error.response && error.response.data) {
                if (error.response.data.error) {
                    // Display validation errors
                    Object.values(error.response.data.error).forEach(errorMsg => {
                        toast.error(errorMsg);
                    });
                } else if (error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại sau.");
                }
            } else {
                toast.error("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại sau.");
            }

            // Rethrow to be caught in the form component
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteChildId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteChildId) return;

        try {
            setIsLoading(true);
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/children/${deleteChildId}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
            });
            setChildren(children.filter(child => child.id !== deleteChildId));
            toast.success("Đã xóa trẻ thành công!");
        } catch (error) {
            console.error("Error deleting child:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Không thể xóa trẻ. Vui lòng thử lại sau.");
            }
        } finally {
            setShowDeleteModal(false);
            setDeleteChildId(null);
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingChild(null);
    };

    const handleViewHistory = (childId) => {
        const selectedChild = children.find(child => child.id === childId);

        if (!selectedChild || !selectedChild.injectionHistories || selectedChild.injectionHistories.length === 0) {
            toast.info("Trẻ này chưa có lịch sử tiêm chủng.");
            return;
        }

        const groupedHistories = selectedChild.injectionHistories
            .filter(history => history.status !== 'DRAFT' && history.status !== 'CANCELLED') // Filter out histories with status 'DRAFT'
            .reduce((acc, history) => {
                const dateTime = dayjs(history.dateTime).format('YYYY-MM-DD HH:mm:ss');
                if (!acc[dateTime]) {
                    acc[dateTime] = [];
                }

                acc[dateTime].push({
                    name: history.vaccine,
                    status: history.status === 'COMPLETED' ? 'Đã tiêm' : 'Chưa tiêm',
                    originalDateTime: history.dateTime,
                    isPast: dayjs(history.dateTime).isBefore(dayjs()),
                    statusEnum: history.status,
                    scheduleId: history.id
                });
                return acc;
            }, {});

        const formattedHistory = Object.entries(groupedHistories)
            .map(([dateTime, vaccines]) => ({
                date: dateTime,
                vaccines: vaccines
            }))
            .sort((a, b) => {
                return new Date(b.vaccines[0].originalDateTime) - new Date(a.vaccines[0].originalDateTime);
            });

        setSelectedChildHistory(formattedHistory);
        setShowHistoryModal(true);
    };

    const handleCloseHistoryModal = () => {
        setShowHistoryModal(false);
        setSelectedChildHistory(null);
    };

    const handleViewScheduleDetails = async (scheduleId) => {
        try {
            setIsLoading(true);
            const details = await getScheduleDetail({
                accessToken: user.accessToken,
                scheduleId: scheduleId
            });

            if (details) {
                setSelectedSchedule(details);
                setScheduleModal(true);
            }
        } catch (error) {
            console.error("Error fetching schedule details:", error);
            toast.error("Không thể tải chi tiết lịch tiêm. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Danh sách trẻ</h2>
            <Button
                variant="primary"
                onClick={() => setShowForm(true)}
                className="mb-3"
                disabled={isLoading}
            >
                {isLoading ? "Đang xử lý..." : "Thêm trẻ mới"}
            </Button>

            {isLoading && !showForm ? (
                <div className="text-center my-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr className="text-center">
                            <th>Họ và tên</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>Cân nặng</th>
                            <th>Chiều cao</th>
                            <th>Nhóm máu</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {children.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">Không có dữ liệu</td>
                            </tr>
                        ) : (
                            children.map((child) => (
                                <tr key={child.id} className="text-center">
                                    <td>{child.firstName} {child.lastName}</td>
                                    <td>{new Date(child.dob).toLocaleDateString("vi-VN")}</td>
                                    <td>{child.gender === 'MALE' ? 'Nam' : 'Nữ'}</td>
                                    <td>{child.weight} kg</td>
                                    <td>{child.height} cm</td>
                                    <td>{child.bloodType}</td>
                                    <td style={{ minWidth: '170px' }}>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingChild(child);
                                                    setShowForm(true);
                                                }}
                                                disabled={isLoading}
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(child.id)}
                                                disabled={isLoading}
                                            >
                                                Xóa
                                            </Button>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                onClick={() => handleViewHistory(child.id)}
                                                disabled={isLoading}
                                            >
                                                Sổ tiêm
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            {/* Modal thêm/sửa thông tin trẻ */}
            <Modal show={showForm} onHide={handleCancel} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{editingChild ? "Chỉnh sửa thông tin trẻ" : "Thêm trẻ mới"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ChildForm childData={editingChild} onSave={handleSave} onCancel={handleCancel} />
                </Modal.Body>
            </Modal>

            {/* Modal hiển thị lịch sử tiêm */}
            <Modal show={showHistoryModal} onHide={handleCloseHistoryModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sổ tiêm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!selectedChildHistory || selectedChildHistory.length === 0 ? (
                        <p className="text-center">Không có lịch sử tiêm.</p>
                    ) : (
                        <ListGroup>
                            {selectedChildHistory.map((vaccinationDay, index) => (
                                <ListGroup.Item
                                    key={index}
                                    className={
                                        vaccinationDay.vaccines[0].isPast
                                            ? 'bg-light text-muted'
                                            : vaccinationDay.vaccines[0].statusEnum === 'PLANNED'
                                                ? 'bg-info bg-opacity-10'
                                                : ''
                                    }
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <strong>{dayjs(vaccinationDay.date).format('DD/MM/YYYY HH:mm')}</strong>
                                        {vaccinationDay.vaccines[0].isPast && (
                                            <span className="badge bg-secondary">Đã qua</span>
                                        )}
                                        {!vaccinationDay.vaccines[0].isPast && vaccinationDay.vaccines[0].statusEnum === 'PLANNED' && (
                                            <span className="badge bg-primary">Sắp tới</span>
                                        )}
                                    </div>
                                    <ul className="mt-2">
                                        {vaccinationDay.vaccines.map((vaccine, idx) => (
                                            <li
                                                key={idx}
                                                className={vaccine.isPast ? 'text-muted' : ''}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleViewScheduleDetails(vaccine.scheduleId)}
                                            >
                                                {vaccine.name} - Trạng thái: {vaccine.status}
                                            </li>
                                        ))}
                                    </ul>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseHistoryModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xác nhận xóa */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa trẻ này?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirmDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : "Xóa"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal chi tiết lịch tiêm */}
            <Modal show={scheduleModal} onHide={() => setScheduleModal(false)} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết lịch tiêm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedSchedule && (
                        <Container>
                            <Row>
                                <Col>
                                    <Card className="schedule-card rounded-0">
                                        <Card.Body>
                                            <Card.Title>Thông tin trẻ</Card.Title>
                                            <hr />
                                            <Card.Text><strong>Tên:</strong> {selectedSchedule.child.firstName} {selectedSchedule.child.lastName}</Card.Text>
                                            <Card.Text><strong>Giới tính:</strong> {selectedSchedule.child.gender == 'MALE' ? 'Nam' : 'Nữ'}</Card.Text>
                                            <Card.Text><strong>Ngày sinh:</strong> {selectedSchedule.child.dob}</Card.Text>
                                            <Card.Text><strong>Nhóm máu:</strong> {selectedSchedule.child.bloodType}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card className="schedule-card rounded-0">
                                        <Card.Body>
                                            <Card.Title>Thông tin tiêm chủng</Card.Title>
                                            <hr />
                                            <Card.Text><strong>Tên vaccine:</strong> {selectedSchedule.vaccine.name}</Card.Text>
                                            <Card.Text><strong>Mã vaccine:</strong> {selectedSchedule.vaccine.vaccineCode}</Card.Text>
                                            <Card.Text><strong>Chi tiết vaccine:</strong> {selectedSchedule.vaccine.description}</Card.Text>
                                            <Card.Text><strong>Trạng thái:</strong> {scheduleEnums[selectedSchedule.status]}</Card.Text>

                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            {selectedSchedule.status === 'COMPLETED' && (
                                <Row>
                                    <Col>
                                        <Card className="rounded-0 mt-4">
                                            <Card.Body>
                                                <Card.Title>Thông tin lịch tiêm đã hoàn tất</Card.Title>
                                                <hr />

                                                <div>
                                                    <Card.Text><strong>Feedback:</strong> {selectedSchedule.feedback ? selectedSchedule.feedback : "Không có"}</Card.Text>
                                                    <Card.Text>
                                                        <strong>Phản ứng sau tiêm:</strong>
                                                        {selectedSchedule?.reactions && selectedSchedule?.reactions.length > 0 ? (
                                                            <ul>
                                                                {selectedSchedule?.reactions.map((reaction, index) => (
                                                                    <li key={index}>{reaction.reaction}</li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            " Không có phản ứng."
                                                        )}
                                                    </Card.Text>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            )}
                        </Container>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ChildList;