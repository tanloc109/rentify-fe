import React, { useState } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
import "react-multi-carousel/lib/styles.css";
import VaccineSelector from "./VaccineSelector";
import ComboSelector from "./ComboSelector";
import styles from '../pages/Datepicker.module.css';
import { toast } from "sonner";

const InformationForm = ({
  selectedChild,
  handleInfoChange,
  doctors,
  vaccines,
  vaccinePage,
  setVaccinePage,
  vaccineTotalPages,
  combos,
  comboPage,
  setComboPage,
  comboTotalPages,
  isMobile
}) => {

  const handleChange = (field, value) => {
    const updatedInfo = {
      ...selectedChild,
      [field]: value,
    };
    updatedInfo.fullDateTime = getFormattedDateTime();

    console.log(updatedInfo);

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

  const getFormattedDateTime = () => {
    if (!selectedChild.desiredDate || !selectedChild.desiredTime) return null;

    const selectedDate = new Date(selectedChild.desiredDate);
    const [hours, minutes] = selectedChild.desiredTime.split(":").map(Number);

    selectedDate.setHours(hours, minutes, 0, 0);
    const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);

    return utcDate.toISOString();
  };

  const handleVaccineSelection = (vaccineId) => {
    handleChange("selectedCombos", null);

    const updatedVaccines = Array.isArray(selectedChild.selectedVaccines)
      ? [...selectedChild.selectedVaccines]
      : [];

    if (updatedVaccines.includes(vaccineId)) {
      handleChange("selectedVaccines", updatedVaccines.filter((id) => id !== vaccineId));
    } else {
      handleChange("selectedVaccines", [...updatedVaccines, vaccineId]);
    }

  };


  const handleComboSelection = (comboId) => {
    handleChange("selectedVaccines", null);

    const updatedCombos = Array.isArray(selectedChild.selectedCombos) 
      ? [...selectedChild.selectedCombos] 
      : [];
  
    if (updatedCombos.includes(comboId)) {
      handleChange("selectedCombos", updatedCombos.filter(id => id !== comboId));
    } else {
      handleChange("selectedCombos", [...updatedCombos, comboId]);
    }
  };
  

  return (
    <Container className="mb-3">
      <Form className="shadow p-4 rounded-3">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label><strong>Chọn bác sĩ</strong></Form.Label>
              <Form.Select
                value={selectedChild.selectedDoctor || ""}
                onChange={(e) => handleChange("selectedDoctor", e.target.value)}
                className="rounded-0"
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
            <Form.Group>
              <Form.Label><strong>Chọn hình thức tiêm</strong></Form.Label>
              <Form.Select
                value={selectedChild.serviceType || ""}
                onChange={(e) => handleChange("serviceType", e.target.value)}
                className="rounded-0"
              >
                <option value="">Chọn hình thức tiêm</option>
                <option value="SINGLE">Tiêm lẻ</option>
                <option value="COMBO">Gói tiêm</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                <strong>Ngày mong muốn tiêm</strong>
              </Form.Label>
              <DatePicker
                selected={selectedChild.desiredDate ? new Date(selectedChild.desiredDate) : null}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                locale={vi}
                className="form-control rounded-0"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                placeholderText="Chọn ngày"
                wrapperClassName={styles.datepickerInput}
                minDate={new Date()}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>
                <strong>Chọn thời gian</strong>
              </Form.Label>
              <Form.Select className="rounded-0" value={selectedChild.desiredTime || ""} onChange={handleTimeChange}>
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
          <Row className="mt-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label><strong>Chọn vắc xin</strong></Form.Label>
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
          <Row className="mt-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label><strong>Chọn gói tiêm</strong></Form.Label>
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
      </Form>
    </Container>
  );
};

export default InformationForm;