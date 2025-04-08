import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Dropdown, Form, FormCheck, InputGroup, Modal, Pagination, Row, Table, Badge, Alert } from 'react-bootstrap';
import { addBatch, batchParams, deleteBatch, editBatch, getBatches, getVaccines } from '../services/batchService';
import { UserContext } from '../App';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
export const ManageBatchesPage = () => {

    // User
    const { user } = useContext(UserContext);

    // API
    const [showValidation, setShowValidation] = useState(false);
    const [batches, setBatches] = useState([]);
    const [vaccines, setVaccines] = useState([]);

    const displayParams = [
        ["batchCode", "Mã lô"],
        ["batchSize", "SL tổng"],
        ["quantity", "SL còn lại"],
        ["manufactured", "Sản xuất"],
        ["imported", "Nhập"],
        ["expiration", "Hết hạn"],
        ["distributer", "Phân phối"],
        ["vaccineCode", "Mã vaccine"],
        ["vaccineName", "Tên vaccine"],
        ["vaccineManufacturer", "NSX vaccine"],
        ["vaccinePrice", "Giá vaccine"],
    ];

    // Paging
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [params, setParams] = useState(batchParams);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('expiration:asc');

    // Modals
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState({
        id: -1,
        batchCode: '',
        vaccineId: -1,
        quantity: 0,
        batchSize: 0,
        imported: dayjs().format("YYYY-MM-DDTHH:mm"),
        manufactured: dayjs().format("YYYY-MM-DDTHH:mm"),
        expiration: dayjs().format("YYYY-MM-DDTHH:mm"),
        distributer: '',
    });
    const validatedBatch = {
        batchCode: showValidation && (!selectedBatch.batchCode || /\s/.test(selectedBatch.batchCode))
            ? 'Mã lô không được để trống và không chứa khoảng trắng'
            : '',

        vaccineId: showValidation && selectedBatch.vaccineId <= 0
            ? 'Vui lòng chọn loại vaccine'
            : '',

        quantity: showValidation && selectedBatch.quantity < 0
            ? 'Số lượng còn lại phải lớn hơn hoặc bằng 0'
            : '',

        batchSize: showValidation && selectedBatch.batchSize <= 0
            ? 'Số lượng lô phải lớn hơn 0'
            : '',

        imported: showValidation && dayjs(selectedBatch.imported).isAfter(dayjs())
            ? 'Ngày nhập không thể ở tương lai'
            : '',

        manufactured: showValidation && !selectedBatch.manufactured
            ? 'Ngày sản xuất không được để trống'
            : showValidation && dayjs(selectedBatch.manufactured).isAfter(dayjs())
                ? 'Ngày sản xuất không thể ở tương lai'
                : '',

        expiration: showValidation && !selectedBatch.expiration
            ? 'Ngày hết hạn không được để trống'
            : '',

        distributer: showValidation && !selectedBatch.distributer.trim()
            ? 'Nhà phân phối không được để trống'
            : '',

        dateOrder: showValidation && dayjs(selectedBatch.manufactured).isAfter(dayjs(selectedBatch.imported))
            ? 'Ngày sản xuất phải trước ngày nhập'
            : showValidation && dayjs(selectedBatch.imported).isAfter(dayjs(selectedBatch.expiration))
                ? 'Ngày nhập phải trước ngày hết hạn'
                : showValidation && dayjs(selectedBatch.manufactured).isAfter(dayjs(selectedBatch.expiration))
                    ? 'Ngày sản xuất phải trước ngày hết hạn'
                    : ''
    };

    const [vaccineSearch, setVaccineSearch] = useState('');

    // Update handleToggle to reset showValidation when opening/closing modals
    const handleToggle = async ({ modal, id }) => {
        switch (modal) {
            case 'add':
                setAddModal(!addModal);
                setShowValidation(false); // Reset validation state
                setSelectedBatch({
                    id: -1,
                    batchCode: '',
                    vaccineId: -1,
                    quantity: 0,
                    batchSize: 0,
                    imported: dayjs().format("YYYY-MM-DDTHH:mm"),
                    manufactured: dayjs().format("YYYY-MM-DDTHH:mm"),
                    expiration: dayjs().format("YYYY-MM-DDTHH:mm"),
                    distributer: '',
                });
                setVaccineSearch('');
                break;
            case 'edit':
                if (id != null) {
                    let batch_data = await getBatches({
                        accessToken: user.accessToken,
                        pageNo: pageNo,
                        pageSize: pageSize,
                        sortBy: 'id:desc',
                        filters: 'id=' + id
                    });
                    let batch = batch_data.data[0];
                    setSelectedBatch(({
                        id: id,
                        batchCode: batch.batchCode,
                        vaccineId: batch.vaccineId,
                        quantity: batch.quantity,
                        batchSize: batch.batchSize,
                        imported: batch.imported,
                        manufactured: batch.manufactured,
                        expiration: batch.expiration,
                        distributer: batch.distributer
                    }));
                }
                setShowValidation(false); // Reset validation state
                setVaccineSearch('');
                setEditModal(!editModal);
                break;
            case 'delete':
                if (id != null) {
                    setSelectedBatch({
                        id: id,
                        batchCode: '',
                        vaccineId: -1,
                        quantity: 0,
                        batchSize: 0,
                        imported: dayjs().format("YYYY-MM-DDTHH:mm"),
                        manufactured: dayjs().format("YYYY-MM-DDTHH:mm"),
                        expiration: dayjs().format("YYYY-MM-DDTHH:mm"),
                        distributer: '',
                    });
                }
                setShowValidation(false); // Reset validation state
                setDeleteModal(!deleteModal);
                break;
            default:
                break
        }
        callAPIBatch();
    }


    const handleSubmit = async ({ modal }) => {
        // Show validation on submit attempt
        setShowValidation(true);

        switch (modal) {
            case 'add':
                if (validatedBatch.batchCode) {
                    toast.error(validatedBatch.batchCode);
                    return;
                }
                if (validatedBatch.manufactured) {
                    toast.error(validatedBatch.manufactured);
                    return;
                }
                if (validatedBatch.vaccineId) {
                    toast.error(validatedBatch.vaccineId);
                    return;
                }
                if (validatedBatch.batchSize) {
                    toast.error(validatedBatch.batchSize);
                    return;
                }
                if (validatedBatch.expiration) {
                    toast.error(validatedBatch.expiration);
                    return;
                }
                if (validatedBatch.distributer) {
                    toast.error(validatedBatch.distributer);
                    return;
                }
                await addBatch(user.accessToken, {
                    batchCode: selectedBatch.batchCode,
                    vaccineId: selectedBatch.vaccineId,
                    batchSize: selectedBatch.batchSize,
                    manufactured: selectedBatch.manufactured,
                    distributer: selectedBatch.distributer
                });
                handleToggle({ modal: 'add' });
                break;

            // Similar changes for edit and delete cases...
        }
    }


    const callAPIBatch = async () => {
        let data = await getBatches({
            accessToken: user.accessToken,
            pageNo: pageNo,
            pageSize: pageSize,
            params: batchParams,
            sortBy: sortBy,
            filters: 'batchCode=' + search
        });

        setBatches(data.data);
        setTotalPages(data.totalPages);
    }

    const callAPIVaccine = async () => {
        let data = await getVaccines({
            accessToken: user.accessToken
        });
        setVaccines(data);
    }

    const isISODate = (value) => {
        return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value);
    };

    const formatValue = (value) => {
        if (isISODate(value)) {
            return dayjs(value).format("DD/MM/YYYY HH:mm"); // Convert to "DD/MM/YYYY"
        } else if (typeof value === "number") {
            return Number.isInteger(value) ? value : value.toFixed(2); // Round to 2 decimal places
        }
        return value; // Return original if neither
    };

    const isExpiringWithinDays = (dateString, days = 14) => {
        if (!dateString) return false;
        const expiryDate = dayjs(dateString);
        const today = dayjs();
        const futureCutoff = today.add(days, 'day');

        // Return true if the expiry date is between today and the cutoff date
        return expiryDate.isAfter(today) && expiryDate.isBefore(futureCutoff);
    };

    const isExpired = (dateString) => {
        if (!dateString) return false;
        const expiryDate = dayjs(dateString);
        const today = dayjs();

        // Return true if the expiry date is before today
        return expiryDate.isBefore(today);
    };

    const getExpiryStatusClass = (expirationDate) => {
        if (isExpired(expirationDate)) {
            return 'table-danger'; // A darker red for expired items
        } else if (isExpiringWithinDays(expirationDate)) {
            return 'table-warning'; // Orange/yellow for soon-to-expire items
        }
        return '';
    };

    const getExpiryStatusBadge = (expirationDate) => {
        if (isExpired(expirationDate)) {
            return <Badge bg="danger" style={{ backgroundColor: '#dc3545' }} className="ms-2">Đã hết hạn</Badge>;
        } else if (isExpiringWithinDays(expirationDate)) {
            return <Badge bg="warning" text="dark" className="ms-2">Sắp hết hạn</Badge>;
        }
        return null;
    };

    useEffect(() => {
        callAPIBatch();
    }, [pageNo, pageSize, sortBy, search]);

    useEffect(() => {
        callAPIVaccine({
            accessToken: user.accessToken
        });
    }, [])

    return (
        <>
            <Container className='p-3'>
                <Row>
                    <Col>
                        <Row>
                            <div className='d-flex align-items-center justify-content-between'>
                                <span className='fw-bold fs-1'>Quản lý nhập kho</span>
                                <div className='d-flex gap-3'>
                                    <Button onClick={() => handleToggle({ modal: 'add' })} variant='success' className='rounded-0'> <i className="bi bi-plus-square me-2"></i> Nhập lô mới</Button>
                                    {/* <Button variant='success' className='rounded-0'> <i className="bi bi-box-arrow-in-right me-2"></i> Import</Button> */}
                                    {/* <Button variant='success' className='rounded-0'> <i className="bi bi-box-arrow-right me-2"></i> Xuất file</Button> */}
                                </div>
                            </div>
                        </Row>
                        <Row className='mb-3'>
                            {/* <Col md={1}>
                                <Dropdown>
                                    <Dropdown.Toggle variant='light' className='rounded-0 border'>
                                        Bộ lọc
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className='rounded-0 p-0' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {
                                            batchParams.map((bp, _) => (
                                                <div key={_} className='p-2 border' style={{ cursor: 'pointer' }} onClick={() => {
                                                    if (bp[0] == 'id') return;
                                                    let newParams = [...params];
                                                    if (params.includes(bp)) {
                                                        newParams[_] = null;
                                                        setParams(newParams);
                                                    } else {
                                                        newParams[_] = bp;
                                                        setParams(newParams);
                                                    }
                                                }}>
                                                    <input disabled={bp[0] == 'id'} checked={params.includes(bp)} readOnly className='form-check-input me-3' type="checkbox" />
                                                    <span>{bp[1]}</span>
                                                </div>
                                            ))
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col> */}
                            <Col md={3}>
                                <Form.Control value={search} onChange={(e) => setSearch(e.target.value)} className='rounded-0' placeholder='Tìm kiếm theo mã lô...' />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                {batches?.some(batch => isExpired(batch.expiration)) && (
                                    <Alert variant="danger" style={{ backgroundColor: '#dc3545', color: '#fff' }}>
                                        <i className="bi bi-x-circle-fill me-2"></i>
                                        <strong>Cảnh báo nghiêm trọng:</strong> Có {batches.filter(batch => isExpired(batch.expiration)).length} lô vắc-xin đã hết hạn!
                                    </Alert>
                                )}

                                {batches?.some(batch => isExpiringWithinDays(batch.expiration)) && (
                                    <Alert variant="warning">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        Có {batches.filter(batch => isExpiringWithinDays(batch.expiration)).length} lô vắc-xin sẽ hết hạn trong vòng 14 ngày tới!
                                    </Alert>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <div className="d-flex gap-3 align-items-center">
                                    <span>Chú thích:</span>
                                    <div className="d-flex align-items-center">
                                        <span className="d-inline-block bg-danger" style={{ width: '20px', height: '20px' }}></span>
                                        <span className="ms-2">Đã hết hạn</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="d-inline-block bg-warning" style={{ width: '20px', height: '20px' }}></span>
                                        <span className="ms-2">Sắp hết hạn (trong vòng 14 ngày)</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr className="align-middle text-center">
                                            {displayParams?.map((v, _) => {
                                                const isSorted = sortBy.includes(v[0]); // Check if this column is sorted
                                                const isDescending = sortBy.includes(":desc");

                                                return (
                                                    <th key={_}
                                                        style={{
                                                            cursor: "pointer",
                                                            backgroundColor: isSorted ? "#f0f8ff" : "transparent", // Highlight sorted column
                                                            fontWeight: isSorted ? "bold" : "normal"
                                                        }}
                                                        onClick={() => {
                                                            setSortBy(isSorted && !isDescending ? v[0] + ":desc" : v[0]);
                                                        }}
                                                    >
                                                        {v[1]}{" "}
                                                        {isSorted && (isDescending ? <i className="bi bi-sort-down"></i> : <i className="bi bi-sort-up"></i>)}
                                                    </th>
                                                );
                                            })}
                                            <th>Chỉnh sửa</th>
                                        </tr>
                                    </thead>
                                    <tbody className='align-middle text-center'>
                                        {
                                            batches?.map((batch, _) => {
                                                // Get the appropriate styling class based on expiration status
                                                const rowClass = getExpiryStatusClass(batch.expiration);

                                                return (
                                                    <tr key={_} className={rowClass}>
                                                        {displayParams.filter(p => p != null).map((bp, __) => {
                                                            // For the expiration cell, add the status badge
                                                            if (bp[0] === 'expiration') {
                                                                return (
                                                                    <td key={__} className={isExpired(batch.expiration) ? "fw-bold text-danger" : isExpiringWithinDays(batch.expiration) ? "fw-bold text-warning" : ""}>
                                                                        {formatValue(batch[bp[0]])}
                                                                        {getExpiryStatusBadge(batch.expiration)}
                                                                    </td>
                                                                );
                                                            }

                                                            // Regular cell rendering
                                                            return <td key={__}>{formatValue(batch[bp[0]])}</td>;
                                                        })}
                                                        <td>
                                                            <Button variant='' className='me-2' onClick={() => handleToggle({ modal: 'edit', id: batch.id })}><i className="bi bi-pen" /></Button>
                                                            <Button variant='' onClick={() => handleToggle({ modal: 'delete', id: batch.id })}><i className="bi bi-trash" /></Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className='d-flex justify-content-end align-items-center gap-2'>
                                    <Button className='p-0' disabled={pageNo == 1} onClick={() => setPageNo(1)} variant=''><i className="bi bi-chevron-bar-left"></i></Button>
                                    <Button className='p-0' disabled={pageNo == 1} onClick={() => setPageNo(p => p - 1)} variant=''><i className="bi bi-chevron-left"></i></Button>
                                    <span>Hiển thị trang </span>
                                    <input type="number" value={pageNo} onChange={(e) => setPageNo(e.target.value)} min={1} step={1} style={{ width: '50px' }} className='form-control p-0 text-center' />
                                    <span>trong {totalPages}</span>
                                    <Button className='p-0' disabled={pageNo == totalPages} onClick={() => setPageNo(p => p + 1)} variant=''><i className="bi bi-chevron-right"></i></Button>
                                    <Button className='p-0' disabled={pageNo == totalPages} onClick={() => setPageNo(totalPages)} variant=''><i className="bi bi-chevron-bar-right"></i></Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            <Modal show={addModal} onHide={() => handleToggle({ modal: 'add' })} size='xl' >
                <Modal.Header closeButton>
                    <Modal.Title>Nhập lô mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className='mb-3'>
                            <Col className='p-0 me-3'>
                                <InputGroup>
                                    <InputGroup.Text className='rounded-0'>Mã lô</InputGroup.Text>
                                    <Form.Control isInvalid={validatedBatch.batchCode} value={selectedBatch.batchCode} onChange={(e) => setSelectedBatch(({ ...selectedBatch, batchCode: e.target.value.trim() }))} placeholder='Nhập mã lô...' className='rounded-0' type="text" />
                                    <Form.Control.Feedback type='invalid'>{validatedBatch.batchCode}</Form.Control.Feedback>
                                </InputGroup>
                            </Col>
                            <Col className='p-0'>
                                <InputGroup>
                                    <InputGroup.Text className='rounded-0'>Nhà phân phối</InputGroup.Text>
                                    <Form.Control isInvalid={validatedBatch.distributer.length > 0} value={selectedBatch.distributer} onChange={(e) => setSelectedBatch(({ ...selectedBatch, distributer: e.target.value.trim() }))} placeholder='Nhà phân phối...' className='rounded-0' type="text" />
                                    <Form.Control.Feedback type='invalid'>{validatedBatch.distributer}</Form.Control.Feedback>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col className='p-0'>
                                <InputGroup>
                                    <InputGroup.Text className='rounded-0'>Loại Vaccine</InputGroup.Text>
                                    <Dropdown>
                                        <Dropdown.Toggle className='rounded-0 border text-start text-wrap' variant='light' id="dropdown-basic">
                                            {selectedBatch.vaccineId === -1 ? 'Chọn vaccine' : vaccines.find(v => v.id === selectedBatch.vaccineId).vaccineCode}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className='rounded-0 p-0' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            <Form.Control value={vaccineSearch} onChange={(e) => setVaccineSearch(e.target.value)} className='rounded-0' />
                                            {
                                                vaccines.filter(v => v.vaccineCode.toLowerCase().includes(vaccineSearch.toLowerCase()) || v.name.toLowerCase().includes(vaccineSearch.toLowerCase())).map((vaccine, _) => (
                                                    <Dropdown.Item key={_} onClick={() => setSelectedBatch({ ...selectedBatch, vaccineId: vaccine.id })}>[{vaccine.vaccineCode}]{vaccine.name}</Dropdown.Item>
                                                ))
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {
                                        validatedBatch.vaccineId && (
                                            <Form.Control.Feedback type='invalid' className='d-block'>{validatedBatch.vaccineId}</Form.Control.Feedback>
                                        )
                                    }
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col className='p-0'>
                                <InputGroup>
                                    <InputGroup.Text className='rounded-0'>Số lượng</InputGroup.Text>
                                    <Form.Control isInvalid={validatedBatch.batchSize} value={selectedBatch.batchSize} onChange={(e) => setSelectedBatch(({ ...selectedBatch, batchSize: e.target.value }))} className='rounded-0' type="number" min={1} step={1} />
                                    <Form.Control.Feedback type='invalid'>{validatedBatch.batchSize}</Form.Control.Feedback>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col className='p-0 pe-3'>
                                <InputGroup>
                                    <InputGroup.Text className='rounded-0'>Ngày sản xuất</InputGroup.Text>
                                    <Form.Control value={selectedBatch.manufactured.split('T')[0]} onChange={(e) => setSelectedBatch(({
                                        ...selectedBatch, manufactured: dayjs(selectedBatch.manufactured)
                                            .set('year', dayjs(e.target.value).year())
                                            .set('month', dayjs(e.target.value).month())
                                            .set('date', dayjs(e.target.value).date())
                                            .format("YYYY-MM-DDTHH:mm")
                                    }))} className='rounded-0' type="date" />
                                    <Form.Control value={selectedBatch.manufactured.split('T')[1]} onChange={(e) => setSelectedBatch(({
                                        ...selectedBatch, manufactured: dayjs(selectedBatch.manufactured)
                                            .set('hour', dayjs(`2000-01-01T${e.target.value}`).hour())
                                            .set('minute', dayjs(`2000-01-01T${e.target.value}`).minute())
                                            .format("YYYY-MM-DDTHH:mm")
                                    }))} className='rounded-0' type="time" />
                                    {
                                        validatedBatch.manufactured && (
                                            <Form.Control.Feedback type='invalid' className='d-block'>{validatedBatch.manufactured}</Form.Control.Feedback>
                                        )
                                    }
                                </InputGroup>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='success rounded-0' onClick={() => handleSubmit({ modal: 'add' })}>
                        Lưu
                    </Button>
                    <Button variant="secondary rounded-0" onClick={() => handleToggle({ modal: 'add' })}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={editModal} onHide={() => handleToggle({ modal: 'edit' })} size='xl' >
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa lô</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className='mb-3'>
                            <Col className='p-0 me-3'>
                                <InputGroup>
                                    <InputGroup.Text className='rounded-0'>Mã lô</InputGroup.Text>
                                    <Form.Control isInvalid={validatedBatch.batchCode} value={selectedBatch.batchCode} onChange={(e) => setSelectedBatch(({ ...selectedBatch, batchCode: e.target.value.trim() }))} placeholder='Nhập mã lô...' className='rounded-0' type="text" />
                                    <Form.Control.Feedback type='invalid'>{validatedBatch.batchCode}</Form.Control.Feedback>
                                </InputGroup>
                            </Col>
                            <Col className='p-0'>
                                <InputGroup>
                                    <InputGroup.Text className='rounded-0'>Nhà phân phối</InputGroup.Text>
                                    <Form.Control isInvalid={validatedBatch.distributer} value={selectedBatch.distributer} onChange={(e) => setSelectedBatch(({ ...selectedBatch, distributer: e.target.value.trim() }))} placeholder='Nhà phân phối...' className='rounded-0' type="text" />
                                    <Form.Control.Feedback type='invalid'>{validatedBatch.distributer}</Form.Control.Feedback>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col className='p-0'>
                                <InputGroup>
                                    <InputGroup.Text className='rounded-0'>Loại Vaccine</InputGroup.Text>
                                    <Dropdown>
                                        <Dropdown.Toggle className='rounded-0 border text-start text-wrap' variant='light' id="dropdown-basic">
                                            {selectedBatch.vaccineId === -1 ? 'Chọn vaccine' : vaccines.find(v => v.id === selectedBatch.vaccineId).name}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className='rounded-0 p-0' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            <Form.Control value={vaccineSearch} onChange={(e) => setVaccineSearch(e.target.value)} className='rounded-0' />
                                            {
                                                vaccines.filter(v => v.vaccineCode.toLowerCase().includes(vaccineSearch.toLowerCase()) || v.name.toLowerCase().includes(vaccineSearch.toLowerCase())).map((vaccine, _) => (
                                                    <Dropdown.Item key={_} onClick={() => setSelectedBatch({ ...selectedBatch, vaccineId: vaccine.id })}>[{vaccine.vaccineCode}]{vaccine.name}</Dropdown.Item>
                                                ))
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {
                                        validatedBatch.vaccineId && (
                                            <Form.Control.Feedback type='invalid' className='d-block'>{validatedBatch.vaccineId}</Form.Control.Feedback>
                                        )
                                    }
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col className='p-0'>
                                <InputGroup>
                                    <InputGroup.Text className='rounded-0'>Số lượng</InputGroup.Text>
                                    <Form.Control isInvalid={validatedBatch.quantity} value={selectedBatch.quantity} onChange={(e) => setSelectedBatch(({ ...selectedBatch, quantity: e.target.value }))} className='rounded-0' type="number" min={1} step={1} />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col className='p-0 pe-3'>
                                <InputGroup>
                                    <InputGroup.Text className='rounded-0'>Ngày sản xuất</InputGroup.Text>
                                    <Form.Control value={selectedBatch.manufactured.split('T')[0]} onChange={(e) => setSelectedBatch(({
                                        ...selectedBatch, manufactured: dayjs(selectedBatch.manufactured)
                                            .set('year', dayjs(e.target.value).year())
                                            .set('month', dayjs(e.target.value).month())
                                            .set('date', dayjs(e.target.value).date())
                                            .format("YYYY-MM-DDTHH:mm")
                                    }))} className='rounded-0' type="date" />
                                    <Form.Control value={selectedBatch.manufactured.split('T')[1]} onChange={(e) => setSelectedBatch(({
                                        ...selectedBatch, manufactured: dayjs(selectedBatch.manufactured)
                                            .set('hour', dayjs(`2000-01-01T${e.target.value}`).hour())
                                            .set('minute', dayjs(`2000-01-01T${e.target.value}`).minute())
                                            .format("YYYY-MM-DDTHH:mm")
                                    }))} className='rounded-0' type="time" />
                                    {
                                        validatedBatch.manufactured && (
                                            <Form.Control.Feedback type='invalid' className='d-block'>{validatedBatch.manufactured}</Form.Control.Feedback>
                                        )
                                    }
                                </InputGroup>
                            </Col>
                            <Col className='p-0 pe-3'>
                                <InputGroup>
                                    <InputGroup.Text className='rounded-0'>Ngày nhập</InputGroup.Text>
                                    <Form.Control value={selectedBatch.imported.split('T')[0]} onChange={(e) => setSelectedBatch(({
                                        ...selectedBatch, imported: dayjs(selectedBatch.imported)
                                            .set('year', dayjs(e.target.value).year())
                                            .set('month', dayjs(e.target.value).month())
                                            .set('date', dayjs(e.target.value).date())
                                            .format("YYYY-MM-DDTHH:mm")
                                    }))} className='rounded-0' type="date" />
                                    <Form.Control value={selectedBatch.imported.split('T')[1]} onChange={(e) => setSelectedBatch(({
                                        ...selectedBatch, imported: dayjs(selectedBatch.imported)
                                            .set('hour', dayjs(`2000-01-01T${e.target.value}`).hour())
                                            .set('minute', dayjs(`2000-01-01T${e.target.value}`).minute())
                                            .format("YYYY-MM-DDTHH:mm")
                                    }))} className='rounded-0' type="time" />
                                    {
                                        validatedBatch.imported && (
                                            <Form.Control.Feedback type='invalid' className='d-block'>{validatedBatch.imported}</Form.Control.Feedback>
                                        )
                                    }
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col md={6} className='p-0 pe-3'>
                                <InputGroup>
                                    <InputGroup.Text className='rounded-0'>Ngày hết hạn</InputGroup.Text>
                                    <Form.Control value={selectedBatch.expiration.split('T')[0]} onChange={(e) => setSelectedBatch(({
                                        ...selectedBatch, expiration: dayjs(selectedBatch.expiration)
                                            .set('year', dayjs(e.target.value).year())
                                            .set('month', dayjs(e.target.value).month())
                                            .set('date', dayjs(e.target.value).date())
                                            .format("YYYY-MM-DDTHH:mm")
                                    }))} className='rounded-0' type="date" />
                                    <Form.Control value={selectedBatch.expiration.split('T')[1]} onChange={(e) => setSelectedBatch(({
                                        ...selectedBatch, expiration: dayjs(selectedBatch.expiration)
                                            .set('hour', dayjs(`2000-01-01T${e.target.value}`).hour())
                                            .set('minute', dayjs(`2000-01-01T${e.target.value}`).minute())
                                            .format("YYYY-MM-DDTHH:mm")
                                    }))} className='rounded-0' type="time" />
                                    {
                                        validatedBatch.expiration && (
                                            <Form.Control.Feedback type='invalid' className='d-block'>{validatedBatch.expiration}</Form.Control.Feedback>
                                        )
                                    }
                                </InputGroup>
                            </Col>
                        </Row>
                        {
                            validatedBatch.dateOrder && (
                                <Row className='mb-3'>
                                    <Col>
                                        <Form.Control.Feedback type='invalid' className='d-block'>{validatedBatch.dateOrder}</Form.Control.Feedback>
                                    </Col>
                                </Row>
                            )
                        }
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='success rounded-0' onClick={() => handleSubmit({ modal: 'edit' })}>
                        Lưu
                    </Button>
                    <Button variant="secondary rounded-0" onClick={() => handleToggle({ modal: 'edit' })}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={deleteModal} onHide={() => handleToggle({ modal: 'delete' })} size='md' >
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xoá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xoá lô đã chọn?</p>
                    <span className='badge bg-secondary'>{selectedBatch.id}</span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary rounded-0' onClick={() => handleToggle({ modal: 'delete' })}>Hủy</Button>
                    <Button variant='danger rounded-0' onClick={() => handleSubmit({ modal: 'delete' })}>Xoá</Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}
