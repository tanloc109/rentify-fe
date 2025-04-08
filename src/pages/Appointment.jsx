import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import vi from "date-fns/locale/vi";
import { getCombosV2 } from "../services/comboService";
import { getVaccines } from "../services/vaccineService";
import { getChildrenByCustomerId } from "../services/customerService";
import { getAllDoctors } from "../services/doctorService";
import { UserContext } from "../App";
import { AppointmentContext } from "../context/AppointmentContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import VaccineSelector from "../component/VaccineSelector";
import ComboSelector from "../component/ComboSelector";
import styles from './Datepicker.module.css';
import { Card, CardHeader, CardContent, Typography, List, ListItem, ListItemText, Divider, Paper, Box } from '@mui/material';
import { InfoCircle, CalendarCheck, Clock, PersonFill, Clipboard, PlusCircle } from 'react-bootstrap-icons';

export const AppointmentSummary = ({ selectedVaccines, selectedCombos, totalPrice }) => {
  const depositAmount = totalPrice * 0.2;
  const hasItems = (selectedVaccines && selectedVaccines.length > 0) || (selectedCombos && selectedCombos.length > 0);

  return (
    <Card className="shadow-sm border-0 rounded-3">
      <CardHeader
        title="Tóm tắt đơn đặt hàng"
        style={{ backgroundColor: '#1976d2', color: 'white', padding: '15px 20px' }}
      />
      <CardContent>
        {!hasItems && (
          <Typography variant="body2" color="text.secondary" style={{ fontStyle: 'italic', marginBottom: '10px' }}>
            Chưa có sản phẩm nào được chọn
          </Typography>
        )}

        {selectedVaccines && selectedVaccines.length > 0 && (
          <div className="mb-3">
            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 600, color: '#333' }}>
              <PlusCircle className="me-2" /> Vắc-xin đã chọn:
            </Typography>
            <List dense>
              {selectedVaccines.map((vaccine) => (
                <ListItem key={vaccine.id} className="ps-3">
                  <ListItemText
                    primary={vaccine.name}
                    secondary={vaccine.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
          </div>
        )}

        {selectedCombos && selectedCombos.length > 0 && (
          <div className="mb-3">
            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 600, color: '#333' }}>
              <PlusCircle className="me-2" /> Gói vắc-xin đã chọn:
            </Typography>
            <List dense>
              {selectedCombos.map((combo) => (
                <ListItem key={combo.id} className="ps-3">
                  <ListItemText
                    primary={combo.name}
                    secondary={combo.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
          </div>
        )}

        <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 2, mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 600 }}>
            Tổng giá trị: {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </Typography>
          <Typography variant="subtitle1" style={{ fontWeight: 600, color: '#1976d2' }}>
            Tiền đặt cọc (20%): {depositAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const Appointment = () => {
  const navigate = useNavigate();

  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(-1);
  const [doctors, setDoctors] = useState([]);

  const [vaccines, setVaccines] = useState([]);
  const [vaccinePage, setVaccinePage] = useState(1);
  const [vaccineTotalPages, setVaccineTotalPages] = useState(1);

  const [combos, setCombos] = useState([]);
  const [comboPage, setComboPage] = useState(1);
  const [comboTotalPages, setComboTotalPages] = useState(1);

  const [totalPrice, setTotalPrice] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useContext(UserContext);
  const { setAppointmentData } = useContext(AppointmentContext);
  const accessToken = user?.accessToken || "";

  const selectedChild = children.find(child => child.id === selectedChildId) || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVaccines = async () => {
      if (accessToken) {
        const data = await getVaccines(accessToken, vaccinePage, 12);
        setVaccines(data.data);
        setVaccineTotalPages(data.totalPages);
      }
    };
    fetchVaccines();
  }, [accessToken, vaccinePage]);

  useEffect(() => {
    const fetchCombos = async () => {
      if (accessToken) {
        const data = await getCombosV2(accessToken, comboPage, 12, "id");
        setCombos(data.data);
        setComboTotalPages(data.totalPages);
      }
    };
    fetchCombos();
  }, [accessToken, comboPage]);

  useEffect(() => {
    if (selectedChild.selectedCombos && selectedChild.selectedCombos.length > 0) {
      const calculatedPrice = selectedChild.selectedCombos.reduce((acc, combo) => acc + combo.price, 0);
      setTotalPrice(calculatedPrice);
    } else if (selectedChild.selectedVaccines && selectedChild.selectedVaccines.length > 0) {
      const calculatedPrice = selectedChild.selectedVaccines.reduce((acc, vaccine) => acc + vaccine.price, 0);
      setTotalPrice(calculatedPrice);
    } else {
      // Đặt giá trị về 0 khi không còn item nào được chọn
      setTotalPrice(0);
    }
  }, [selectedChild])

  useEffect(() => {
    const fetchChildren = async () => {
      if (accessToken) {
        const data = await getChildrenByCustomerId(accessToken, user?.userId);
        setChildren(data);
      }
    };
    fetchChildren();
  }, [accessToken]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (accessToken) {
        const data = await getAllDoctors(accessToken);
        setDoctors(data.data);
      }
    };
    fetchDoctors();
  }, [accessToken]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChildChange = (event) => {
    const newChildId = parseInt(event.target.value, 10);
    setSelectedChildId(newChildId);

    const originalChildData = children.find(child => child.id === newChildId);
    setChildren(prevChildren =>
      prevChildren.map(child =>
        child.id === newChildId ? { ...originalChildData } : child
      )
    );
  };

  const handleInfoChange = (updatedChildInfo) => {
    if (selectedChildId === -1) {
      toast.info("Vui lòng chọn trẻ trước khi nhập thông tin.");
      return;
    }

    setChildren(prevChildren =>
      prevChildren.map(child =>
        child.id === selectedChildId ? updatedChildInfo : child
      )
    );
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (selectedChildId === -1) {
      toast.error("Vui lòng chọn trẻ trước khi đặt lịch.");
      setIsSubmitting(false);
      return;
    }

    const selectedChild = children.find(child => child.id === selectedChildId);
    if (!selectedChild.selectedDoctor) {
      toast.error("Vui lòng chọn bác sĩ.");
      setIsSubmitting(false);
      return;
    }

    if (!selectedChild.serviceType) {
      toast.error("Vui lòng chọn hình thức tiêm.");
      setIsSubmitting(false);
      return;
    }

    if (!selectedChild.desiredDate || !selectedChild.desiredTime) {
      toast.error("Vui lòng chọn ngày và giờ mong muốn tiêm.");
      setIsSubmitting(false);
      return;
    }

    const hasItems = (selectedChild.selectedVaccines && selectedChild.selectedVaccines.length > 0) ||
      (selectedChild.selectedCombos && selectedChild.selectedCombos.length > 0);

    if (!hasItems) {
      toast.error("Vui lòng chọn ít nhất một vắc-xin hoặc gói tiêm.");
      setIsSubmitting(false);
      return;
    }

    const appointmentData = {
      totalPrice: totalPrice,
      selectedVaccines: selectedChild.selectedVaccines,
      selectedCombos: selectedChild.selectedCombos,
      customerId: user?.userId,
      childId: selectedChildId,
      doctorId: selectedChild.selectedDoctor || null,
      date: selectedChild.fullDateTime,
      serviceType: selectedChild.serviceType || "SINGLE",
      ids: Array.isArray(selectedChild.selectedCombos) && selectedChild.selectedCombos.length > 0
        ? selectedChild.selectedCombos.map(c => c.id)
        : Array.isArray(selectedChild.selectedVaccines) && selectedChild.selectedVaccines.length > 0
          ? selectedChild.selectedVaccines.map(v => v.id)
          : [],
    };

    setAppointmentData(appointmentData);
    navigate("/chot-lich-va-thanh-toan");
    setIsSubmitting(false);
  };

  const handleChange = (field, value) => {
    const updatedInfo = {
      ...selectedChild,
      [field]: value,
    };

    if (updatedInfo.desiredDate && updatedInfo.desiredTime) {
      const selectedDate = new Date(updatedInfo.desiredDate);
      const [hours, minutes] = updatedInfo.desiredTime.split(":").map(Number);
      selectedDate.setHours(hours, minutes, 0, 0);
      const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
      updatedInfo.fullDateTime = utcDate.toISOString();
    } else {
      updatedInfo.fullDateTime = null;
    }

    handleInfoChange(updatedInfo);
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 8; hour <= 19; hour++) {
      if (hour !== 12) {
        times.push(`${hour}:00`, `${hour}:30`);
      }
    }
    times.push("20:00");
    return times;
  };

  const handleDateChange = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date && date <= today) {
      toast.error("Ngày mong muốn tiêm phải lớn hơn ngày hôm nay!");
      return;
    }

    handleChange("desiredDate", date);
  };

  const handleTimeChange = (e) => {
    handleChange("desiredTime", e.target.value);
  };

  const handleVaccineSelection = (vaccineId) => {
    handleChange("selectedCombos", []);

    const updatedVaccines = Array.isArray(selectedChild.selectedVaccines)
      ? [...selectedChild.selectedVaccines]
      : [];

    if (updatedVaccines.includes(vaccineId)) {
      handleChange("selectedVaccines", updatedVaccines.filter((id) => id !== vaccineId));
    } else {
      handleChange("selectedVaccines", [...updatedVaccines, vaccineId]);
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--; // Subtract one if the birthday hasn't occurred this year yet
    }

    return age;
  };

  const handleComboSelection = (comboId) => {
    handleChange("selectedVaccines", []);

    const updatedCombos = Array.isArray(selectedChild.selectedCombos)
      ? [...selectedChild.selectedCombos]
      : [];

    if (updatedCombos.find(c => c.id === comboId) != null) {
      handleChange("selectedCombos", updatedCombos.filter(c => c.id !== comboId));
    } else {
      const combo = combos.find(v => v.id === comboId)
      handleChange("selectedCombos", [...updatedCombos, combo]);
    }
  };

  const isFormComplete = () => {
    if (selectedChildId === -1) return false;
    const selectedChild = children.find(child => child.id === selectedChildId);
    if (!selectedChild) return false;

    if (!selectedChild.selectedDoctor || !selectedChild.serviceType ||
      !selectedChild.desiredDate || !selectedChild.desiredTime) return false;

    const hasItems = (selectedChild.selectedVaccines && selectedChild.selectedVaccines.length > 0) ||
      (selectedChild.selectedCombos && selectedChild.selectedCombos.length > 0);

    return hasItems;
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-4">
        <Col md={10} className="text-center">
          <h2 className="mb-3 fw-bold text-primary">ĐĂNG KÝ LỊCH TIÊM VẮC-XIN</h2>
          <p className="text-muted">Vui lòng điền đầy đủ thông tin để đăng ký lịch tiêm cho trẻ</p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col lg={8} md={12}>
          <Paper elevation={0} className="p-4 mb-4 border rounded-3">
            <div className="d-flex align-items-center mb-3">
              <PersonFill size={24} className="text-primary me-2" />
              <h5 className="fw-bold m-0">Thông tin của trẻ</h5>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Chọn trẻ <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={selectedChildId}
                onChange={handleChildChange}
                className="py-2 px-3 border shadow-sm"
              >
                <option value={-1}>Chọn trẻ</option>
                {children.map((child, index) => (
                  <option key={index} value={child.id}>
                    Bé {child.firstName} {child.lastName} - {calculateAge(child.dob)} tuổi
                  </option>
                ))}
              </Form.Select>
              {selectedChildId === -1 && (
                <div className="text-muted mt-2 small">
                  <InfoCircle size={14} className="me-1" /> Vui lòng chọn trẻ trước khi tiếp tục
                </div>
              )}
            </Form.Group>

            <hr className="my-4" />

            <Paper elevation={0} className="p-4 mb-4 border rounded-3 bg-light">
              <div className="d-flex align-items-center mb-3">
                <Clipboard size={24} className="text-primary me-2" />
                <h5 className="fw-bold m-0">Thông tin tiêm chủng</h5>
              </div>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Chọn bác sĩ <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={selectedChild.selectedDoctor || ""}
                      onChange={(e) => handleChange("selectedDoctor", e.target.value)}
                      className="shadow-sm"
                      disabled={selectedChildId === -1}
                    >
                      <option value="">Chọn bác sĩ</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.firstName} {doctor.lastName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Chọn hình thức tiêm <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={selectedChild.serviceType || ""}
                      onChange={(e) => handleChange("serviceType", e.target.value)}
                      className="shadow-sm"
                      disabled={selectedChildId === -1}
                    >
                      <option value="">Chọn hình thức tiêm</option>
                      <option value="SINGLE">Tiêm lẻ</option>
                      <option value="COMBO">Gói tiêm</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex align-items-center mb-3 mt-4">
                <CalendarCheck size={24} className="text-primary me-2" />
                <h5 className="fw-bold m-0">Lịch tiêm</h5>
              </div>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Ngày bắt đầu tiêm <span className="text-danger">*</span>
                    </Form.Label>
                    <DatePicker
                      selected={selectedChild.desiredDate ? new Date(selectedChild.desiredDate) : null}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      locale={vi}
                      className="form-control shadow-sm"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      placeholderText="Chọn ngày"
                      wrapperClassName={styles.datepickerInput}
                      minDate={new Date()}
                      disabled={selectedChildId === -1}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Chọn thời gian <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      className="shadow-sm"
                      value={selectedChild.desiredTime || ""}
                      onChange={handleTimeChange}
                      disabled={selectedChildId === -1}
                    >
                      <option value="">Chọn giờ</option>
                      {generateTimeSlots().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {selectedChild.serviceType === "SINGLE" && (
                <Row className="mt-4">
                  <Col md={12}>
                    <Form.Group>
                      <div className="d-flex align-items-center mb-3">
                        <PlusCircle size={24} className="text-primary me-2" />
                        <Form.Label className="fw-bold m-0">Chọn vắc xin <span className="text-danger">*</span></Form.Label>
                      </div>
                      <VaccineSelector
                        vaccines={vaccines}
                        selectedVaccines={selectedChild.selectedVaccines}
                        onSelect={handleVaccineSelection}
                        isMobile={isMobile}
                        page={vaccinePage}
                        totalPages={vaccineTotalPages}
                        setPage={setVaccinePage}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {selectedChild.serviceType === "COMBO" && (
                <Row className="mt-4">
                  <Col md={12}>
                    <Form.Group>
                      <div className="d-flex align-items-center mb-3">
                        <PlusCircle size={24} className="text-primary me-2" />
                        <Form.Label className="fw-bold m-0">Chọn gói tiêm <span className="text-danger">*</span></Form.Label>
                      </div>
                      <ComboSelector
                        combos={combos}
                        selectedCombos={selectedChild.selectedCombos}
                        onSelect={handleComboSelection}
                        isMobile={isMobile}
                        page={comboPage}
                        totalPages={comboTotalPages}
                        setPage={setComboPage}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </Paper>

            <Button
              className="mt-4 w-100 py-3 text-uppercase fw-bold rounded-3"
              onClick={handleSubmit}
              disabled={!isFormComplete() || isSubmitting}
              style={{
                backgroundColor: isFormComplete() ? "#1976d2" : "#e0e0e0",
                color: "white",
                border: "none",
                transition: "all 0.3s ease-in-out",
                letterSpacing: "1px"
              }}
              onMouseEnter={(e) => {
                if (isFormComplete()) {
                  e.target.style.backgroundColor = "#0d47a1";
                }
              }}
              onMouseLeave={(e) => {
                if (isFormComplete()) {
                  e.target.style.backgroundColor = "#1976d2";
                }
              }}
            >
              {isSubmitting ? "Đang xử lý..." : "Xem lịch tiêm và thanh toán"}
            </Button>
          </Paper>
        </Col>
        <Col lg={4} md={12}>
          <AppointmentSummary
            selectedVaccines={selectedChild.selectedVaccines}
            selectedCombos={selectedChild.selectedCombos}
            totalPrice={totalPrice}
          />

          <Paper elevation={0} className="p-3 mt-4 border border-warning rounded-3 bg-warning-subtle">
            <Typography variant="subtitle2" className="fw-bold" style={{ color: '#664d03' }}>
              <InfoCircle className="me-2" /> Lưu ý quan trọng
            </Typography>
            <Typography variant="body2" style={{ color: '#664d03' }} className="mt-2">
              • Xin vui lòng đến đúng giờ đã đặt lịch<br />
              • Mang theo sổ tiêm chủng của trẻ<br />
              • Đảm bảo trẻ trong tình trạng sức khỏe tốt<br />
              • Đặt cọc 20% sẽ được khấu trừ vào tổng hóa đơn
            </Typography>
          </Paper>
        </Col>
      </Row>
    </Container>
  );
};

export default Appointment;