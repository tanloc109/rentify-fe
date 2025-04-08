import { useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import {
    Button,
    Form,
    Container,
    Row,
    Col,
    Modal,
    Table,
    Badge,
    Pagination,
    Spinner,
    Card
} from "react-bootstrap";

import styles from "./PurposeManagement.module.scss";
import { getPurposes, deletePurpose, undeletePurpose, createPurpose, UpdatePurpose, searchPurpose } from '../services/purposeService';
import { UserContext } from '../App';
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

function PurposeManagement() {
    const { user } = useContext(UserContext);

    const [dataPurposes, setDataPurposes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalElement, setTotalElement] = useState(0);
    const [itemsPerPage] = useState(5);

    const [filters, setFilters] = useState({
        name: '',
        sortBy: ''
    });

    const [isSearching, setIsSearching] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [selectedPurpose, setSelectedPurpose] = useState(null);

    const [errors, setErrors] = useState({});

    const SortingOptions = [
        { id: "nameasc", label: "Tên (A-Z)" },
        { id: "namedesc", label: "Tên (Z-A)" },
    ];

    const fetchPurposes = async () => {
        setLoading(true);
        try {
            const params = {
                currentPage: currentPage,
                pageSize: itemsPerPage
            };

            const resultPurposes = await getPurposes(user.accessToken, params);

            setTotalElement(resultPurposes.totalElements);
            setTotalPage(resultPurposes.totalPages);
            setCurrentPage(resultPurposes.currentPage);
            setDataPurposes(resultPurposes.data);
        } catch (error) {
            console.error("Có lỗi xảy ra khi gọi API công dụng:", error);
            toast.error("Không thể tải dữ liệu công dụng");
        } finally {
            setLoading(false);
        }
    };

    const searchPurposes = async () => {
        setLoading(true);
        try {
            const resolvedFilters = {
                ...filters,
                currentPage: currentPage,
                pageSize: itemsPerPage,
            };

            const resultVaccineUses = await searchPurpose(user.accessToken, resolvedFilters);

            if (resultVaccineUses.status === 200) {
                setDataPurposes(resultVaccineUses.data.data);
                setTotalElement(resultVaccineUses.data.totalElements);
                setTotalPage(resultVaccineUses.data.totalPages);
                setCurrentPage(resultVaccineUses.data.currentPage);
            } else {
                setDataPurposes([]);
                setTotalElement(0);
                setTotalPage(0);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi tìm kiếm công dụng:", error);
            toast.error("Không thể tìm kiếm công dụng");
            setDataPurposes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSearching) {
            searchPurposes();
        } else {
            fetchPurposes();
        }
    }, [currentPage, isSearching]);

    useEffect(() => {
        if (!filters.name && !filters.sortBy) {
            setIsSearching(false);
        } else {
            setIsSearching(true);
        }
    }, [filters]);

    const handleSortChange = (sortKey) => {
        setFilters((prevFilters) => {
            const sortOptions = prevFilters.sortBy ? prevFilters.sortBy.split(",") : [];
            const newSortOptions = sortOptions.includes(sortKey)
                ? sortOptions.filter(option => option !== sortKey)
                : [...sortOptions, sortKey];

            return { ...prevFilters, sortBy: newSortOptions.join(",") };
        });
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [formData, setFormData] = useState({
        id: null,
        name: "",
        description: "",
    });

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Tên công dụng không được để trống";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "Tên công dụng phải có ít nhất 3 ký tự";
        } else if (formData.name.trim().length > 100) {
            newErrors.name = "Tên công dụng không được vượt quá 100 ký tự";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Mô tả công dụng không được để trống";
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Mô tả công dụng phải có ít nhất 10 ký tự";
        } else if (formData.description.trim().length > 500) {
            newErrors.description = "Mô tả công dụng không được vượt quá 500 ký tự";
        }

        return newErrors;
    };

    const handleChangeFormData = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear specific field error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (isEditing) {
            handleUpdatePurpose(formData, formData.id);
        } else {
            handleCreatePurpose({ name: formData.name, description: formData.description });
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            name: "",
            description: "",
        });
        setErrors({});
    };

    const handleEdit = (purpose) => {
        setFormData(purpose);
        setIsEditing(true);
        setShowAddUpdateModal(true);
    };

    const handleAddNew = () => {
        resetForm();
        setIsEditing(false);
        setShowAddUpdateModal(true);
    };

    const handleShowDetails = (purpose) => {
        setSelectedPurpose(purpose);
        setShowDetailModal(true);
    };

    const handleCreatePurpose = async (params) => {
        try {
            const result = await createPurpose(user.accessToken, params);

            if (result.status === "Success") {
                const data = result.data;

                toast.success(`Bạn đã tạo công dụng "${data.name}" thành công!`);

                setDataPurposes(prevPurposes => [
                    data,
                    ...prevPurposes
                ]);
                setTotalElement((prev) => prev + 1);
                setShowAddUpdateModal(false);
                resetForm();
            } else {
                toast.error(`Lỗi: ${result.message}`);
                if (result.error) {
                    setErrors(result.error);
                }
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi tạo công dụng!");
            console.error(error);
        }
    };

    const handleUpdatePurpose = async (params, purposeID) => {
        try {
            const result = await UpdatePurpose(user.accessToken, params, purposeID);

            if (result.status === "Success") {
                const data = result.data;

                toast.success(`Bạn đã cập nhật công dụng "${data.name}" thành công!`);

                setDataPurposes(prevPurposes =>
                    prevPurposes.map(purpose =>
                        purpose.id === purposeID ? { ...data } : purpose
                    )
                );
                setShowAddUpdateModal(false);
                resetForm();
            } else {
                toast.error(`Lỗi: ${result.message}`);
                if (result.error) {
                    setErrors(result.error);
                }
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật công dụng!");
            console.error(error);
        }
    };

    const handleRestorePurpose = async (purposeID) => {
        try {
            const restoredPurpose = await undeletePurpose(user.accessToken, purposeID);

            toast.success(`Bạn đã khôi phục công dụng "${restoredPurpose.name}" thành công!`);

            setDataPurposes(prevPurposes =>
                prevPurposes.map(purpose =>
                    purpose.id === restoredPurpose.id ? { ...purpose, deleted: false } : purpose
                )
            );
        } catch (error) {
            toast.error("Có lỗi xảy ra khi khôi phục công dụng!");
            console.error(error);
        }
    };

    const handleDeletePurpose = async (purposeID) => {
        try {
            const resultVaccines = await deletePurpose(user.accessToken, purposeID);
            toast.success(`Bạn đã xóa công dụng "${resultVaccines.name}" thành công!`);
            
            setDataPurposes(prevVaccines =>
                prevVaccines.map(vaccine =>
                    vaccine.id === resultVaccines.id ? { ...vaccine, deleted: true } : vaccine
                )
            );
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa công dụng!");
            console.error(error);
        }
    };

    const renderPagination = () => {
        if (totalPage <= 1) return null;

        return (
            <Pagination className="justify-content-center mt-4">
                <Pagination.First 
                    onClick={() => handlePageChange(1)} 
                    disabled={currentPage === 1}
                />
                <Pagination.Prev 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                />
                
                {Array.from({ length: totalPage }, (_, i) => {
                    // Show first page, last page, and 1 page before and after current page
                    if (
                        i === 0 || 
                        i === totalPage - 1 || 
                        (i >= currentPage - 2 && i <= currentPage)
                    ) {
                        return (
                            <Pagination.Item 
                                key={i + 1} 
                                active={i + 1 === currentPage} 
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        );
                    } else if (
                        i === 1 && currentPage > 3 || 
                        i === totalPage - 2 && currentPage < totalPage - 2
                    ) {
                        return <Pagination.Ellipsis key={`ellipsis-${i}`} />;
                    }
                    return null;
                })}
                
                <Pagination.Next 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPage}
                />
                <Pagination.Last 
                    onClick={() => handlePageChange(totalPage)} 
                    disabled={currentPage === totalPage}
                />
            </Pagination>
        );
    };

    return (
        <Container className={cx("wrapper", "mt-5")}>
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h2 className="text-center fw-bold m-0">
                        {isSearching ? "Tìm thấy" : "Danh sách"} {totalElement} công dụng
                    </h2>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Tìm kiếm theo tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên công dụng..."
                                    value={filters.name}
                                    onChange={(e) => {
                                        setFilters({ ...filters, name: e.target.value });
                                        setCurrentPage(1);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Sắp xếp theo</Form.Label>
                                <div className="d-flex gap-3">
                                    {SortingOptions.map(option => (
                                        <Form.Check
                                            key={option.id}
                                            type="checkbox"
                                            id={`sort-${option.id}`}
                                            label={option.label}
                                            checked={filters.sortBy.split(",").includes(option.id)}
                                            onChange={() => handleSortChange(option.id)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end mb-3">
                        <Button variant="success" onClick={handleAddNew}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Thêm công dụng mới
                        </Button>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Đang tải dữ liệu...</p>
                        </div>
                    ) : dataPurposes.length === 0 ? (
                        <div className="text-center py-5">
                            <h4>Không có dữ liệu công dụng</h4>
                            <p className="text-muted">Vui lòng thêm công dụng mới hoặc thay đổi bộ lọc tìm kiếm</p>
                        </div>
                    ) : (
                        <Table striped bordered hover responsive className="align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-center" style={{ width: '5%' }}>#</th>
                                    <th style={{ width: '25%' }}>Tên công dụng</th>
                                    <th style={{ width: '45%' }}>Mô tả</th>
                                    <th className="text-center" style={{ width: '10%' }}>Trạng thái</th>
                                    <th className="text-center" style={{ width: '15%' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataPurposes.map((purpose, index) => (
                                    <tr key={purpose.id}>
                                        <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>{purpose.name}</td>
                                        <td>
                                            {purpose.description.length > 100 
                                                ? `${purpose.description.substring(0, 100)}...` 
                                                : purpose.description}
                                        </td>
                                        <td className="text-center">
                                            {purpose.deleted ? (
                                                <Badge bg="danger">Đã xóa</Badge>
                                            ) : (
                                                <Badge bg="success">Hoạt động</Badge>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button 
                                                    variant="info" 
                                                    size="sm" 
                                                    onClick={() => handleShowDetails(purpose)}
                                                    title="Xem chi tiết"
                                                >
                                                    <i className="bi bi-info-circle"></i>
                                                </Button>
                                                {!purpose.deleted && (
                                                    <Button 
                                                        variant="warning" 
                                                        size="sm" 
                                                        onClick={() => handleEdit(purpose)}
                                                        title="Sửa"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </Button>
                                                )}
                                                {purpose.deleted ? (
                                                    <Button 
                                                        variant="success" 
                                                        size="sm" 
                                                        onClick={() => handleRestorePurpose(purpose.id)}
                                                        title="Khôi phục"
                                                    >
                                                        <i className="bi bi-arrow-counterclockwise"></i>
                                                    </Button>
                                                ) : (
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm" 
                                                        onClick={() => handleDeletePurpose(purpose.id)}
                                                        title="Xóa"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}

                    {renderPagination()}
                </Card.Body>
            </Card>

            {/* Modal thêm/sửa công dụng */}
            <Modal 
                show={showAddUpdateModal} 
                onHide={() => {
                    setShowAddUpdateModal(false);
                    resetForm();
                }} 
                centered
            >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>
                        {isEditing ? "Chỉnh sửa công dụng" : "Thêm công dụng mới"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên công dụng <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChangeFormData} 
                                isInvalid={!!errors.name}
                                placeholder="Nhập tên công dụng"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả chi tiết <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3}
                                name="description" 
                                value={formData.description} 
                                onChange={handleChangeFormData} 
                                isInvalid={!!errors.description}
                                placeholder="Nhập mô tả chi tiết công dụng"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button 
                                variant="secondary" 
                                onClick={() => {
                                    setShowAddUpdateModal(false);
                                    resetForm();
                                }}
                            >
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit">
                                {isEditing ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal chi tiết công dụng */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered>
                <Modal.Header closeButton className="bg-info text-white">
                    <Modal.Title>Chi tiết công dụng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPurpose && (
                        <div>
                            <Table borderless>
                                <tbody>
                                    <tr>
                                        <td className="fw-bold" style={{ width: '30%' }}>ID:</td>
                                        <td>{selectedPurpose.id}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold">Tên công dụng:</td>
                                        <td>{selectedPurpose.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold">Mô tả:</td>
                                        <td>{selectedPurpose.description}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold">Trạng thái:</td>
                                        <td>
                                            {selectedPurpose.deleted ? (
                                                <Badge bg="danger">Đã xóa</Badge>
                                            ) : (
                                                <Badge bg="success">Hoạt động</Badge>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Đóng
                    </Button>
                    {selectedPurpose && !selectedPurpose.deleted && (
                        <Button variant="warning" onClick={() => {
                            setShowDetailModal(false);
                            handleEdit(selectedPurpose);
                        }}>
                            Chỉnh sửa
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default PurposeManagement;