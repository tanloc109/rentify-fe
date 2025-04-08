import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Table,
    Alert,
    InputGroup,
    Badge
} from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from '../App';
import dayjs from 'dayjs';

const VaccineInventoryAlerts = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs().add(30, 'day').format('YYYY-MM-DD'));
    const [inventoryAlerts, setInventoryAlerts] = useState([]);
    const [vaccinesQuantity, setVaccinesQuantity] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);

    // Calculate days between today and selected date
    const daysAhead = dayjs(selectedDate).diff(dayjs(), 'day');

    const fetchInventoryAlerts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/inventory/vaccine-alerts?days=${daysAhead}`, {
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'accept': 'application/json'
                }
            });

            setInventoryAlerts(response.data.data);
        } catch (err) {
            // setError('Không thể tải thông báo tồn kho');
            // console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuantitesOfVaccines = async () => {
        try {
            setLoading(true);
            const response = await axios({
                url: `${import.meta.env.VITE_BASE_URL}/api/v1/vaccines/quantities`,
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                }
            });
            if (response.status == 200) {
                setVaccinesQuantity(response.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInventoryAlerts();
    }, [selectedDate]);

    useEffect(() => {
        fetchQuantitesOfVaccines();
    }, [])

    const handleSearch = () => {
        fetchInventoryAlerts();
    };

    // Calculate summary of shortages with detailed vaccine information
    const calculateShortagesSummary = () => {
        const totalShortages = inventoryAlerts.reduce((acc, alert) => {
            const alertShortages = alert.vaccineRequirements.reduce((sum, req) => sum + req.shortage, 0);
            return acc + alertShortages;
        }, 0);

        // Get unique vaccines with shortages and their total shortage amounts
        const vaccinesWithShortage = inventoryAlerts
            .flatMap(alert => alert.vaccineRequirements)
            .filter(req => req.shortage > 0)
            .reduce((acc, req) => {
                if (!acc[req.vaccineCode]) {
                    acc[req.vaccineCode] = {
                        code: req.vaccineCode,
                        name: req.vaccineName,
                        totalShortage: 0
                    };
                }
                acc[req.vaccineCode].totalShortage += req.shortage;
                return acc;
            }, {});

        return {
            totalShortages,
            vaccinesWithShortage: Object.values(vaccinesWithShortage),
            uniqueVaccinesWithShortage: Object.keys(vaccinesWithShortage).length
        };
    };

    const renderVaccineRequirements = (requirements) => {
        return requirements.map((req, index) => (
            <tr key={index}
                className={
                    req.shortage > 0
                        ? 'table-danger'
                        : req.available < req.required
                            ? 'table-warning'
                            : ''
                }
            >
                <td>{req.vaccineCode}</td>
                <td>{req.vaccineName}</td>
                <td>{req.required}</td>
                <td>{req.available}</td>
                <td>{req.shortage}</td>
            </tr>
        ));
    };

    const { totalShortages, vaccinesWithShortage, uniqueVaccinesWithShortage } = calculateShortagesSummary();

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h2 className="text-center mb-4">Cảnh Báo Tồn Kho Vắc-xin</h2>

                    {/* Enhanced Shortage Summary Box */}
                    {totalShortages > 0 && (
                        <Card className="mb-4 bg-danger text-white">
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <h4 className="text-white">Tóm Tắt Cảnh Báo Thiếu Hụt</h4>
                                        <p>
                                            Tổng số thiếu hụt vắc-xin: <strong>{totalShortages}</strong>
                                        </p>
                                        <p>
                                            Số loại vắc-xin bị thiếu: <strong>{uniqueVaccinesWithShortage}</strong>
                                        </p>
                                        <div className="mt-3">
                                            <h5 className="text-white">Thông Tin Chi Tiết Về Thiếu Hụt:</h5>
                                            <Table responsive bordered variant="dark" className="text-white mt-2">
                                                <thead>
                                                    <tr>
                                                        <th>Mã Vắc-xin</th>
                                                        <th>Tên Vắc-xin</th>
                                                        <th>Tổng Số Liều Thiếu</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {vaccinesWithShortage.map((vaccine, idx) => (
                                                        <tr key={idx}>
                                                            <td>{vaccine.code}</td>
                                                            <td>{vaccine.name}</td>
                                                            <td>
                                                                <Badge bg="warning" text="dark">
                                                                    {vaccine.totalShortage} liều
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}

                    <Card className="mb-4">
                        <Card.Body>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={dayjs().format('YYYY-MM-DD')}
                                />
                                <Button variant="primary" onClick={handleSearch}>
                                    Tìm Kiếm
                                </Button>
                            </InputGroup>
                            <div className="text-muted">
                                Số ngày tới: {daysAhead} | Ngày đã chọn: {dayjs(selectedDate).format('DD/MM/YYYY')}
                            </div>
                        </Card.Body>
                    </Card>

                    {loading && <div className="text-center">Đang tải...</div>}

                    {error && (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    )}

                    {!loading && inventoryAlerts.length === 0 && (
                        <Alert variant="info">
                            Không tìm thấy cảnh báo tồn kho cho khoảng thời gian đã chọn.
                        </Alert>
                    )}

                    {inventoryAlerts.map((alert, index) => (
                        <Card key={index} className="mb-3">
                            <Card.Header>
                                <div className="d-flex justify-content-between align-items-center">
                                    <strong>
                                        {dayjs(alert.date).format('DD/MM/YYYY')}
                                        <span className="text-muted ms-2">
                                            ({alert.daysFromNow} ngày kể từ hôm nay)
                                        </span>
                                    </strong>
                                    {alert.vaccineRequirements.some(req => req.shortage > 0) && (
                                        <span className="badge bg-danger">Cảnh Báo Thiếu Hụt</span>
                                    )}
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Mã Vắc-xin</th>
                                            <th>Tên Vắc-xin</th>
                                            <th>Yêu Cầu</th>
                                            <th>Khả Dụng</th>
                                            <th>Thiếu Hụt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderVaccineRequirements(alert.vaccineRequirements)}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
            <Row>
                <Col>
                    <VaccineQuantitiesTable vaccinesQuantity={vaccinesQuantity} />
                </Col>
            </Row>
        </Container>
    );
};

const VaccineQuantitiesTable = ({vaccinesQuantity}) => {
    // Function to check if a date is within the next 14 days
    const isWithinTwoWeeks = (dateString) => {
        if (!dateString) return false;
        const expiryDate = dayjs(dateString);
        const today = dayjs();
        const twoWeeksFromNow = today.add(14, 'day');
        return expiryDate.isBefore(twoWeeksFromNow) && expiryDate.isAfter(today);
    };

    // Count vaccines expiring soon
    const expiringVaccines = vaccinesQuantity.filter(vac =>
        vac.quantityAboutToBeExpired > 0 && isWithinTwoWeeks(vac.dateAboutToBeExpired)
    );

    const expiringCount = expiringVaccines.length;

    return (
        <div className="mt-4">
            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Quản Lý Số Lượng Vắc-xin</h4>
                    {expiringCount > 0 && (
                        <span className="badge bg-warning text-dark">
                            {expiringCount} vắc-xin sắp hết hạn
                        </span>
                    )}
                </div>
                <div className="card-body">
                    {expiringCount > 0 && (
                        <div className="alert alert-warning mb-3">
                            <strong>Cảnh báo:</strong> Có {expiringCount} loại vắc-xin sẽ hết hạn trong vòng 14 ngày tới. Vui lòng kiểm tra và xử lý kịp thời.
                        </div>
                    )}

                    {expiringCount > 0 && (
                        <div className="card mb-3 bg-warning">
                            <div className="card-body">
                                <h5>Danh Sách Vắc-xin Sắp Hết Hạn</h5>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>Mã Vắc-xin</th>
                                                <th>Số Lượng Sắp Hết Hạn</th>
                                                <th>Ngày Hết Hạn</th>
                                                <th>Còn Lại (Ngày)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expiringVaccines.map(vaccine => {
                                                const daysLeft = dayjs(vaccine.dateAboutToBeExpired).diff(dayjs(), 'day');

                                                return (
                                                    <tr key={`expiring-${vaccine.vaccineId}`}>
                                                        <td><strong>{vaccine.vaccineCode}</strong></td>
                                                        <td>{vaccine.quantityAboutToBeExpired}</td>
                                                        <td>{dayjs(vaccine.dateAboutToBeExpired).format('DD/MM/YYYY')}</td>
                                                        <td>
                                                            <span className={`badge ${daysLeft <= 7 ? "bg-danger" : "bg-warning"}`}>
                                                                {daysLeft} ngày
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr className="table-primary">
                                    <th>Mã Vắc-xin</th>
                                    <th>Tổng Số Lượng</th>
                                    <th>Đã Lên Lịch</th>
                                    <th>Đã Hết Hạn</th>
                                    <th>Sắp Hết Hạn</th>
                                    <th>Ngày Hết Hạn Gần Nhất</th>
                                    <th>Ngày Hết Hạn Cuối Cùng</th>
                                    <th>Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vaccinesQuantity.map((vaccine) => {
                                    const isExpiringSoon = vaccine.quantityAboutToBeExpired > 0 &&
                                        isWithinTwoWeeks(vaccine.dateAboutToBeExpired);

                                    return (
                                        <tr
                                            key={vaccine.vaccineId}
                                            className={isExpiringSoon ? 'table-warning' : ''}
                                        >
                                            <td><strong>{vaccine.vaccineCode}</strong></td>
                                            <td>{vaccine.totalQuantity}</td>
                                            <td>{vaccine.scheduledQuantity}</td>
                                            <td>{vaccine.expiredQuantity}</td>
                                            <td>
                                                {vaccine.quantityAboutToBeExpired > 0 ? (
                                                    <strong className={isExpiringSoon ? 'text-danger' : ''}>
                                                        {vaccine.quantityAboutToBeExpired}
                                                    </strong>
                                                ) : 0}
                                            </td>
                                            <td>
                                                {vaccine.dateAboutToBeExpired && vaccine.quantityAboutToBeExpired > 0 ? (
                                                    <span className={isExpiringSoon ? 'text-danger fw-bold' : ''}>
                                                        {dayjs(vaccine.dateAboutToBeExpired).format('DD/MM/YYYY')}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                {vaccine.latestExpiresIn ? (
                                                    dayjs(vaccine.latestExpiresIn).format('DD/MM/YYYY')
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                {isExpiringSoon ? (
                                                    <span className="badge bg-danger">Sắp hết hạn</span>
                                                ) : vaccine.quantityAboutToBeExpired > 0 ? (
                                                    <span className="badge bg-info">Cần theo dõi</span>
                                                ) : (
                                                    <span className="badge bg-success">An toàn</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-3">
                        <h6>Chú thích:</h6>
                        <ul className="small">
                            <li><span className="badge bg-danger">Sắp hết hạn</span> - Vắc-xin sẽ hết hạn trong vòng 14 ngày tới.</li>
                            <li><span className="badge bg-info">Cần theo dõi</span> - Vắc-xin có số lượng sắp hết hạn nhưng không trong 14 ngày tới.</li>
                            <li><span className="badge bg-success">An toàn</span> - Vắc-xin không có số lượng sắp hết hạn.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VaccineInventoryAlerts;