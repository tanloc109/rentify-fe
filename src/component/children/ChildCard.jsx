import React from "react";
import { Card, Button } from "react-bootstrap";
import "./ChildCard.scss";

const ChildCard = ({ child, onEdit, onDelete, onViewHistory }) => {
    return (
        <Card className="mb-3 shadow-sm child-card mb-3">
            <Card.Body>
                <Card.Title>
                    Bé: {child.firstName} {child.lastName}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    Ngày sinh: {new Date(child.dob).toLocaleDateString("vi-VN")}
                </Card.Subtitle>
                <Card.Text>
                    <strong>Giới tính:</strong> {child.gender == 'MALE' ? 'Nam' : 'Nữ'} <br />
                    <strong>Cân nặng:</strong> {child.weight} kg <br />
                    <strong>Chiều cao:</strong> {child.height} cm <br />
                    <strong>Nhóm máu:</strong> {child.bloodType} <br />
                    <strong>Ghi chú sức khỏe:</strong> {child.healthNote ? child.healthNote : "Không có"}
                </Card.Text>
                <div className="d-flex justify-content-between">
                    <Button variant="primary" onClick={() => onEdit(child)}>Chỉnh sửa</Button>
                    <Button variant="danger" onClick={() => onDelete(child.id)}>Xóa</Button>
                    <Button variant="info" onClick={() => onViewHistory(child.id)}>Xem sổ tiêm</Button> {/* Nút xem lịch sử tiêm */}
                </div>
            </Card.Body>
        </Card>
    );
};

export default ChildCard;
