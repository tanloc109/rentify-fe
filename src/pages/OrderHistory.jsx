import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Modal, Card, Badge, Row, Col, Container, Spinner } from "react-bootstrap";
import { getOrderHistoryByCustomerId } from "../services/customerService";
import { UserContext } from "../App";
import { toast } from "react-toastify";
import axios from "axios";
import { orderEnums, scheduleEnums, serviceTypeEnums } from "../context/enums";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [show, setShow] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [refundAmount, setRefundAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { user } = useContext(UserContext);
    const accessToken = user?.accessToken;
    const customerId = user?.userId;

    useEffect(() => {
        fetchOrderHistory();
    }, [accessToken, customerId]);

    const fetchOrderHistory = async () => {
        if (!accessToken || !customerId) return;

        try {
            setIsPageLoading(true);
            const data = await getOrderHistoryByCustomerId(accessToken, customerId);
            setOrders(data);
        } catch (error) {
            toast.error(error.message || "Không thể tải lịch sử đơn hàng");
        } finally {
            setIsPageLoading(false);
        }
    };

    const handleShow = (order) => {
        setSelectedOrder(order);
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const handleCancelModalClose = () => {
        setShowCancelModal(false);
        setCancelOrderId(null);
        setRefundAmount(0);
    };

    const handleCancelButtonClick = async (orderId) => {
        try {
            setIsLoading(true);

            // Call API to get refund amount
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/orders/${orderId}/refund/amount`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        accept: "application/json"
                    }
                }
            );

            if (response.data && response.data.data) {
                setRefundAmount(response.data.data);
                setCancelOrderId(orderId);
                setShowCancelModal(true);
            }
        } catch (error) {
            console.error("Error calculating refund amount:", error);
            toast.error("Không thể tính số tiền hoàn lại. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    const confirmCancelOrder = async () => {
        if (!cancelOrderId) return;

        try {
            setIsLoading(true);

            // Call API to cancel order
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/orders/${cancelOrderId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        accept: "application/json"
                    }
                }
            );

            if (response.data && response.data.data && response.data.data.success) {
                toast.success("Hủy lịch hẹn thành công!");
                handleCancelModalClose();
                fetchOrderHistory(); // Refresh order list
            } else {
                toast.error("Hủy lịch hẹn không thành công. Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error("Hủy lịch hẹn không thành công. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to check if an order has future appointments
    const hasFutureAppointments = (order) => {
        if (!order.vaccineSchedules || order.vaccineSchedules.length === 0) return false;

        return order.vaccineSchedules.some(schedule => {
            return schedule.status === "PLANNED" && new Date(schedule.date) > new Date();
        });
    };

    // Function to get status badge variant
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "COMPLETED":
                return "success";
            case "CANCELLED":
                return "danger";
            case "PENDING":
                return "warning";
            case "PAID":
                return "primary";
            default:
                return "secondary";
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <Container className="my-5">
            <Card className="border-0 shadow">
                <Card.Header className="bg-white border-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-0">Lịch Sử Đặt Lịch Tiêm</h3>
                    </div>
                </Card.Header>
                <Card.Body className="px-4 py-4">
                    {isPageLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" role="status" variant="primary">
                                <span className="visually-hidden">Đang tải...</span>
                            </Spinner>
                            <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-3">
                                <i className="bi bi-calendar-x" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                            </div>
                            <h5 className="text-muted">Chưa có lịch sử đặt lịch tiêm</h5>
                            <p className="text-muted">Các lịch tiêm của bạn sẽ hiển thị ở đây sau khi đặt.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead>
                                    <tr className="bg-light">
                                        <th className="py-3">Mã đơn hàng</th>
                                        <th className="py-3">Ngày đặt</th>
                                        <th className="py-3">Dịch vụ</th>
                                        <th className="py-3 text-center">Trạng thái</th>
                                        <th className="py-3 text-end">Tổng tiền</th>
                                        <th className="py-3 text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders
                                        .sort((a, b) => new Date(a.orderId) - new Date(b.orderId))
                                        .map((order) => (
                                            <tr key={order.orderId} className="order-row">
                                                <td>
                                                    <span className="fw-medium">#{order.orderId}</span>
                                                </td>
                                                <td>
                                                    <div>{formatDate(order.bookDate)}</div>
                                                </td>
                                                <td>
                                                    <div>{serviceTypeEnums[order.serviceType]}</div>
                                                    <small className="text-muted">Bé {order.childName}</small>
                                                </td>
                                                <td className="text-center">
                                                    <Badge 
                                                        bg={getStatusBadgeVariant(order.orderStatus)} 
                                                        className="rounded-pill px-3 py-2"
                                                    >
                                                        {orderEnums[order.orderStatus]}
                                                    </Badge>
                                                </td>
                                                <td className="text-end fw-bold">
                                                    {order.totalPrice.toLocaleString()} VND
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleShow(order)}
                                                            className="d-flex align-items-center justify-content-center"
                                                        >
                                                            <i className="bi bi-eye me-1"></i> Chi tiết
                                                        </Button>

                                                        {hasFutureAppointments(order) && (
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleCancelButtonClick(order.orderId)}
                                                                disabled={isLoading}
                                                                className="d-flex align-items-center justify-content-center"
                                                            >
                                                                {isLoading && cancelOrderId === order.orderId ? (
                                                                    <>
                                                                        <Spinner
                                                                            as="span"
                                                                            animation="border"
                                                                            size="sm"
                                                                            role="status"
                                                                            aria-hidden="true"
                                                                            className="me-1"
                                                                        />
                                                                        Đang xử lý
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="bi bi-x-circle me-1"></i> Hủy lịch
                                                                    </>
                                                                )}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Detail Modal */}
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title as="h4">
                        Chi tiết đơn hàng <span className="text-primary">#{selectedOrder?.orderId}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    {selectedOrder && (
                        <>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Card className="border-0 bg-light">
                                        <Card.Body className="p-3">
                                            <h6 className="text-uppercase text-muted mb-3">
                                                <i className="bi bi-info-circle me-2"></i>
                                                Thông tin đơn hàng
                                            </h6>
                                            <div className="mb-2">
                                                <span className="text-muted">Khách hàng:</span>
                                                <span className="ms-2 fw-medium">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="text-muted">Trẻ:</span>
                                                <span className="ms-2 fw-medium">{selectedOrder.childName}</span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="text-muted">Ngày đặt:</span>
                                                <span className="ms-2 fw-medium">{formatDate(selectedOrder.bookDate)}</span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="text-muted">Loại dịch vụ:</span>
                                                <span className="ms-2 fw-medium">{serviceTypeEnums[selectedOrder.serviceType]}</span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 bg-light h-100">
                                        <Card.Body className="p-3 d-flex flex-column">
                                            <h6 className="text-uppercase text-muted mb-3">
                                                <i className="bi bi-credit-card me-2"></i>
                                                Thông tin thanh toán
                                            </h6>
                                            <div className="mb-2">
                                                <span className="text-muted">Trạng thái:</span>
                                                <Badge 
                                                    bg={getStatusBadgeVariant(selectedOrder.orderStatus)} 
                                                    className="ms-2 rounded-pill px-2"
                                                >
                                                    {orderEnums[selectedOrder.orderStatus]}
                                                </Badge>
                                            </div>
                                            <div className="mb-2">
                                                <span className="text-muted">Tổng tiền:</span>
                                                <span className="ms-2 fw-bold">{selectedOrder.totalPrice.toLocaleString()} VND</span>
                                            </div>
                                            <div className="mt-auto">
                                                {hasFutureAppointments(selectedOrder) && (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleCancelButtonClick(selectedOrder.orderId)}
                                                        disabled={isLoading}
                                                        className="mt-2"
                                                    >
                                                        <i className="bi bi-x-circle me-1"></i>
                                                        {isLoading && cancelOrderId === selectedOrder.orderId ? 'Đang xử lý...' : 'Hủy lịch hẹn'}
                                                    </Button>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            
                            <Card className="border-0 shadow-sm mb-3">
                                <Card.Header className="bg-white py-3">
                                    <h5 className="mb-0">
                                        <i className="bi bi-syringe me-2"></i>
                                        Danh sách vaccine ({selectedOrder.vaccineSchedules.length})
                                    </h5>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <Table hover className="mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="py-3">Mã</th>
                                                    <th className="py-3">Ngày tiêm</th>
                                                    <th className="py-3">Tên vaccine</th>
                                                    <th className="py-3">Combo</th>
                                                    <th className="py-3 text-center">Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedOrder.vaccineSchedules
                                                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                                                    .map((vaccine) => {
                                                        const isPast = new Date(vaccine.date) < new Date();
                                                        const statusClass = 
                                                            vaccine.status === "COMPLETED" ? "success" :
                                                            vaccine.status === "CANCELLED" ? "danger" :
                                                            isPast ? "warning" : "primary";
                                                            
                                                        return (
                                                            <tr key={vaccine.id}>
                                                                <td className="py-3">#{vaccine.id}</td>
                                                                <td className="py-3">
                                                                    <div>{formatDate(vaccine.date)}</div>
                                                                    {isPast && vaccine.status === "PLANNED" && (
                                                                        <small className="text-warning">Đã quá hạn</small>
                                                                    )}
                                                                </td>
                                                                <td className="py-3 fw-medium">{vaccine.vaccineName}</td>
                                                                <td className="py-3">{vaccine.comboName || "—"}</td>
                                                                <td className="py-3 text-center">
                                                                    <Badge 
                                                                        bg={statusClass} 
                                                                        className="rounded-pill px-3 py-2"
                                                                    >
                                                                        {scheduleEnums[vaccine.status]}
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Cancel Confirmation Modal */}
            <Modal show={showCancelModal} onHide={handleCancelModalClose} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title>Xác nhận hủy lịch hẹn</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <div className="text-center mb-4">
                        <div className="badge bg-danger p-3 rounded-circle mb-3">
                            <i className="bi bi-exclamation-triangle fs-4"></i>
                        </div>
                        <h5>Bạn có chắc chắn muốn hủy các lịch hẹn trong tương lai không?</h5>
                    </div>

                    <Card className="border-0 bg-light mb-4">
                        <Card.Body className="p-3">
                            <h6 className="text-uppercase text-muted mb-3 small">
                                <i className="bi bi-cash-coin me-2"></i>
                                Thông tin hoàn tiền
                            </h6>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span>Số tiền hoàn lại:</span>
                                <span className="fw-bold fs-5 text-success">{refundAmount.toLocaleString()} VND</span>
                            </div>
                            <small className="text-muted">
                                Tiền sẽ được hoàn về phương thức thanh toán ban đầu trong vòng 7-14 ngày làm việc.
                            </small>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 bg-light">
                        <Card.Body className="p-3">
                            <h6 className="text-uppercase text-muted mb-3 small">
                                <i className="bi bi-info-circle me-2"></i>
                                Chính sách hoàn tiền
                            </h6>
                            <ul className="small text-muted ps-3 mb-0">
                                <li className="mb-1">Hủy dưới 7 ngày: không hoàn tiền</li>
                                <li className="mb-1">Hủy trước 7-14 ngày: hoàn lại 30%</li>
                                <li className="mb-1">Hủy trước 14-30 ngày: hoàn lại 50%</li>
                                <li className="mb-0">Hủy trước hơn 30 ngày: hoàn lại 80%</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-2">
                    <div className="d-flex w-100 gap-2">
                        <Button variant="outline-secondary" className="w-50" onClick={handleCancelModalClose}>
                            Đóng
                        </Button>
                        <Button
                            variant="danger"
                            className="w-50"
                            onClick={confirmCancelOrder}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Đang xử lý
                                </>
                            ) : (
                                'Xác nhận hủy'
                            )}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            <style>{`
                .order-row:hover {
                    background-color: #f8f9fa;
                    transition: background-color 0.2s ease;
                }
                
                .text-muted {
                    color: #6c757d !important;
                }
                
                .fw-medium {
                    font-weight: 500 !important;
                }
                
                .table th {
                    font-weight: 600;
                    color: #495057;
                }
                
                .bg-light {
                    background-color: #f8f9fa !important;
                }
                
                .shadow {
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
                }
                
                .shadow-sm {
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.05) !important;
                }
            `}</style>
        </Container>
    );
};

export default OrderHistory;