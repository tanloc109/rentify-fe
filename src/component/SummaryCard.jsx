import React from "react";
import { Card } from "react-bootstrap";
import { doctors, vaccines, combos } from "../data/flow2Data";

const SummaryCard = ({ selectedChildren }) => {
  const hasSelectedVaccine = selectedChildren.some(
    (child) => child.selectedVaccines.length > 0 || child.selectedCombo
  );

  console.log(selectedChildren);

  return (
    <Card className="p-3 shadow-sm">
      <Card.Body>
        <Card.Title className="text-center">
          <strong>Thông Tin Tóm Tắt</strong>
        </Card.Title>
        <hr />

        {!hasSelectedVaccine && (
          <p className="text-center text-muted">Hãy chọn vắc xin</p>
        )}

        {selectedChildren.map((child) => {
          const selectedDoctor = doctors.find(
            (doc) => doc.id.toString() === child.selectedDoctor
          );
          const selectedCombo = combos.find(
            (combo) => combo.id === child.selectedCombo
          );

          let selectedVaccineDetails = [];
          let totalPrice = 0;

          if (selectedCombo) {
            selectedVaccineDetails = selectedCombo.vaccines;
            totalPrice = selectedCombo.price;
          } else if (child.selectedVaccines.length > 0) {
            selectedVaccineDetails = vaccines.filter((vaccine) =>
              child.selectedVaccines.includes(vaccine.id)
            );
            totalPrice = selectedVaccineDetails.reduce(
              (sum, vaccine) => sum + vaccine.price,
              0
            );
          }

          return (
            <div key={child.id} className="mb-4">
              <p>
                <strong>Họ và Tên:</strong> {child.firstName} {child.lastName}
              </p>
              <p>
                <strong>Ngày sinh:</strong> {child.dob}
              </p>
              <p>
                <strong>Bác sĩ:</strong>{" "}
                {selectedDoctor
                  ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}`
                  : "Chưa chọn bác sĩ"}
              </p>
              <p>
                <strong>Ngày muốn tiêm:</strong>{" "}
                {child.desiredDate
                  ? new Date(child.desiredDate).toLocaleDateString("vi-VN")
                  : "Chưa chọn ngày"}
              </p>
              <p>
                <strong>Hình thức tiêm:</strong>{" "}
                {child.serviceType === "SINGLE"
                  ? "Tiêm lẻ"
                  : child.serviceType === "COMBO"
                  ? "Gói tiêm"
                  : "Chưa chọn"}
              </p>

              {/* Selected Vaccines or Combo */}
              {selectedCombo ? (
                <>
                  <p>
                    <strong>Gói vắc xin:</strong> {selectedCombo.name}
                  </p>
                  <p>
                    <strong>Mô tả:</strong> {selectedCombo.description}
                  </p>
                  <p>
                    <strong>Vắc xin trong gói:</strong>
                  </p>
                  <ul>
                    {selectedVaccineDetails.map((vaccine) => (
                      <li key={vaccine.id}>
                        {vaccine.name} - {vaccine.quantity} liều
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    <strong>Vắc xin đã chọn:</strong>
                  </p>
                  {selectedVaccineDetails.length > 0 ? (
                    <ul>
                      {selectedVaccineDetails.map((vaccine) => (
                        <li key={vaccine.id}>
                          {vaccine.name} - {vaccine.price.toLocaleString()} VND
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Chưa chọn vắc xin</p>
                  )}
                </>
              )}

              {/* Total Price */}
              <p>
                <strong>Tổng tiền:</strong> {totalPrice.toLocaleString()} VND
              </p>
              <hr />
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default SummaryCard;
