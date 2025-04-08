import React from "react";
import { Card } from "react-bootstrap";

const VaccineCard = ({ vaccine, onSelect, isSelected }) => {
  return (
    <>
      <div className="d-flex flex-column h-100">
        <Card className={`shadow-sm border-2 rounded-0 w-100 mb-3 ${isSelected ? 'border-primary border-2' : 'border-white'}`}
          style={{
            maxWidth: "320px",
            minHeight: "280px",
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            flexGrow: 1
          }}
          onClick={() => onSelect(vaccine)}>
          <Card.Header className="text-white rounded-0 pt-4" style={{ background: "black" }}>
            <h6 className="text-uppercase fs-6 mb-1">{vaccine.name}</h6>
            <p className="small">Hãng: {vaccine.manufacturer}</p>
            <p className="small">Dành cho trẻ {vaccine.minAge} - {vaccine.maxAge} tuổi</p>
          </Card.Header>
          <Card.Body className="p-4 d-flex flex-column">
            <div className="d-flex align-items-center mb-2">
              <h5 className="fw-bold fs-5 fs-sm-4">
                {vaccine.price.toLocaleString()} VND
              </h5>
            </div>

            <div>
              {vaccine.uses.map((use, _) => (
                <p key={_} className="small">
                  <strong>{use.name}</strong> - {use.description}
                </p>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default VaccineCard;