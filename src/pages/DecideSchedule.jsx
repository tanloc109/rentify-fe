import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { Button, Card, Modal } from 'react-bootstrap';
import { AppointmentContext } from '../context/AppointmentContext';
import { UserContext } from '../App';
import dayjs from 'dayjs';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot
} from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router';
import { AppointmentSummary } from './Appointment';

const DecideSchedule = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const accessToken = user?.accessToken || "";
    const { appointmentData } = useContext(AppointmentContext);
    const [draftSchedules, setDraftSchedules] = useState([]);
    const [groupedSchedules, setGroupedSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [newDate, setNewDate] = useState(null);

    useEffect(() => {
        getDraftSchedule();
    }, []);

    useEffect(() => {
        if (draftSchedules.length > 0) {
            groupSchedulesByCombos();
        }
    }, [draftSchedules]);

    const getDraftSchedule = async () => {
        try {
            const response = await axios({
                method: 'POST',
                url: `${import.meta.env.VITE_BASE_URL}/api/v1/schedules/draft`,
                data: {
                    ids: appointmentData.ids,
                    doctorId: appointmentData.doctorId,
                    childId: appointmentData.childId,
                    customerId: appointmentData.customerId,
                    desiredDate: appointmentData.date,
                    serviceType: appointmentData.serviceType
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.status === 200) {
                setDraftSchedules(response.data.data);
            }
        } catch (error) {
            navigate(-1);
            toast.error(error.response?.data?.error || "An error occurred");
        }
    };

    const getUpdatedDraftSchedules = async () => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${import.meta.env.VITE_BASE_URL}/api/v1/children/${appointmentData.childId}/schedules/draft`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.status === 200) {
                setDraftSchedules(response.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "An error occurred");
        }
    };

    const updateScheduleTime = async () => {
        try {
            const formattedDate = dayjs(newDate).format("YYYY-MM-DDTHH:mm");
            const response = await axios({
                method: 'PUT',
                url: `${import.meta.env.VITE_BASE_URL}/api/v1/schedules/${selectedSchedule.id}`,
                params: { newDate: formattedDate },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.status === 200) {
                await getUpdatedDraftSchedules();
                setOpenDatePicker(false);
                setConfirmDialogOpen(false);
                toast.success("Lịch đã được cập nhật thành công");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Đã có lỗi xảy ra khi cập nhật lịch");
        }
    };

    const groupSchedulesByCombos = () => {
        const combos = draftSchedules.reduce((acc, schedule) => {
            const existingCombo = acc.find(combo => combo.comboId === schedule.comboId);

            if (existingCombo) {
                existingCombo.schedules.push(schedule);
            } else {
                acc.push({
                    comboId: schedule.comboId,
                    comboName: schedule.comboName,
                    comboDescription: schedule.comboDescription,
                    schedules: [schedule]
                });
            }

            return acc;
        }, []);

        combos.forEach(combo => {
            combo.schedules.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
        });

        setGroupedSchedules(combos);
    };

    const handleOpenDatePicker = (schedule) => {
        setSelectedSchedule(schedule);
        setNewDate(dayjs(schedule.date));
        setOpenDatePicker(true);
    };

    const handleDateChange = (date) => {
        let hour = date.hour();
        let minute = date.minute() < 30 ? 0 : 30;

        // Restrict time between 08:00 and 20:00
        if (hour < 8) hour = 8;
        if (hour > 20 || (hour === 20 && minute > 0)) hour = 20, minute = 0;

        const restrictedDate = dayjs(date)
            .hour(hour)
            .minute(minute)
            .second(0);

        setNewDate(restrictedDate);
    };

    const handleDeposit = async () => {
        try {
            const response = await axios({
                url: `${import.meta.env.VITE_BASE_URL}/api/v1/orders/deposit`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                data: {
                    ids: appointmentData.ids,
                    childId: appointmentData.childId,
                    customerId: appointmentData.customerId,
                    serviceType: appointmentData.serviceType
                },
            });

            window.open(response.data.paymentUrl, "_blank");
        } catch (error) {
            toast.error("Vui lòng hoàn tất các thông tin cần thiết.");
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="container-fluid bg-light min-vh-100 p-4">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <h2 className="text-center mb-4">Lịch Tiêm Chủng</h2>

                        {groupedSchedules.map((combo) => (
                            <Card key={combo.comboId} className="mb-4 shadow-sm">
                                <Card.Header className="bg-primary text-white">
                                    <h4 className="m-0">{combo.comboName}</h4>
                                    <small>{combo.comboDescription}</small>
                                </Card.Header>
                                <Card.Body>
                                    <Timeline position="alternate">
                                        {combo.schedules.map((schedule, index) => (
                                            <TimelineItem key={schedule.id}>
                                                <TimelineSeparator>
                                                    <TimelineDot color="primary" variant="outlined">
                                                        <LocalHospitalIcon />
                                                    </TimelineDot>
                                                    {index < combo.schedules.length - 1 && <TimelineConnector />}
                                                </TimelineSeparator>
                                                <TimelineContent>
                                                    <Card className="shadow-sm">
                                                        <Card.Body>
                                                            <h5>{schedule.vaccineName}</h5>
                                                            <p><strong>Ngày:</strong> {dayjs(schedule.date).format('DD/MM/YYYY HH:mm')}</p>
                                                            <Button variant="outline-primary" size="sm" onClick={() => handleOpenDatePicker(schedule)}>
                                                                Điều chỉnh Ngày
                                                            </Button>
                                                        </Card.Body>
                                                    </Card>
                                                </TimelineContent>
                                            </TimelineItem>
                                        ))}
                                    </Timeline>
                                </Card.Body>
                            </Card>
                        ))}

                        <AppointmentSummary
                            selectedCombos={appointmentData.selectedCombos}
                            selectedVaccines={appointmentData.selectedVaccines}
                            totalPrice={appointmentData.totalPrice}
                        />

                        <div className="text-center mt-4">
                            <Button variant="dark" onClick={handleDeposit}>Xác nhận Lịch và Thanh toán</Button>
                        </div>

                        <Modal show={openDatePicker} onHide={() => setOpenDatePicker(false)} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Điều chỉnh Ngày Tiêm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <DateTimePicker
                                    label="Chọn Ngày và Giờ Mới"
                                    value={newDate}
                                    onChange={handleDateChange}
                                    minutesStep={30} // Ensures only :00 and :30 are selectable
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setOpenDatePicker(false)}>Hủy</Button>
                                <Button variant="primary" onClick={updateScheduleTime}>Cập nhật Lịch</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    );
};

export default DecideSchedule;
