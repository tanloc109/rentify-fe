import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table, Card, Modal } from "react-bootstrap";
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { UserContext } from '../App';
import { getDoctorSchedulesToday } from '../services/doctorVaccineConfirmationService';
import { scheduleEnums } from '../context/enums';

const DoctorVaccineConfirmation = () => {
  const navigate = useNavigate();

  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const { user } = useContext(UserContext);

  const callAPI = async () => {
    let response = await getDoctorSchedulesToday(user.accessToken, user.userId, date);
    const filteredSchedules = response.filter((item) => item.status === 'PLANNED');

    setDoctorSchedules(filteredSchedules);
  }

  useEffect(() => {
    callAPI();
  }, [date])

  return (
    <Container className='mt-4'>
      <Card className="mb-4 rounded-0">
        <Card.Body>
          <Card.Title>Xác nhận tiêm</Card.Title>
          <Row className='mb-4'>
            <Col md={6}>
              <span>Ngày: </span>
              <input
                type="date"
                className="form-control rounded-0"
                value={date}
                onChange={(e) => {
                  setDate(dayjs(e.target.value).format("YYYY-MM-DD"));
                }}
              />
            </Col>
          </Row>
          {doctorSchedules.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr className='text-center'>
                  <th>Thời gian</th>
                  <th>Họ tên trẻ</th>
                  <th>Loại vaccine</th>
                  <th>Trạng thái</th>
                  <th>Xem chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {doctorSchedules.map((item, index) => (
                  <tr key={index} className='text-center align-content-center'>
                    <td>{dayjs(item.dateTime).format('DD/MM/YYYY HH:mm')}</td>
                    <td>{item.firstName + " " + item.lastName}</td>
                    <td>{item.vaccine}</td>
                    <td>{scheduleEnums[item.status]}</td>
                    <td>
                      <Button
                        variant="info"
                        onClick={() => {
                          navigate(`/lich-lam-viec/${item.id}`);
                        }}
                      >
                        Xem
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-muted mt-3">Hiện không có lịch tiêm nào.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default DoctorVaccineConfirmation;
