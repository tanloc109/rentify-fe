import React, { useEffect, useState, useContext } from "react";
import { Button, Card, Pagination, Modal } from "react-bootstrap";
import { UserContext } from "../App";
import dayjs from "dayjs";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot
} from "@mui/lab";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useParams } from "react-router";
import { getScheduleDetails, getVaccinesByCustomer, updateExistingSchedule } from '../services/vaccineScheduleService';
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { toast } from "react-toastify";
dayjs.extend(isSameOrAfter);

const UpdateExistingSchedule = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { scheduleId } = useParams();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [affectedSchedules, setAffectedSchedules] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [originalDate, setOriginalDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const pageSize = 100;

    useEffect(() => {
        if (scheduleId) {
            fetchScheduleDetails(scheduleId);
        } else {
            navigate('/quan-li-lich-tiem');
            toast.error('Không tìm thấy lịch tiêm.');
        }
    }, []);

    const fetchScheduleDetails = async (scheduleId) => {
        try {
            const details = await getScheduleDetails({
                accessToken: user.accessToken,
                scheduleId: scheduleId
            });
            if (details) {
                setSelectedSchedule(details);
                fetchAffectedSchedules(details);
            }
        } catch (error) {
            console.log(error);
            toast.error('Lỗi khi tải chi tiết lịch');
        }
    };

    const fetchAffectedSchedules = async (mainSchedule) => {
        try {
            const data = await getVaccinesByCustomer({
                accessToken: user.accessToken,
                customerId: user.userId,
                pageNo: currentPage,
                pageSize: pageSize
            });

            const selectedSchedule = data.data.find(schedule =>
                schedule.id === Number(scheduleId)
            );
            console.log(selectedSchedule);

            if (!selectedSchedule) {
                throw new Error('Không tìm thấy lịch đã chọn');
            }

            const originalSelectedDate = dayjs(selectedSchedule.date);
            const childName = `${mainSchedule.child.firstName} ${mainSchedule.child.lastName}`;

            // Lưu trữ ngày gốc và thêm trường originalDate
            const filtered = data.data.filter(schedule =>
                schedule.childName === childName &&
                dayjs(schedule.date).isSameOrAfter(originalSelectedDate) &&
                schedule.status === 'PLANNED'
            ).map(schedule => ({
                ...schedule,
                originalDate: schedule.date, // Lưu ngày gốc
                newDate: schedule.date // Khởi tạo ngày mới
            }));

            setAffectedSchedules(filtered);
            setTotalPages(data.totalPages);
            setOriginalDate(originalSelectedDate);
            setSelectedDate(null);

        } catch (error) {
            console.error('Lỗi khi xử lý lịch:', error);
            toast.error(error.message || 'Lỗi khi tải danh sách lịch');
        }
    };

    const handleDateChange = (newDate) => {
        if (!selectedSchedule || !originalDate) return;

        const newSelectedDate = dayjs(newDate);
        const duration = newSelectedDate.diff(originalDate, 'millisecond');

        const updatedSchedules = affectedSchedules.map(schedule => {
            const originalScheduleDate = dayjs(schedule.originalDate);
            const newScheduleDate = originalScheduleDate.add(duration, 'millisecond');

            return {
                ...schedule,
                newDate: newScheduleDate.format("YYYY-MM-DDTHH:mm")
            };
        });

        setAffectedSchedules(updatedSchedules);
        setSelectedDate(newDate);
    };

    const handleConfirmReschedule = async () => {
        if (!selectedDate) {
            toast.error('Vui lòng chọn ngày mới');
            return;
        }

        try {
            const formattedDate = dayjs(selectedDate).format("YYYY-MM-DDTHH:mm");
            const response = await updateExistingSchedule({
                scheduleId: scheduleId,
                accessToken: user.accessToken,
                newDate: formattedDate
            });
            console.log(response);

            if (response.status === 200) {
                navigate('/quan-li-lich-tiem');
            }

        } catch (error) {
            // toast.error(error.response?.data?.message || 'Lỗi khi cập nhật lịch');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="container-fluid bg-light min-vh-100 p-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <Card className="mb-4 shadow-sm text-center">
                            <Card.Header className="bg-black text-white d-flex align-items-center justify-content-center" style={{ height: "70px" }}>
                                <h4 className="text-white m-0">Dời lịch tiêm</h4>
                            </Card.Header>

                            <Card.Body>
                                {selectedSchedule && (
                                    <div className="mb-4">
                                        <h5>
                                            Đang điều chỉnh lịch của bé: <strong>{`${selectedSchedule.child.firstName} ${selectedSchedule.child.lastName}`}</strong>
                                        </h5>
                                        <p className="text-muted">
                                            Ngày của lịch hiện tại muốn điều chỉnh: {originalDate ? originalDate.format("DD/MM/YYYY HH:mm") : "Đang tải..."}
                                        </p>
                                    </div>
                                )}
                                <p>Hãy chọn ngày mong muốn</p>
                                <DateCalendar
                                    value={selectedDate || originalDate}
                                    onChange={handleDateChange}
                                    disablePast
                                    minDate={originalDate}
                                />
                            </Card.Body>
                        </Card>

                        {selectedDate && (
                            <Card className="shadow-sm mt-4">
                                <Card.Header className="bg-secondary text-white">
                                    <h5>Các lịch sẽ thay đổi</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Timeline position="alternate">
                                        {affectedSchedules.map((schedule, index) => (
                                            <TimelineItem key={schedule.id}>
                                                <TimelineSeparator>
                                                    <TimelineDot color="primary">
                                                        <LocalHospitalIcon />
                                                    </TimelineDot>
                                                    {index < affectedSchedules.length - 1 && <TimelineConnector />}
                                                </TimelineSeparator>
                                                <TimelineContent>
                                                    <Card className="shadow-sm">
                                                        <Card.Body>
                                                            <h5>{schedule.vaccineName}</h5>
                                                            <div className="text-muted">
                                                                <small>Ngày cũ: {dayjs(schedule.originalDate).format("DD/MM/YYYY HH:mm")}</small>
                                                            </div>
                                                            <div className="text-success">
                                                                <strong>Ngày mới: {dayjs(schedule.newDate).format("DD/MM/YYYY HH:mm")}</strong>
                                                            </div>
                                                            {schedule.id === selectedSchedule?.id && (
                                                                <div className="text-primary mt-2">
                                                                    (Lịch đang điều chỉnh)
                                                                </div>
                                                            )}
                                                        </Card.Body>
                                                    </Card>
                                                </TimelineContent>
                                            </TimelineItem>
                                        ))}
                                    </Timeline>

                                    <div className="mt-4 d-flex justify-content-end align-items-center">
                                        {/* <Pagination>
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
                                        </Pagination> */}
                                        <Button
                                            variant="success"
                                            size="lg"
                                            onClick={() => setShowModal(true)}
                                            
                                        >
                                            Xác nhận thay đổi
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận thay đổi</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn thay đổi lịch tiêm?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleConfirmReschedule}>
                        Đồng ý
                    </Button>
                </Modal.Footer>
            </Modal>
        </LocalizationProvider>
    );
};

export default UpdateExistingSchedule;