import React, { useState, useEffect, useContext } from 'react';
import { getDoctorHistorySchedules } from '../services/doctorVaccineConfirmationService';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Container, Card, Table, Button } from 'react-bootstrap';
import { orderEnums } from '../context/enums';

const DoctorHistorySchedules = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [doctorSchedules, setDoctorSchedules] = useState([]);

  useEffect(() => {
    const fetchDoctorSchedules = async () => {
      if (user.accessToken) {
        const response = await getDoctorHistorySchedules(user.accessToken, user.userId);
        const sortedSchedules = response.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setDoctorSchedules(sortedSchedules);
      }
    };
    fetchDoctorSchedules();
  }, []);

  return (
    <div>
      <Container className='mt-4'>
        <Card className="mb-4 rounded-0">
          <Card.Body>
            <Card.Title>Lịch Sử Tiêm</Card.Title>

            {/* Hiển thị nếu không có lịch sử */}
            {doctorSchedules.length === 0 ? (
              <p className="text-center text-muted">Không có lịch sử tiêm.</p>
            ) : (
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
                      <td>{orderEnums[item.status]}</td>
                      <td>
                        <Button variant="info" onClick={() => navigate(`/lich-lam-viec/${item.id}`)}>
                          Xem
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default DoctorHistorySchedules;
