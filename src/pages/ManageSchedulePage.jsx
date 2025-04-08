import React, { useContext, useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { getVaccinesByCustomer, saveFeedback, addVaccineReaction, updateExistingSchedule } from '../services/vaccineScheduleService';
import { getScheduleDetail } from '../services/doctorVaccineConfirmationService';
import { UserContext } from '../App';
import { Modal, Container, Row, Col, Card, ListGroup, Pagination, Button, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import StarRating from './StarRating';
import { useNavigate } from 'react-router';
import { scheduleEnums, serviceTypeEnums } from '../context/enums';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

export const ManageSchedulePage = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [show, setShow] = useState(false);
    const [selectedTab, setSelectedTab] = useState('PLANNED');

    const [scheduleIndex, setScheduleIndex] = useState(0);
    const [dateSchedules, setDateSchedules] = useState([]);

    // Define page size first
    const pageSize = 15;

    // Store planned and completed schedules separately
    const [plannedSchedules, setPlannedSchedules] = useState([]);
    const [completedSchedules, setCompletedSchedules] = useState([]);

    // Get the relevant schedules based on selected tab
    const displayedSchedules = selectedTab === 'PLANNED'
        ? plannedSchedules
        : completedSchedules.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const { user } = useContext(UserContext);
    const userFullName = `${user.firstName} ${user.lastName}`;

    // Changed from string to number rating (1-5)
    const [feedback, setFeedback] = useState(5); // Default to 5 stars
    const [reaction, setReaction] = useState('');

    useEffect(() => {
        fetchAllSchedules();
    }, []);

    // Add effect for when the tab changes
    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 when switching tabs
    }, [selectedTab]);

    // Effect for pagination when tab is COMPLETED
    useEffect(() => {
        if (selectedTab === 'COMPLETED') {
            const totalCompletedPages = Math.ceil(completedSchedules.length / pageSize);
            setTotalPages(totalCompletedPages);
        }
    }, [selectedTab, completedSchedules]);

    const fetchAllSchedules = async () => {
        // Set a large page size to fetch all schedules in one request
        // Since we need to provide pagination parameters, use page 1 with a large size
        const data = await getVaccinesByCustomer({
            accessToken: user.accessToken,
            customerId: user.userId,
            pageNo: 1,
            pageSize: 1000 // Use a large number to get all schedules
        });

        if (data) {
            setSchedules(data.data);

            // Separate planned and completed schedules
            const planned = data.data
                .filter(schedule => schedule.status === 'PLANNED')
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            const completed = data.data
                .filter(schedule => schedule.status === 'COMPLETED')
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            setPlannedSchedules(planned);
            setCompletedSchedules(completed);

            // Set total pages based on completed schedules (planned will show all)
            setTotalPages(Math.ceil(completed.length / pageSize));
        }
    };

    const fetchScheduleDetails = async (scheduleId) => {
        const allSchedules = [...plannedSchedules, ...completedSchedules];
        const selectedDate = allSchedules.find(s => s.id === scheduleId)?.date;

        if (selectedDate) {
            const schedulesOnDate = allSchedules.filter(s =>
                dayjs(s.date).isSame(dayjs(selectedDate), 'day'));
            setDateSchedules(schedulesOnDate);
            setScheduleIndex(schedulesOnDate.findIndex(s => s.id === scheduleId));
        }

        const details = await getScheduleDetail({ accessToken: user.accessToken, scheduleId: scheduleId });
        if (details) {
            setSelectedSchedule(details);
            setModal(true);

            // Set the feedback
            const numericFeedback = details.feedback
                ? (parseInt(details.feedback) >= 1 && parseInt(details.feedback) <= 5
                    ? parseInt(details.feedback)
                    : 5)
                : 5;
            setFeedback(numericFeedback);
        }
    };

    const goToPreviousSchedule = () => {
        if (scheduleIndex > 0) {
            setScheduleIndex(prevIndex => {
                fetchScheduleDetails(dateSchedules[prevIndex - 1].id);
                return prevIndex - 1;
            });
        }
    };

    const goToNextSchedule = () => {
        if (scheduleIndex < dateSchedules.length - 1) {
            setScheduleIndex(prevIndex => {
                fetchScheduleDetails(dateSchedules[prevIndex + 1].id);
                return prevIndex + 1;
            });
        }
    };

    const updateFeedback = async (scheduleId) => {
        // Now sending a numeric rating (1-5) instead of text
        await saveFeedback({
            scheduleId: scheduleId,
            feedback: feedback.toString(), // Convert to string for API
            accessToken: user.accessToken
        });
        await fetchScheduleDetails(scheduleId);
    }

    const handleReschedule = async () => {
        navigate(`/quan-li-lich-tiem/${selectedSchedule.id}`);
    };

    const addReaction = async (scheduleId) => {
        await addVaccineReaction({
            scheduleId: scheduleId,
            reaction: reaction,
            accessToken: user.accessToken,
            userFullName
        });
        await fetchScheduleDetails(scheduleId);
        setReaction('');
    }

    return (
        <Container fluid className="schedule-container">
            <Row>
                {/* Left Side: Calendar */}
                <Col md={3} className="calendar-wrapper">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            onChange={(date) => {
                                const selected = plannedSchedules
                                    .find(s => dayjs(s.date).isSame(dayjs(date), 'day'));
                                if (selected) fetchScheduleDetails(selected.id);
                            }}
                            slots={{
                                day: (props) => {
                                    const hasSchedule = plannedSchedules
                                        .some(s => dayjs(s.date).isSame(dayjs(props.day), 'day'));

                                    return (
                                        <div style={{ position: 'relative' }}>
                                            <PickersDay {...props} />
                                            {hasSchedule && (
                                                <span
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 2,
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        width: 6,
                                                        height: 6,
                                                        backgroundColor: 'red',
                                                        borderRadius: '50%',
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Col>

                {/* Right Side: List of Schedules */}
                <Col className="schedule-list">
                    <Container className="schedule-section">
                        {/* Buttons to switch lists */}
                        <Row className="justify-content-center mb-4">
                            <Col xs="auto">
                                <Button
                                    variant={selectedTab === 'PLANNED' ? 'dark' : 'outline-dark'}
                                    className="btn-toggle rounded-0"
                                    onClick={() => setSelectedTab('PLANNED')}
                                >
                                    Lịch tiêm sắp tới
                                </Button>
                            </Col>
                            <Col xs="auto">
                                <Button
                                    variant={selectedTab === 'COMPLETED' ? 'dark' : 'outline-dark'}
                                    className="btn-toggle rounded-0"
                                    onClick={() => {
                                        setSelectedTab('COMPLETED');
                                        setCurrentPage(1); // Reset to first page when switching to completed
                                    }}
                                >
                                    Lịch tiêm đã hoàn tất
                                </Button>
                            </Col>
                        </Row>

                        {/* List of schedules */}
                        <ListGroup className="shadow-sm rounded">
                            {displayedSchedules.length > 0 ? (
                                displayedSchedules
                                .map((schedule) => (
                                    <ListGroup.Item
                                        key={schedule.id}
                                        action
                                        onClick={() => fetchScheduleDetails(schedule.id)}
                                        className="rounded-0 list-item"
                                    >
                                        <strong>{schedule.vaccineName}</strong> - Ngày {dayjs(schedule.date).format('DD/MM/YYYY HH:mm')} - Bé {schedule.childName} - Bác sĩ {schedule.doctorName}
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <p className="text-center text-muted mt-3">Không có lịch tiêm nào</p>
                            )}
                        </ListGroup>

                        <style>
                            {`
                                .schedule-section {
                                    padding: 30px;
                                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                                }

                                .btn-toggle {
                                    min-width: 180px;
                                    transition: all 0.3s ease;
                                }

                                .list-item {
                                    font-size: 16px;
                                    border-left: 5px solid #343a40;
                                    transition: all 0.3s ease;
                                }

                                .list-item:hover {
                                    background: #f8f9fa;
                                    border-left: 5px solid #000;
                                }
                            `}
                        </style>
                    </Container>

                    {/* Pagination Controls - Only show for COMPLETED tab */}
                    {selectedTab === 'COMPLETED' && totalPages > 1 && (
                        <Pagination className="mt-3 justify-content-end">
                            <Pagination.Prev
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            />
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    )}
                </Col>
            </Row>

            {/* Modal for Schedule Details */}
            <Modal show={modal} onHide={() => setModal(false)} size="xl">
                <Modal.Header className="flex-column align-items-center">
                    <div className="w-100 d-flex justify-content-center">
                        <Modal.Title>Chi tiết lịch tiêm</Modal.Title>
                    </div>
                    {dateSchedules.length > 1 && (
                        <div className="w-100 d-flex justify-content-between align-items-center mt-2">
                            <Button
                                variant="light"
                                className="d-flex align-items-center justify-content-center"
                                disabled={scheduleIndex === 0}
                                onClick={goToPreviousSchedule}
                            >
                                Xem lịch tiêm trước
                            </Button>
                            <Button
                                variant="light"
                                className="d-flex align-items-center justify-content-center"
                                disabled={scheduleIndex === dateSchedules.length - 1}
                                onClick={goToNextSchedule}
                            >
                                Xem lịch tiêm tiếp theo
                            </Button>
                        </div>
                    )}
                </Modal.Header>

                <Modal.Body>
                    {selectedSchedule && (
                        <Container>
                            <Row className='mb-3'>
                                <Col className='d-flex justify-content-end'>

                                </Col>
                            </Row>
                            <Row className='pb-4'>
                                <Col>
                                    <Card className="schedule-card rounded-0 h-100">
                                        <Card.Body >
                                            <Card.Title>Thông tin trẻ</Card.Title>
                                            <hr />
                                            <Card.Text><strong>Tên:</strong> {selectedSchedule.child.firstName} {selectedSchedule.child.lastName}</Card.Text>
                                            <Card.Text><strong>Giới tính:</strong> {selectedSchedule.child.gender == 'MALE' ? 'Nam' : 'Nữ'}</Card.Text>
                                            <Card.Text><strong>Ngày sinh:</strong> {selectedSchedule.child.dob}</Card.Text>
                                            <Card.Text><strong>Nhóm máu:</strong> {selectedSchedule.child.bloodType}</Card.Text>
                                            <Card.Text><strong>Ghi chú sức khỏe:</strong> {selectedSchedule.child.healthNotes ? selectedSchedule.child.healthNotes : "Không có"}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card className="schedule-card rounded-0 h-100">
                                        <Card.Body>
                                            <Card.Title>Thông tin tiêm chủng</Card.Title>
                                            <hr />
                                            <Card.Text><strong>Tên vaccine:</strong> {selectedSchedule.vaccine.name}</Card.Text>
                                            <Card.Text><strong>Mã vaccine:</strong> {selectedSchedule.vaccine.vaccineCode}</Card.Text>
                                            <Card.Text><strong>Chi tiết:</strong> {selectedSchedule.vaccine.description}</Card.Text>
                                            <Card.Text><strong>Ngày tiêm:</strong> {dayjs(selectedSchedule.date).format('DD/MM/YYYY HH:mm')}</Card.Text>
                                            <Card.Text><strong>Ngày đặt lịch:</strong> {dayjs(selectedSchedule.order.bookDate).format('DD/MM/YYYY HH:mm')}</Card.Text>
                                            <Card.Text><strong>Gói tiêm:</strong> {serviceTypeEnums[selectedSchedule.order.serviceType]}</Card.Text>
                                            <Card.Text><strong>Trạng thái lịch tiêm:</strong> {scheduleEnums[selectedSchedule.status]}</Card.Text>
                                            {selectedSchedule.status !== 'COMPLETED' && (
                                                <Button className='rounded-0 w-100 p-2 text-uppercase' onClick={() => setShow(true)}>
                                                    Dời lịch
                                                </Button>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                {selectedSchedule.status === 'COMPLETED' && (
                                    <Col>
                                        <Card className='schedule-card rounded-0 h-100'>
                                            <Card.Title>Các phản ứng được báo cáo:</Card.Title>
                                            <hr />
                                            <ul>
                                                {selectedSchedule.reactions.map((r, index) => (
                                                    <li key={index}>
                                                        {dayjs(r.date).format("HH:mm DD/MM/YYYY")} - {r.reaction}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>
                                    </Col>
                                )}
                            </Row>
                            {selectedSchedule.status === 'COMPLETED' && (
                                <Row className='mt-3'>
                                    <Col>
                                        <Card className='schedule-card rounded-0 h-100 d-flex flex-column'>
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title>Đánh giá</Card.Title>
                                                <hr className='mb-2' />
                                                <div className="text-center mb-3 pt-4 flex-grow-1">
                                                    <StarRating rating={feedback} setRating={setFeedback} />
                                                </div>
                                                <Button
                                                    onClick={() => updateFeedback(selectedSchedule.id)}
                                                    className='mt-auto btn btn-success rounded-0 w-100'
                                                >
                                                    Lưu đánh giá
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card className='schedule-card rounded-0 h-100 d-flex flex-column'>
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title>Báo cáo phản ứng với bác sĩ</Card.Title>
                                                <hr />
                                                <textarea
                                                    placeholder='Miêu tả tình trạng của trẻ...'
                                                    value={reaction}
                                                    onChange={(e) => setReaction(e.target.value)}
                                                    style={{ resize: 'none', height: '138px', flexGrow: 1 }}
                                                    className='form-control rounded-0'
                                                />
                                                <Button
                                                    onClick={() => addReaction(selectedSchedule.id)}
                                                    className='mt-auto btn btn-info rounded-0 w-100'
                                                    disabled={!reaction.trim()}
                                                >
                                                    Gửi báo cáo
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            )}

                        </Container>
                    )}
                </Modal.Body>
            </Modal>
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận dời lịch</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Dời lịch hiện tại sẽ <strong>dời thời gian của các lịch sau</strong>. Bạn vẫn muốn dời lịch hiện tại?
                </Modal.Body>
                <Modal.Footer>
                    <div className='d-flex w-100 gap-2'>
                        <Button variant="secondary" className='w-50 rounded-0' onClick={() => setShow(false)}>
                            Hủy dời lịch
                        </Button>
                        <Button variant="danger" className='w-50 rounded-0' onClick={handleReschedule}>
                            Vẫn dời lịch
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            <style>
                {`
                .schedule-container {
                    padding: 40px;
                }

                .schedule-list {
                    border-left: 2px solid #ddd;
                    padding-left: 20px;
                }

                .dot {
                    height: 10px;
                    width: 10px;
                    background-color: #ff4757;
                    border-radius: 50%;
                    display: block;
                    margin: auto;
                    margin-top: 5px;
                }

                .schedule-card {
                    margin: 10px 0;
                    padding: 15px;
                    border-radius: 12px;
                    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
                }
                `}
            </style>
        </Container>
    );
};