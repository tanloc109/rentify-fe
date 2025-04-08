import React from 'react';
import { Carousel, Row, Col, Pagination } from 'react-bootstrap';
import VaccineCard from './VaccineCard';

const VaccineSelector = ({
  vaccines,
  selectedVaccines = [],
  onSelect,
  isMobile,
  page,
  totalPages,
  setPage,
}) => {

  const renderPagination = () => (
    <Pagination className="justify-content-center mt-3">
      <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
      <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
      {[...Array(totalPages).keys()]?.map((num) => (
        <Pagination.Item
          key={num + 1}
          active={num + 1 === page}
          onClick={() => setPage(num + 1)}
        >
          {num + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === totalPages} />
      <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
    </Pagination>
  );

  return (
    <div className="vaccine-selector">
      {isMobile ? (
        <Carousel className="bg-dark-subtle mb-3" style={{ minHeight: "300px" }}>
          {vaccines?.map((vaccine) => {
            const isSelected = selectedVaccines.includes(vaccine.id);
            return (
              <Carousel.Item key={vaccine.id}>
                <div className="d-flex justify-content-center h-100 pt-4">
                  <VaccineCard
                    vaccine={vaccine}
                    onSelect={onSelect}
                    isSelected={isSelected}
                    className="w-100"
                  />
                </div>
              </Carousel.Item>
            );
          })}
        </Carousel>
      ) : (
        <Row className="vaccine-grid">
          {vaccines?.map((vaccine) => {
            const isSelected = selectedVaccines.some(v => v.id === vaccine.id);
            return (
              <Col key={vaccine.id} xl={4} lg={6}>
                <VaccineCard
                  vaccine={vaccine}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  className="w-100"
                />
              </Col>
            );
          })}
        </Row>
      )}
      {renderPagination()}
    </div>
  );
};

export default VaccineSelector;