import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Button, 
  Table, 
  Modal, 
  Alert, 
  Badge,
  Row,
  Col
} from 'react-bootstrap';
import InformationForm from '../component/InformationForm';
import { toast, ToastContainer } from "react-toastify";
import VaccineSelector from '../component/VaccineSelector';

const AppointmentSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFormSubmit = () => {
    if (!validate(currentAppointment)) {
      toast.error('Vui lòng điền đầy đủ thông tin và chọn ít nhất một vắc xin');
      return;
    }

    setAppointments(prev => {
      if (currentAppointment.id) {
        return prev.map(a => a.id === currentAppointment.id ? currentAppointment : a);
      }
      return [...prev, { ...currentAppointment, id: Date.now() }];
    });

    setShowFormModal(false);
    toast.success(currentAppointment.id ? 'Cập nhật thành công!' : 'Thêm lịch hẹn thành công!');
  };

  const validate = (a) => {
    return a.info.fullName &&
      a.info.dob &&
      a.info.gender &&
      a.selectedVaccines.length > 0;
  };

  const handleDelete = () => {
    setAppointments(prev => prev.filter(a => a.id !== appointmentToDelete.id));
    setShowDeleteModal(false);
    toast.success('Đã xóa lịch hẹn thành công');
  };

  return (
    <Container fluid className="p-4">
      <ToastContainer/>
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4">QUẢN LÝ LỊCH TIÊM</h1>
          <Button 
            variant="success" 
            onClick={() => {
              setCurrentAppointment({
                info: {},
                selectedVaccines: [],
                status: 'pending'
              });
              setShowFormModal(true);
            }}
          >
            + Thêm Lịch Hẹn Mới
          </Button>
        </Col>
      </Row>

      {appointments.length === 0 ? (
        <Alert variant="info">Chưa có lịch hẹn nào được đăng ký</Alert>
      ) : (
        <Row>
          <Col lg={12}>
            <Table striped hover responsive>
              <thead className="bg-dark text-white">
                <tr>
                  <th>STT</th>
                  <th>Tên Bệnh Nhân</th>
                  <th>Số Vắc Xin</th>
                  <th>Tổng Chi Phí</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={appointment.id}>
                    <td>{index + 1}</td>
                    <td>{appointment.info.fullName}</td>
                    <td>{appointment.selectedVaccines.length}</td>
                    <td>
                      {appointment.selectedVaccines
                        .reduce((sum, v) => sum + v.price, 0)
                        .toLocaleString()} VND
                    </td>
                    <td>
                      <Badge bg={appointment.status === 'pending' ? 'warning' : 'success'}>
                        {appointment.status === 'pending' ? 'Chờ xử lý' : 'Hoàn thành'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setCurrentAppointment(appointment);
                          setShowFormModal(true);
                        }}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setAppointmentToDelete(appointment);
                          setShowDeleteModal(true);
                        }}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentAppointment?.id ? 'Chỉnh sửa lịch hẹn' : 'Thêm lịch hẹn mới'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InformationForm
            patientInfo={currentAppointment?.info || {}}
            onInfoChange={info => setCurrentAppointment(prev => ({
              ...prev,
              info: { ...prev.info, ...info }
            }))}
          />
          
          <h4 className="mt-4">CHỌN VẮC XIN</h4>
          <VaccineSelector
            selectedVaccines={currentAppointment?.selectedVaccines || []}
            onSelect={vaccine => {
              setCurrentAppointment(prev => {
                const exists = prev.selectedVaccines.some(v => v.id === vaccine.id);
                return {
                  ...prev,
                  selectedVaccines: exists
                    ? prev.selectedVaccines.filter(v => v.id !== vaccine.id)
                    : [...prev.selectedVaccines, vaccine]
                };
              });
            }}
            isMobile={isMobile}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFormModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Lưu Lịch Hẹn
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa lịch hẹn của {appointmentToDelete?.info.fullName}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xác nhận xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentSchedule;