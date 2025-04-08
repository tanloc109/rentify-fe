import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Dropdown, Form, FormCheck, InputGroup, Modal, Pagination, Row, Table } from 'react-bootstrap'
import { addTransaction, transactionParams, deleteTransaction, editTransaction, getTransactions } from '../services/transactionService';
import { UserContext } from '../App';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { getVaccines } from '../services/batchService';

export const TransactionPage = () => {

  // User
  const { user } = useContext(UserContext);

  // API
  const [transactions, setTransactions] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  // Paging
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [params, setParams] = useState(transactionParams.slice(0, 5));
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(transactionParams[0][0] + ':desc');

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState({
    id: -1,
    quantityTaken: 0,
    remaining: 0,
    date: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
    doctorId: 3,
    doctorName: '',
    vaccineId: -1,
    batchIds: []
  });
  const validatedTransaction = {
    quantityTaken: selectedTransaction.quantityTaken > 0
      ? ''
      : 'Số lượng lấy phải lớn hơn 0',

    remaining: selectedTransaction.remaining >= 0
      ? ''
      : 'Số lượng còn lại không hợp lệ',

    quantityLimit: selectedTransaction.quantityTaken < selectedTransaction.remaining
      ? 'Số lượng còn lại không được lớn hơn số lượng đã lấy!'
      : '',

    date: dayjs(selectedTransaction.date).isAfter(dayjs())
      ? 'Ngày giao dịch không thể ở tương lai'
      : '',

    doctorId: selectedTransaction.doctorId > 0
      ? ''
      : 'Vui lòng chọn bác sĩ',

    vaccineId: selectedTransaction.vaccineId > 0
      ? ''
      : 'Vui lòng chọn loại vaccine',
  };
  const [vaccineSearch, setVaccineSearch] = useState('');

  const handleToggle = async ({ modal, id }) => {
    switch (modal) {
      case 'add':
        setAddModal(!addModal);
        setSelectedTransaction({
          id: -1,
          quantityTaken: 0,
          remaining: 0,
          date: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
          doctorId: 3,
          doctorName: '',
          vaccineId: -1,
          batchIds: []
        });
        setVaccineSearch('');
        break;
      case 'edit':
        if (id != null) {
          let transaction_data = await getTransactions({
            accessToken: user.accessToken,
            pageNo: pageNo,
            pageSize: pageSize,
            params: transactionParams.map(p => p[0]),
            sortBy: 'id:desc',
            filters: 'id=' + id
          });
          let transaction = transaction_data.data[0];
          setSelectedTransaction(({
            id: transaction.id,
            quantityTaken: transaction.quantityTaken,
            remaining: transaction.remaining,
            date: dayjs(transaction.date).format('YYYY-MM-DDTHH:mm:ss'),
            doctorId: transaction.doctorId,
            doctorName: transaction.doctorName,
            vaccineId: -1,
            batchIds: transaction.batchIds
          }));
        }
        setEditModal(!editModal);
        break;
      case 'delete':
        if (id != null) {
          setSelectedTransaction({
            id: id,
            quantityTaken: 0,
            remaining: 0,
            date: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
            doctorId: -1,
            doctorName: '',
            vaccineId: -1,
            batchIds: []
          });
        }
        setDeleteModal(!deleteModal);
        break;
      default:
        break
    }
    callAPITransaction();
  }

  const handleSubmit = async ({ modal }) => {
    switch (modal) {
      case 'add':
        if (validatedTransaction.quantityTaken) {
          toast.error(validatedTransaction.quantityTaken);
          return;
        }
        if (validatedTransaction.quantityLimit) {
          toast.error(validatedTransaction.quantityLimit);
          return;
        }
        if (validatedTransaction.remaining) {
          toast.error(validatedTransaction.remaining);
          return;
        }
        if (validatedTransaction.date) {
          toast.error(validatedTransaction.date);
          return;
        }
        if (validatedTransaction.doctorId) {
          toast.error(validatedTransaction.doctorId);
          return;
        }
        if (validatedTransaction.vaccineId) {
          toast.error(validatedTransaction.vaccineId);
          return;
        }
        await addTransaction({
          accessToken: user.accessToken,
          quantityTaken: selectedTransaction.quantityTaken,
          remaining: selectedTransaction.remaining,
          date: selectedTransaction.date,
          doctorId: selectedTransaction.doctorId,
          vaccineId: selectedTransaction.vaccineId
        });
        handleToggle({ modal: 'add' });
        break;
      case 'edit':
        if (validatedTransaction.quantityLimit) {
          toast.error(validatedTransaction.quantityLimit);
          return;
        }
        if (validatedTransaction.remaining) {
          toast.error(validatedTransaction.remaining);
          return;
        }
        if (validatedTransaction.date) {
          toast.error(validatedTransaction.date);
          return;
        }
        if (validatedTransaction.doctorId) {
          toast.error(validatedTransaction.doctorId);
          return;
        }
        await editTransaction({
          accessToken: user.accessToken,
          transactionId: selectedTransaction.id,
          remaining: selectedTransaction.remaining,
          date: selectedTransaction.date,
          doctorId: selectedTransaction.doctorId,
        });
        handleToggle({ modal: 'edit' });
        break;
      case 'delete':
        await deleteTransaction({ accessToken: user.accessToken, transactionId: selectedTransaction.id });
        handleToggle({ modal: 'delete' });
        break;
      default:
        break
    }
  }

  const callAPITransaction = async () => {
    let data = await getTransactions({
      accessToken: user.accessToken,
      pageNo: pageNo,
      pageSize: pageSize,
      params: params.filter(p => p != null).map(p => p[0]),
      sortBy: sortBy,
      filters: 'doctorName=' + search
    });

    setTransactions(data.data);
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
    if (Array.isArray(value)) {
      return `<ul>${value.map(v => `<li>${formatValue(v)}</li>`).join("")}</ul>`;
    } else if (isISODate(value)) {
      return dayjs(value).format("DD/MM/YYYY HH:mm");
    } else if (typeof value === "number") {
      return Number.isInteger(value) ? value : value.toFixed(2);
    } else if (typeof value === "object" && value !== null) {
      return `<ul>${Object.entries(value)
        .map(([key, val]) => `${formatKeys[key]}: ${formatValue(val)} <br/>`)
        .join("")}</ul>`;
    }
    return value;
  };

  const formatKeys = {
    "batchId": "Mã lô",
    "quantityTaken": "SL lấy",
    "remaining": "Còn lại",
  }

  useEffect(() => {
    callAPITransaction();
  }, [params, pageNo, pageSize, sortBy, search]);

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
                <span className='fw-bold fs-1'>Quản lý xuất kho</span>
                {/* <div className='d-flex gap-3'>
                  <Button onClick={() => handleToggle({ modal: 'add' })} variant='success' className='rounded-0'> <i className="bi bi-plus-square me-2"></i> Tạo xuất kho</Button>
                </div> */}
              </div>
            </Row>
            <Row className='mb-3'>
              <Col md={1}>
                <Dropdown>
                  <Dropdown.Toggle variant='light' className='rounded-0 border'>
                    Bộ lọc
                  </Dropdown.Toggle>
                  <Dropdown.Menu className='rounded-0 p-0' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {
                      transactionParams.map((bp, _) => (
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
              </Col>
              <Col md={3}>
                <Form.Control value={search} onChange={(e) => setSearch(e.target.value)} className='rounded-0' placeholder='Tìm kiếm theo tên bác sĩ...' />
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr className="align-middle text-center">
                      {params.filter(p => p != null).map((v, _) => {
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
                  <tbody className='align-middle'>
                    {
                      transactions?.map((batch, _) => (
                        <tr key={_}>
                          {params.filter(p => p != null).map((bp, __) => (
                            <td key={__} dangerouslySetInnerHTML={{ __html: formatValue(batch[bp[0]]) }}></td>
                          ))}
                          <td>
                            <Button variant='' className='me-2' onClick={() => handleToggle({ modal: 'edit', id: batch.id })}><i className="bi bi-pen" /></Button>
                            <Button variant='' onClick={() => handleToggle({ modal: 'delete', id: batch.id })}><i className="bi bi-trash" /></Button>
                          </td>
                        </tr>
                      ))
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

      <Modal show={addModal} onHide={() => handleToggle({ modal: 'add' })} size='md' >
        <Modal.Header closeButton>
          <Modal.Title>Xuất lô mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className='mb-3'>
              <Col className='p-0 me-3'>
                <InputGroup>
                  <InputGroup.Text className='rounded-0'>Số lượng đã lấy</InputGroup.Text>
                  <Form.Control isInvalid={validatedTransaction.quantityTaken} value={selectedTransaction.quantityTaken} onChange={(e) => setSelectedTransaction(({ ...selectedTransaction, quantityTaken: e.target.value }))} placeholder='Nhập mã lô...' className='rounded-0' type="number" min={1} step={1} />
                  <Form.Control.Feedback type='invalid'>{validatedTransaction.quantityTaken}</Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col className='p-0 pe-3'>
                <InputGroup>
                  <InputGroup.Text className='rounded-0'>Ngày lấy</InputGroup.Text>
                  <Form.Control value={selectedTransaction.date.split('T')[0]} onChange={(e) => setSelectedTransaction(({
                    ...selectedTransaction, date: dayjs(selectedTransaction.date)
                      .set('year', dayjs(e.target.value).year())
                      .set('month', dayjs(e.target.value).month())
                      .set('date', dayjs(e.target.value).date())
                      .format("YYYY-MM-DDTHH:mm:ss")
                  }))} className='rounded-0' type="date" />
                  <Form.Control value={selectedTransaction.date.split('T')[1]} onChange={(e) => setSelectedTransaction(({
                    ...selectedTransaction, date: dayjs(selectedTransaction.date)
                      .set('hour', dayjs(`2000-01-01T${e.target.value}`).hour())
                      .set('minute', dayjs(`2000-01-01T${e.target.value}`).minute())
                      .format("YYYY-MM-DDTHH:mm:ss")
                  }))} className='rounded-0' type="time" />
                  {
                    validatedTransaction.date && (
                      <Form.Control.Feedback type='invalid' className='d-block'>{validatedTransaction.date}</Form.Control.Feedback>
                    )
                  }
                </InputGroup>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col className='p-0 pe-3'>
                <InputGroup>
                  <InputGroup.Text className='rounded-0'>ID bác sĩ</InputGroup.Text>
                  <Form.Control isInvalid={validatedTransaction.doctorId} className='rounded-0' type='number' step={1} value={selectedTransaction.doctorId} onChange={(e) => setSelectedTransaction({ ...selectedTransaction, doctorId: e.target.value })} />
                  <Form.Control.Feedback type='invalid'>{validatedTransaction.doctorId}</Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col className='p-0'>
                <InputGroup>
                  <InputGroup.Text className='rounded-0'>Loại Vaccine</InputGroup.Text>
                  <Dropdown>
                    <Dropdown.Toggle className='rounded-0 border text-start text-wrap' variant='light' id="dropdown-basic">
                      {selectedTransaction.vaccineId === -1 ? 'Chọn vaccine' : vaccines.find(v => v.id === selectedTransaction.vaccineId).vaccineCode}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='rounded-0 p-0' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <Form.Control value={vaccineSearch} onChange={(e) => setVaccineSearch(e.target.value)} className='rounded-0' />
                      {
                        vaccines.filter(v => v.vaccineCode.toLowerCase().includes(vaccineSearch.toLowerCase()) || v.name.toLowerCase().includes(vaccineSearch.toLowerCase())).map((vaccine, _) => (
                          <Dropdown.Item key={_} onClick={() => setSelectedTransaction({ ...selectedTransaction, vaccineId: vaccine.id })}>[{vaccine.vaccineCode}]{vaccine.name}</Dropdown.Item>
                        ))
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                  {
                    validatedTransaction.vaccineId && (
                      <Form.Control.Feedback type='invalid' className='d-block'>{validatedTransaction.vaccineId}</Form.Control.Feedback>
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

      <Modal show={editModal} onHide={() => handleToggle({ modal: 'edit' })} size='md' >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa lô</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className='mb-3'>
              <Col className='p-0 me-3'>
                <InputGroup>
                  <InputGroup.Text className='rounded-0'>Số lượng đã lấy</InputGroup.Text>
                  <Form.Control isInvalid={validatedTransaction.quantityTaken || validatedTransaction.quantityLimit} value={selectedTransaction.quantityTaken} readOnly disabled placeholder='Nhập mã lô...' className='rounded-0' type="number" min={1} step={1} />
                  <Form.Control.Feedback type='invalid'>{validatedTransaction.quantityTaken}</Form.Control.Feedback>
                  <Form.Control.Feedback type='invalid'>{validatedTransaction.quantityLimit}</Form.Control.Feedback>
                </InputGroup>

              </Col>
              <Col>
                <InputGroup>
                  <InputGroup.Text className='rounded-0'>Còn lại</InputGroup.Text>
                  <Form.Control isInvalid={validatedTransaction.remaining || validatedTransaction.quantityLimit} value={selectedTransaction.remaining} onChange={(e) => setSelectedTransaction(({ ...selectedTransaction, remaining: e.target.value }))} placeholder='Nhập mã lô...' className='rounded-0' type="number" min={1} step={1} />
                  <Form.Control.Feedback type='invalid'>{validatedTransaction.remaining}</Form.Control.Feedback>
                  <Form.Control.Feedback type='invalid'>{validatedTransaction.quantityLimit}</Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col className='p-0 pe-3'>
                <InputGroup>
                  <InputGroup.Text className='rounded-0'>Ngày lấy</InputGroup.Text>
                  <Form.Control value={selectedTransaction.date.split('T')[0]} onChange={(e) => setSelectedTransaction(({
                    ...selectedTransaction, date: dayjs(selectedTransaction.date)
                      .set('year', dayjs(e.target.value).year())
                      .set('month', dayjs(e.target.value).month())
                      .set('date', dayjs(e.target.value).date())
                      .format("YYYY-MM-DDTHH:mm:ss")
                  }))} className='rounded-0' type="date" />
                  <Form.Control value={selectedTransaction.date.split('T')[1]} onChange={(e) => setSelectedTransaction(({
                    ...selectedTransaction, date: dayjs(selectedTransaction.date)
                      .set('hour', dayjs(`2000-01-01T${e.target.value}`).hour())
                      .set('minute', dayjs(`2000-01-01T${e.target.value}`).minute())
                      .format("YYYY-MM-DDTHH:mm:ss")
                  }))} className='rounded-0' type="time" />
                  {
                    validatedTransaction.date && (
                      <Form.Control.Feedback type='invalid' className='d-block'>{validatedTransaction.date}</Form.Control.Feedback>
                    )
                  }
                </InputGroup>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col className='p-0 pe-3'>
                <InputGroup>
                  <InputGroup.Text className='rounded-0'>ID bác sĩ</InputGroup.Text>
                  <Form.Control isInvalid={validatedTransaction.doctorId} className='rounded-0' type='number' step={1} value={selectedTransaction.doctorId} onChange={(e) => setSelectedTransaction({ ...selectedTransaction, doctorId: e.target.value })} />
                  <Form.Control.Feedback type='invalid'>{validatedTransaction.doctorId}</Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Row>
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
          <p>Bạn có chắc chắn muốn xoá transaction đã chọn?</p>
          <span className='badge bg-secondary'>{selectedTransaction.id}</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary rounded-0' onClick={() => handleToggle({ modal: 'delete' })}>Hủy</Button>
          <Button variant='danger rounded-0' onClick={() => handleSubmit({ modal: 'delete' })}>Xoá</Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}
