import classNames from 'classnames/bind';
import { Row, Col, Container, Button, Card, Modal, Pagination, Form } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';

import styles from './Vaccine.module.scss';
// import { useData } from '../data/Vaccines';
import { getVaccinesActive } from '../services/vaccineService';
import { getPurposesActive } from '../services/purposeService';
import { UserContext } from '../App';

const cx = classNames.bind(styles);

function Vaccine() {
    // const { data } = useData();

    const { user } = useContext(UserContext);

    const [dataVaccines, setDataVaccines] = useState([])

    const [dataPurposes, setDataPurposes] = useState([])
    
    const [show, setShow] = useState(false);
    const [selectedVaccine, setSelectedVaccine] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const apiAll = async () => {
            const resultVaccines = await getVaccinesActive(user.accessToken);
            setDataVaccines(resultVaccines.data);
        };
        apiAll();
        setLoading(false);
    }, []);

    const [filters, setFilters] = useState({
        name: '',
        purpose: '',
        priceRange: '',
        minAge: '',
        maxAge: ''
    });
    
    useEffect(() => {
        setLoading(true);
        const apiAll = async () => {
            const resultPurposes = await getPurposesActive(user.accessToken);
            setDataPurposes(resultPurposes.data);
        };
        apiAll();
        setLoading(false);
    }, []);

    const handleDetails = (vaccine) => {
        setSelectedVaccine(vaccine);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setSelectedVaccine(null);
    };

    const filteredData = dataVaccines?.filter(vaccine => {
        const matchName = filters.name ? vaccine.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
        const matchPurpose = filters.purpose ? vaccine.uses.some(p => p.id === Number(filters.purpose)) : true;
        
        let matchAgeGroup = true;
        if (filters.minAge) matchAgeGroup = vaccine.minAge >= Number(filters.minAge);
        if (filters.maxAge) matchAgeGroup = matchAgeGroup && vaccine.maxAge <= Number(filters.maxAge);
    
        let matchPrice = true;
        if (filters.priceRange === '1') matchPrice = vaccine.price < 15;
        if (filters.priceRange === '2') matchPrice = vaccine.price >= 15 && vaccine.price <= 35;
        if (filters.priceRange === '3') matchPrice = vaccine.price > 35;
    
        return matchName && matchPurpose && matchAgeGroup && matchPrice;
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

    return (
        <div className={cx('wrapper')}>
            <h2 className='text-center fs-1 text-primary my-5'>Danh sách Vaccines</h2>

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
                            value={filters.purpose} 
                            onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
                        >
                            <option value="">Lọc theo mục đích</option>
                            {dataPurposes.map(purpose => (
                                <option key={purpose.id} value={purpose.id}>{purpose.name} - {purpose.description}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={2}>
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
                    <Col md={2}>
                        <Form.Control 
                            type="number" 
                            placeholder="Tuổi nhỏ nhất" 
                            value={filters.minAge} 
                            onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                        />
                    </Col>
                    <Col md={2}>
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
                    {currentData.length > 0 ? (currentData.map((vaccine, index) => (
                        <Col key={index} md={6} lg={4}>
                            <Card style={{ width: '100%' }}>
                                {/* <Card.Img variant="top" src={vaccine.imageUrl} style={{ width: '100%', height: '180px' }} /> */}
                                <Card.Body>
                                    <Card.Title>{vaccine.name}</Card.Title>
                                    <Card.Text style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {vaccine.manufacturer}
                                        
                                    </Card.Text>
                                    <Card.Title>{vaccine.description}</Card.Title>
                                    <Button className='py-2 w-50 fs-6' variant="primary" onClick={() => handleDetails(vaccine)}>Chi tiết</Button>
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

            {/* model detail vaccine */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedVaccine?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <img src={selectedVaccine?.imageUrl} alt={selectedVaccine?.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} /> */}
                    <p className="mt-2"><strong>Tên:</strong> {selectedVaccine?.name}</p>
                    <p><strong>Mã vaccine:</strong> {selectedVaccine?.vaccineCode}</p>
                    <p><strong>Nhà sản xuất:</strong> {selectedVaccine?.manufacturer}</p>
                    <p><strong>Mô tả:</strong> {selectedVaccine?.description}</p>
                    <p><strong>Số liều cần tiêm:</strong> {selectedVaccine?.dose}</p>
                    {
                        selectedVaccine?.vaccineTimings.map((timing, index) => {
                            return (
                                <p key={timing.id} className="ms-2">
                                    <span className="text-danger">*</span> Mũi tiêm số {timing.doseNo} cách mũi tiêm số {timing.doseNo - 1} là {timing.daysAfterPreviousDose} ngày
                                </p>
                            )
                        })
                    }
                    <p><strong>Độ tuổi:</strong> từ {selectedVaccine?.minAge} tới {selectedVaccine?.maxAge} tuổi</p>
                    <p><strong>Ngày hết hạn:</strong> {selectedVaccine?.expiryDate}</p>
                    <p><strong>Giá:</strong> {selectedVaccine?.price}</p>
                    {
                        selectedVaccine?.uses.map((pur, index) => {
                            return (
                                <p key={pur.id}><strong>Mục đích {index + 1}:</strong> {pur.name} - {pur.description}</p>
                            )
                        }) 
                    }  
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Vaccine;