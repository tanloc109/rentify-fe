import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

const VaccinationHistoryModal = ({ show, onClose, vaccinationData }) => {
    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Lịch Sử Tiêm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {vaccinationData.length === 0 ? (
                    <p className="text-center">Không có lịch sử tiêm.</p>
                ) : (
                    <ListGroup>
                        {vaccinationData.map((vaccinationDay, index) => (
                            <ListGroup.Item key={index}>
                                <strong>{new Date(vaccinationDay.date).toLocaleDateString("vi-VN")}</strong>
                                <ul>
                                    {vaccinationDay.vaccines.map((vaccine, idx) => (
                                        <li key={idx}>
                                            {vaccine.name} - {vaccine.dose} - Trạng thái: {vaccine.status}
                                        </li>
                                    ))}
                                </ul>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VaccinationHistoryModal;
