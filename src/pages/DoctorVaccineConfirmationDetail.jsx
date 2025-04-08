import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, ListGroup, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router';
import { getScheduleDetail, xacNhanTiem } from '../services/doctorVaccineConfirmationService';
import { addVaccineReaction } from '../services/vaccineScheduleService';
import { UserContext } from '../App';
import { toast } from "react-toastify";
import { serviceTypeEnums } from '../context/enums';

const DoctorVaccineConfirmationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const userFullName = `${user.firstName} ${user.lastName}`;

    const [scheduleDetail, setScheduleDetail] = useState(null);
    const [newReaction, setNewReaction] = useState('');

    const callApi = async (id) => {
        let data = await getScheduleDetail({ accessToken: user.accessToken, scheduleId: id });
        setScheduleDetail(data);
    }

    const confirmVaccination = async () => {
        let access_token = user.accessToken;
        let response = await xacNhanTiem(access_token, user.userId, id);
        if (response) {
            toast.success('Xác nhận thành công!');
            navigate(-1);
        }
    }

    const handleAddReaction = async () => {
        if (!newReaction.trim()) return;

        try {
            await addVaccineReaction({
                scheduleId: id,
                reaction: newReaction,
                userFullName: userFullName,
                accessToken: user.accessToken
            });
            setNewReaction('');
            await callApi(id);
        } catch (error) {
            toast.error('Lỗi khi thêm phản ứng');
        }
    };

    useEffect(() => {
        if (id && user?.accessToken) {
            callApi(id);
        }
    }, [id, user]);

    return scheduleDetail !== null && scheduleDetail !== undefined
        ? (
            <Container className='mt-4'>
                <Card className="mb-4 rounded-0">
                    <Card.Body>
                        <Card.Title className='text-center fw-semibold fs-4 text-uppercase pb-3'>Chi Tiết Lịch Tiêm</Card.Title>
                        <Row>
                            <Col md={6}>
                                <h5 className='mb-3'>Thông Tin Trẻ</h5>
                                <p><strong>Họ tên:</strong> {scheduleDetail.child.firstName} {scheduleDetail.child.lastName}</p>
                                <p><strong>Ngày sinh:</strong> {dayjs(scheduleDetail.child.dob).format('DD/MM/YYYY')}</p>
                                <p><strong>Giới tính:</strong> {scheduleDetail.child.gender === 'MALE' ? 'Nam' : 'Nữ'}</p>
                                <p><strong>Cân nặng:</strong> {scheduleDetail.child.weight} kg</p>
                                <p><strong>Chiều cao:</strong> {scheduleDetail.child.height} cm</p>
                                <p><strong>Nhóm máu:</strong> {scheduleDetail.child.bloodType}</p>
                                <p><strong>Ghi chú sức khỏe:</strong> {scheduleDetail.child.healthNotes}</p>
                            </Col>
                            <Col md={6}>
                                <h5 className='mb-3'>Thông Tin Lịch Tiêm</h5>
                                <p><strong>Mã đơn hàng:</strong> {scheduleDetail.order.id}</p>
                                <p><strong>Ngày đặt lịch:</strong> {dayjs(scheduleDetail.order.bookDate).format('DD/MM/YYYY')}</p>
                                <p><strong>Loại dịch vụ:</strong> {serviceTypeEnums[scheduleDetail.order.serviceType]}</p>
                                <hr />
                                <h5 className='mb-3'>Thông Tin Vaccine</h5>
                                <p><strong>Tên vaccine:</strong> {scheduleDetail.vaccine.name}</p>
                                <p><strong>Mã vaccine:</strong> {scheduleDetail.vaccine.vaccineCode}</p>
                                <p><strong>Chi tiết:</strong> {scheduleDetail.vaccine.description}</p>
                            </Col>

                        </Row>
                        <hr />

                        {scheduleDetail.status === 'COMPLETED' && (
                            <><Row>

                                <Col md={6}>
                                    {scheduleDetail.reactions?.length > 0 ? (
                                        <ListGroup className="mb-4 rounded-0">
                                            {scheduleDetail.reactions.map((reaction) => (
                                                <ListGroup.Item key={reaction.id}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <strong>{dayjs(reaction.date).format('HH:mm DD/MM/YYYY')}</strong>
                                                            <span className="ms-2">{reaction.reaction}</span>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    ) : (
                                        <p className="text-muted">Chưa có phản ứng nào được ghi nhận</p>
                                    )}
                                </Col>
                                <Col md={6}>
                                    <h5 className=''>Quản Lý Phản Ứng</h5>
                                    <div className="mb-4">
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                value={newReaction}
                                                onChange={(e) => setNewReaction(e.target.value)}
                                                placeholder="Nhập phản ứng sau tiêm..."
                                                className="mb-2 rounded-0"
                                            />
                                            <Button
                                                variant="primary"
                                                onClick={handleAddReaction}
                                                disabled={!newReaction.trim()}
                                                className='rounded-0'
                                            >
                                                Thêm Phản Ứng
                                            </Button>
                                        </Form.Group>
                                    </div>

                                </Col>
                            </Row></>
                        )}
                        <h5 className='mt-4'>Lịch Sử Tiêm</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Ngày tiêm</th>
                                    <th>Vaccine</th>
                                    <th>Bác sĩ</th>
                                    <th>Phản ứng</th>
                                    <th>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scheduleDetail.pastSchedules
                                    .slice() // Create a shallow copy to avoid mutating the original array
                                    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()) // Sort newest to oldest
                                    .map((schedule) => (
                                        <tr key={schedule.id}>
                                            <td>{dayjs(schedule.date).format('DD/MM/YYYY')}</td>
                                            <td>{schedule.vaccineName}</td>
                                            <td>{userFullName}</td>
                                            <td>
                                                {schedule.reactions.length > 0 ? (
                                                    <ul>
                                                        {schedule.reactions.map((reaction, index) => (
                                                            <li key={index}>{dayjs(reaction.date).format("DD/MM/YYYY HH:mm")}: {reaction.reaction}</li>
                                                        ))}
                                                    </ul>
                                                ) : 'Không có'}
                                            </td>
                                            <td>{schedule.feedback ? schedule.feedback : "Không có"}</td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </Table>
                        <div className='d-flex justify-content-end'>
                            {scheduleDetail.status === 'PLANNED' && (
                                <Button className='rounded-0' onClick={confirmVaccination}>
                                    Xác nhận tiêm
                                </Button>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        ) : (
            <Container>
                <Row>
                    <Col>
                        Loading...
                    </Col>
                </Row>
            </Container>
        );
};

export default DoctorVaccineConfirmationDetail;