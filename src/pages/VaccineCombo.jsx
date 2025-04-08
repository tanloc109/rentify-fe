import classNames from 'classnames/bind';
import { Row, Col, Container, Button, Card, Modal, Pagination, Form } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import styles from './VaccineCombo.module.scss';
import { getCombos, getCombosActive } from '../services/comboService';
import { UserContext } from '../App';

const cx = classNames.bind(styles);

function VaccineCombo() {

    const { user } = useContext(UserContext);

    // const { dataCombo } = useComboData();

    const [dataCombos, setDataCombos] = useState([])
    
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedVaccineCombo, setSelectedVaccineCombo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const itemsPerPage = 6;

    useEffect(() => {
        setLoading(true);
        const apiAll = async () => {
            const resultCombos = await getCombosActive(user.accessToken);
            setDataCombos(resultCombos.data);
        };
        apiAll();
        setLoading(false);
    }, []);

    const [filters, setFilters] = useState({
        name: '',
        priceRange: '',
        minAge: '',
        maxAge: ''
    });

    const handleDetails = (vaccines) => {
        setSelectedVaccineCombo(vaccines);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setSelectedVaccineCombo(null);
    };

    const filteredData = dataCombos?.filter(vaccine => {
        const matchName = filters.name ? vaccine.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
        
        let matchAgeGroup = true;
        if (filters.minAge) matchAgeGroup = vaccine.minAge >= Number(filters.minAge);
        if (filters.maxAge) matchAgeGroup = matchAgeGroup && vaccine.maxAge <= Number(filters.maxAge);
    
        let matchPrice = true;
        if (filters.priceRange === '1') matchPrice = vaccine.price < 35;
        if (filters.priceRange === '2') matchPrice = vaccine.price >= 35 && vaccine.price <= 60;
        if (filters.priceRange === '3') matchPrice = vaccine.price > 60;
    
        return matchName && matchAgeGroup && matchPrice;
    });

    const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
        return (
            <div className={cx('loading')}>
                Dang loading ne
            </div>
        );
    }

    console.log(selectedVaccineCombo);

    return (
        <div className={cx('wrapper')}>
            <h2 className='text-center fs-1 text-primary my-5'>Danh sách các Combo Vaccines</h2>

            {/* loc data */}
            <Container>
                <Row className="mb-4 align-items-center">
                    <Col md={3}>
                        <Form.Control 
                            type="text" 
                            placeholder="Tìm theo tên..." 
                            value={filters.name} 
                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                        />
                    </Col>
                    <Col md={3}>
                        <Form.Select 
                            value={filters.priceRange} 
                            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                        >
                            <option value="">Lọc theo giá</option>
                            <option value="1">Thấp</option>
                            <option value="2">Trung bình</option>
                            <option value="3">Cao</option>
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <Form.Control 
                            type="number" 
                            placeholder="Tuổi nhỏ nhất" 
                            value={filters.minAge} 
                            onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                        />
                    </Col>
                    <Col md={3}>
                        <Form.Control 
                            type="number" 
                            placeholder="Tuổi lớn nhất" 
                            value={filters.maxAge} 
                            onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                        />
                    </Col>
                </Row>
            </Container>
            
            {/* list data */}
            <Container className='mt-3'>
                <Row className="gx-5 gy-5">
                    {currentData.length > 0 ? (currentData.map((vaccineCombo, index) => (
                        <Col key={index} md={6} lg={4}>
                            <Card style={{ width: '100%' }}>
                                {/* <Card.Img variant="top" src={vaccineCombo.imageUrl} style={{ width: '100%', height: '180px' }} /> */}
                                <Card.Body>
                                    <Card.Title>{vaccineCombo.name}</Card.Title>
                                    <Card.Text className='mb-2'>
                                        Số lượng mũi: {vaccineCombo.totalQuantity}
                                    </Card.Text>
                                    <Card.Text style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {vaccineCombo.description}
                                    </Card.Text>
                                    <Button className='py-2 w-50 fs-6' variant="primary" onClick={() => handleDetails(vaccineCombo.vaccines)}>Chi tiết</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))) : (<h1 className="text-center text-danger">Không tìm thấy dữ liệu</h1>)}
                </Row>

                {totalPages > 1 && (
                    <Pagination className='justify-content-center mt-4'>
                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                )}
            </Container>

            {/* model detail vaccine combo */}
            <Modal show={show} onHide={handleClose} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết về Combo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        {selectedVaccineCombo?.map((vaccineCombo, index) => (
                            <Col key={index} md={6} className="mb-4">
                                <div className="border p-3 rounded shadow-sm">
                                    {/* <img 
                                        src={vaccineCombo?.imageUrl} 
                                        alt={vaccineCombo?.name} 
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                                    /> */}

                                    <p className="mt-2"><strong>Tên:</strong> {vaccineCombo?.name}</p>
                                    <p><strong>Mã vaccine:</strong> {vaccineCombo?.vaccineCode}</p>
                                    <p><strong>Nhà sản xuất:</strong> {vaccineCombo?.manufacturer}</p>
                                    <p><strong>Mô tả:</strong> {vaccineCombo?.description}</p>
                                    <p><strong>Số liều cần tiêm:</strong> {vaccineCombo?.dose}</p>
                                    {
                                        vaccineCombo?.vaccineTimings?.map((timing, index) => {
                                            return (
                                                <p key={timing.id} className="ms-2">
                                                    <span className="text-danger">*</span> Mũi tiêm số {timing.doseNo} cách mũi tiêm số {timing.doseNo - 1} là {timing.daysAfterPreviousDose} ngày
                                                </p>
                                            )
                                        })
                                    }
                                    <p><strong>Độ tuổi:</strong> từ {vaccineCombo?.minAge} tới {vaccineCombo?.maxAge} tuổi</p>
                                    <p><strong>Ngày hết hạn:</strong> {vaccineCombo?.expiryDate}</p>
                                    <p><strong>Giá:</strong> {vaccineCombo?.price}</p>

                                    {vaccineCombo?.uses.map((pur, index) => (
                                        <p key={pur.id}><strong>Mục đích {index + 1}:</strong> {pur.name}</p>
                                    ))}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default VaccineCombo;