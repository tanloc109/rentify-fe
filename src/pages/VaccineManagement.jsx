import { useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import { toast } from "react-toastify";
import {
    Button,
    Form,
    Container,
    Row,
    ListGroup,
    Pagination,
    Col,
    Modal,
    Card,
    Badge,
    Spinner,
    InputGroup,
    Alert,
    Tab,
    Tabs,
    Table,
    Accordion,
    OverlayTrigger,
    Tooltip
} from "react-bootstrap";

import styles from "./VaccineManagement.module.scss";
import { getVaccinesV2, deleteVaccine, undeleteVaccine, createVaccine, updateVaccine, searchVaccines, getVaccinesNoPaging } from '../services/vaccineService';
import { UserContext } from '../App';
import { getPurposesNoPaging } from '../services/purposeService';

const cx = classNames.bind(styles);

function VaccineManagement() {
    const { user } = useContext(UserContext);

    const [dataVaccines, setDataVaccines] = useState([])
    const [dataVaccineActive, setDataVaccineActive] = useState([])
    const [dataPurposesActive, setDataPurposesActive] = useState([])
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingData, setLoadingData] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalElement, setTotalElement] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [filters, setFilters] = useState({
        name: '',
        purpose: '',
        price: '',
        minAge: '',
        maxAge: '',
        sortBy: ''
    });

    const [isSearching, setIsSearching] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        name: "",
        vaccineCode: "",
        manufacturer: "",
        activated: true,
        description: "",
        price: "",
        expiresInDays: "",
        minAge: "",
        maxAge: "",
        dose: "",
        uses: [],
        vaccineTimings: [],
        toVaccineIntervals: []
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [selectedVaccine, setSelectedVaccine] = useState(null);

    const [errors, setErrors] = useState({});

    const SortingOptions = [
        { id: "nameasc", label: "Tên (A-Z)" },
        { id: "priceasc", label: "Giá (Tăng dần)" },
        { id: "ageminasc", label: "Tuổi thấp nhất (Tăng dần)" },
        { id: "agemaxasc", label: "Tuổi cao nhất (Tăng dần)" },
        { id: "namedesc", label: "Tên (Z-A)" },
        { id: "pricedesc", label: "Giá (Giảm dần)" },
        { id: "agemindesc", label: "Tuổi thấp nhất (Giảm dần)" },
        { id: "agemaxdesc", label: "Tuổi cao nhất (Giảm dần)" }
    ];

    useEffect(() => {
        setInitialLoading(true);

        const apiAll = async () => {
            const params = {
                status: 'active'
            };

            const resultPurposesActive = await getPurposesNoPaging(user.accessToken, params);
            setDataPurposesActive(resultPurposesActive.data)

            const resultVaccineActive = await getVaccinesNoPaging(user.accessToken, params);
            setDataVaccineActive(resultVaccineActive.data)
        };
        apiAll();
        setInitialLoading(false);
    }, [])

    useEffect(() => {
        if (isSearching) return;

        setLoadingData(true);
        const apiAll = async () => {
            const params = {
                currentPage: currentPage,
                pageSize: itemsPerPage
            };

            const resultVaccines = await getVaccinesV2(user.accessToken, params);

            setDataVaccines(resultVaccines.data);
            setTotalElement(resultVaccines.totalElements);
            setTotalPage(resultVaccines.totalPages);
            setCurrentPage(resultVaccines.currentPage);
            setLoadingData(false);
        };
        apiAll();
    }, [currentPage, isSearching, itemsPerPage]);

    useEffect(() => {
        if (!filters.name && !filters.sortBy && !filters.purpose && !filters.price && !filters.minAge && !filters.maxAge) {
            setIsSearching(false);
        } else {
            setIsSearching(true);
        }
    }, [filters]);

    useEffect(() => {
        if (!isSearching) return;

        setLoadingData(true);
        const searchApi = async () => {
            const resolvedFilters = {
                ...filters,
                currentPage: currentPage,
                pageSize: itemsPerPage,
            };

            const resultVaccines = await searchVaccines(user.accessToken, resolvedFilters);
            if (resultVaccines.status === 200) {
                setDataVaccines(resultVaccines.data.data);
            } else {
                setDataVaccines([]);
            }
            setTotalElement(resultVaccines.data.totalElements);
            setTotalPage(resultVaccines.data.totalPages);
            setCurrentPage(resultVaccines.data.currentPage);
        }
        searchApi();
        setLoadingData(false);
    }, [filters, currentPage, isSearching, itemsPerPage])

    const handleSortChange = (sortKey) => {
        setFilters((prevFilters) => {
            const sortOptions = prevFilters.sortBy ? prevFilters.sortBy.split(",") : [];
            const newSortOptions = sortOptions.includes(sortKey)
                ? sortOptions.filter(option => option !== sortKey)
                : [...sortOptions, sortKey];

            return { ...prevFilters, sortBy: newSortOptions.join(",") };
        });
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));

        setIsSearching(true);
    };

    const handleDoseChange = (e) => {
        const newDose = Number(e.target.value);

        setFormData((prevData) => ({
            ...prevData,
            dose: newDose,
            vaccineTimings: newDose >= 1
                ? Array.from({ length: newDose }, (_, index) => ({
                    doseNo: index + 1,
                    daysAfterPreviousDose: "",
                }))
                : [],
        }));
    };

    const handleTimingChange = (index, value) => {
        const updatedTimings = [...formData.vaccineTimings];
        updatedTimings[index].daysAfterPreviousDose = Number(value);
        setFormData((prevData) => ({
            ...prevData,
            vaccineTimings: updatedTimings,
        }));
    };

    const handlePurposeChange = (id) => {
        setFormData((prevForm) => {
            const isSelected = prevForm.uses.some((p) => p.id === id);
            const updatedPurposes = isSelected ? prevForm.uses.filter((p) => p.id !== id) : [...prevForm.uses, dataPurposesActive.find((p) => p.id === id)];
            return { ...prevForm, uses: updatedPurposes };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form first
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin nhập vào");
            return;
        }

        if (isEditing) {
            let copyDataWithoutCode = { ...formData };
            delete copyDataWithoutCode.vaccineCode;

            handleUpdateVaccine(copyDataWithoutCode, copyDataWithoutCode.id);
            setIsEditing(true);
        } else {
            let copyDataWithoutID = { ...formData };
            delete copyDataWithoutID.id;

            handleCreateVaccine(copyDataWithoutID);
            setIsEditing(false);
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            name: "",
            vaccineCode: "",
            manufacturer: "",
            activated: true,
            description: "",
            price: "",
            expiresInDays: "",
            minAge: "",
            maxAge: "",
            dose: "",
            uses: [],
            vaccineTimings: [],
            toVaccineIntervals: [],
        });
    };

    const handleEdit = (vaccine) => {
        setFormData(vaccine);
        setIsEditing(true);
        setShowAddUpdateModal(true);
    };

    const handleAddNew = () => {
        resetForm();
        setIsEditing(false);
        setShowAddUpdateModal(true);
    };

    const handleShowDetails = (vaccine) => {
        setSelectedVaccine(vaccine);
        setShowDetailModal(true);
    };

    const validateForm = () => {
        const newErrors = {};

        // Basic validations
        if (!formData.name || formData.name.trim() === '') {
            newErrors.name = 'Tên vaccine không được để trống';
        }

        if (!isEditing && (!formData.vaccineCode || formData.vaccineCode.trim() === '')) {
            newErrors.vaccineCode = 'Mã vaccine không được để trống';
        }

        if (!formData.manufacturer || formData.manufacturer.trim() === '') {
            newErrors.manufacturer = 'Nhà sản xuất không được để trống';
        }

        if (!formData.description || formData.description.trim() === '') {
            newErrors.description = 'Mô tả không được để trống';
        }

        // Numeric validations
        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
            newErrors.price = 'Giá phải là số dương';
        }

        if (!formData.expiresInDays || isNaN(formData.expiresInDays) || Number(formData.expiresInDays) <= 0) {
            newErrors.expiresInDays = 'Số ngày hết hạn phải là số dương';
        }

        if (formData.minAge === '' || isNaN(formData.minAge) || Number(formData.minAge) < 0) {
            newErrors.minAge = 'Tuổi nhỏ nhất không được nhỏ hơn 0';
        }

        if (!formData.maxAge || isNaN(formData.maxAge) || Number(formData.maxAge) <= 0) {
            newErrors.maxAge = 'Tuổi lớn nhất phải là số dương';
        }

        // Check if minAge is less than maxAge
        if (Number(formData.minAge) > Number(formData.maxAge)) {
            newErrors.minAge = 'Tuổi nhỏ nhất không được lớn hơn tuổi lớn nhất';
            newErrors.maxAge = 'Tuổi lớn nhất không được nhỏ hơn tuổi nhỏ nhất';
        }

        if (!formData.dose || isNaN(formData.dose) || Number(formData.dose) <= 0) {
            newErrors.dose = 'Số liều phải là số dương';
        }

        // Validate vaccine timings if dose > 1
        if (Number(formData.dose) > 1) {
            formData.vaccineTimings.forEach((timing, index) => {
                if (!timing.daysAfterPreviousDose && timing.daysAfterPreviousDose !== 0) {
                    newErrors[`timing_${index}`] = 'Số ngày không được để trống';
                }
            });
        }

        // Validate purposes (uses)
        if (!formData.uses || formData.uses.length === 0) {
            newErrors.uses = 'Vui lòng chọn ít nhất một mục đích';
        }

        // Validate vaccine constraints if any
        if (formData.toVaccineIntervals && formData.toVaccineIntervals.length > 0) {
            formData.toVaccineIntervals.forEach((constraint, index) => {
                if (!constraint.id.toVaccineId) {
                    if (!newErrors.toVaccineIntervals) newErrors.toVaccineIntervals = {};
                    newErrors.toVaccineIntervals[index] = 'Vui lòng chọn vaccine';
                }

                if (constraint.daysBetween < 0) {
                    if (!newErrors.toVaccineIntervals) newErrors.toVaccineIntervals = {};
                    newErrors.toVaccineIntervals[`days_${index}`] = 'Số ngày không được âm';
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateVaccine = async (params) => {
        try {
            const result = await createVaccine(user.accessToken, params);

            if (result.status === "Success") {
                const data = result.data;

                toast.success(`Bạn đã tạo vaccine với tên "${data.name}" thành công!`);

                setDataVaccines(prevVaccines => [
                    data,
                    ...prevVaccines
                ]);
                setTotalElement((prev) => prev + 1)
                setShowAddUpdateModal(false);
                setErrors({})
            } else {
                setIsEditing(false);
                toast.error(`Lỗi: ${result.message}`);
                if (result.error) {
                    setErrors(result.error)
                }
            }

        } catch (error) {
            toast.error("Có lỗi xảy ra khi tạo vaccine!");
            console.error(error);
        }
    };

    const handleUpdateVaccine = async (params, vaccineID) => {
        try {
            const result = await updateVaccine(user.accessToken, params, vaccineID);

            if (result.status === "Success") {
                const data = result.data;

                toast.success(`Bạn đã sửa vaccine với tên "${data.name}" thành công!`);

                setDataVaccines(prevVaccines =>
                    prevVaccines.map(vaccine =>
                        vaccine.id === vaccineID ? { ...data } : vaccine
                    )
                );
                setShowAddUpdateModal(false);
            } else {
                setIsEditing(true);
                toast.error(`Lỗi: ${result.message}`);
                if (result.error) {
                    setErrors(result.error);
                }
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi sửa vaccine!");
            console.error(error);
        }
    };

    const handleRestoreVaccine = async (vaccineID) => {
        try {
            const restoredVaccine = await undeleteVaccine(user.accessToken, vaccineID);

            toast.success(`Bạn đã khôi phục vaccine với tên "${restoredVaccine.name}" thành công!`);

            setDataVaccines(prevVaccines =>
                prevVaccines.map(vaccine =>
                    vaccine.id === restoredVaccine.id ? { ...vaccine, deleted: false } : vaccine
                )
            );
        } catch (error) {
            console.error("Lỗi khi khôi phục vaccine:", error);
            toast.error("Có lỗi xảy ra khi khôi phục vaccine!");
        }
    };

    const handleDeleteVaccine = (vaccineID) => {
        const apiDeleteVaccine = async () => {
            try {
                const resultVaccines = await deleteVaccine(user.accessToken, vaccineID);
                toast.success("Bạn đã xóa vaccine với tên \"" + resultVaccines.name + "\" thành công!");
                setDataVaccines(prevVaccines =>
                    prevVaccines.map(vaccine =>
                        vaccine.id === resultVaccines.id ? { ...vaccine, deleted: true } : vaccine
                    )
                );
            } catch (error) {
                console.error("Lỗi khi xóa vaccine:", error);
                toast.error("Có lỗi xảy ra khi xóa vaccine!");
            }
        };
        apiDeleteVaccine();
    }

    const handleAddConstraint = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            toVaccineIntervals: [
                ...(Array.isArray(prevFormData.toVaccineIntervals) ? prevFormData.toVaccineIntervals : []),
                {
                    id: { fromVaccineId: prevFormData.id || null, toVaccineId: "" },
                    toVaccine: null,
                    daysBetween: 0
                },
            ],
        }));
    };

    const handleRemoveConstraint = (index) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            toVaccineIntervals: prevFormData.toVaccineIntervals.filter((_, i) => i !== index)
        }));
    };

    // Display loading spinner for entire page only during initial load
    if (initialLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Đang tải...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Container className={cx("wrapper", "mt-5 pb-5")}>
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                    <Card.Title as="h2" className="text-center fw-bold mb-4">
                        <i className="bi bi-clipboard2-pulse me-2"></i>
                        Quản lý Vaccine
                    </Card.Title>

                    <Badge bg={isSearching ? "info" : "primary"} className="p-2 mb-3 fs-6">
                        {isSearching ? "Tìm thấy" : "Danh sách"} {totalElement} Vaccine
                    </Badge>

                    <div className="d-flex justify-content-end mb-3">
                        <Button
                            variant="success"
                            className="d-flex align-items-center"
                            onClick={handleAddNew}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Thêm Vaccine mới
                        </Button>
                    </div>

                    <Accordion className="mb-4">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <i className="bi bi-funnel me-2"></i>
                                Bộ lọc và tìm kiếm
                            </Accordion.Header>
                            <Accordion.Body>
                                <Row className="mb-3 g-3">
                                    <Col lg={4} md={6}>
                                        <InputGroup>
                                            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tìm theo tên..."
                                                name="name"
                                                value={filters.name}
                                                onChange={handleFilterChange}
                                            />
                                        </InputGroup>
                                    </Col>
                                    <Col lg={4} md={6}>
                                        <InputGroup>
                                            <InputGroup.Text><i className="bi bi-tag"></i></InputGroup.Text>
                                            <Form.Select
                                                value={filters.purpose}
                                                name="purpose"
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">Lọc theo mục đích</option>
                                                {dataPurposesActive.map(purpose => (
                                                    <option key={purpose.id} value={purpose.name}>{purpose.name}</option>
                                                ))}
                                            </Form.Select>
                                        </InputGroup>
                                    </Col>
                                    <Col lg={4} md={6}>
                                        <InputGroup>
                                            <InputGroup.Text><i className="bi bi-currency-dollar"></i></InputGroup.Text>
                                            <Form.Select
                                                value={filters.price}
                                                name="price"
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">Lọc theo giá</option>
                                                <option value="Thấp">Thấp</option>
                                                <option value="Trung bình">Trung bình</option>
                                                <option value="Cao">Cao</option>
                                            </Form.Select>
                                        </InputGroup>
                                    </Col>
                                    <Col lg={6} md={6}>
                                        <div className="d-flex align-items-center">
                                            <InputGroup className="me-2">
                                                <InputGroup.Text><i className="bi bi-person-badge"></i></InputGroup.Text>
                                                <Form.Control
                                                    isInvalid={!!errors.minAge}
                                                    type="number"
                                                    name="minAge"
                                                    value={formData.minAge}
                                                    onChange={handleChange}
                                                    required
                                                    min={0}
                                                    max={100}
                                                />
                                            </InputGroup>
                                            <span className="mx-2">đến</span>
                                            <InputGroup>
                                                <Form.Control
                                                    type="number"
                                                    name="maxAge"
                                                    placeholder="Tuổi lớn nhất"
                                                    value={filters.maxAge}
                                                    onChange={handleFilterChange}
                                                />
                                            </InputGroup>
                                        </div>
                                    </Col>
                                </Row>

                                <Card className="bg-light">
                                    <Card.Body>
                                        <Card.Title as="h6" className="mb-3">
                                            <i className="bi bi-sort-alpha-down me-2"></i>
                                            Sắp xếp theo:
                                        </Card.Title>
                                        <Row className="g-2">
                                            {SortingOptions.map(option => (
                                                <Col key={option.id} md={3} sm={6}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        id={`sort-${option.id}`}
                                                        label={option.label}
                                                        checked={filters.sortBy.split(",").includes(option.id)}
                                                        onChange={() => handleSortChange(option.id)}
                                                        className="ms-1"
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card.Body>
            </Card>

            {loadingData ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <p className="text-muted">Đang tải dữ liệu...</p>
                </div>
            ) : dataVaccines?.length > 0 ? (
                <>
                    <div className="d-flex justify-content-end mb-3">
                        <Form.Select
                            className="w-auto"
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        >
                            <option value="5">5 dòng/trang</option>
                            <option value="10">10 dòng/trang</option>
                            <option value="20">20 dòng/trang</option>
                        </Form.Select>
                    </div>

                    <Table responsive hover striped className="shadow-sm">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th className="align-middle">Tên Vaccine</th>
                                <th className="align-middle">Nhà sản xuất</th>
                                <th className="align-middle">Mã vaccine</th>
                                <th className="align-middle">Giá</th>
                                <th className="align-middle text-center">Trạng thái</th>
                                <th className="align-middle text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataVaccines.map((vaccine) => (
                                <tr key={vaccine.id}>
                                    <td className="align-middle fw-bold">{vaccine.name}</td>
                                    <td className="align-middle">{vaccine.manufacturer}</td>
                                    <td className="align-middle">{vaccine.vaccineCode}</td>
                                    <td className="align-middle">
                                        {Number(vaccine.price).toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).replace('₫', 'VNĐ')}
                                    </td>
                                    <td className="align-middle text-center">
                                        {vaccine.deleted ? (
                                            <Badge bg="danger">Đã xóa</Badge>
                                        ) : (
                                            <Badge bg="success">Đang hoạt động</Badge>
                                        )}
                                    </td>
                                    <td className="align-middle text-center">
                                        <div className="d-flex justify-content-center">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Xem chi tiết</Tooltip>}
                                            >
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleShowDetails(vaccine)}
                                                >
                                                    <i className="bi bi-eye-fill"></i>
                                                </Button>
                                            </OverlayTrigger>

                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Chỉnh sửa</Tooltip>}
                                            >
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(vaccine)}
                                                >
                                                    <i className="bi bi-pencil-fill"></i>
                                                </Button>
                                            </OverlayTrigger>

                                            {vaccine.deleted ? (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip>Khôi phục</Tooltip>}
                                                >
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleRestoreVaccine(vaccine.id)}
                                                    >
                                                        <i className="bi bi-arrow-counterclockwise"></i>
                                                    </Button>
                                                </OverlayTrigger>
                                            ) : (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip>Xóa</Tooltip>}
                                                >
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteVaccine(vaccine.id)}
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </Button>
                                                </OverlayTrigger>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-center mt-4">
                        <Pagination>
                            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

                            {Array.from({ length: totalPage }, (_, i) => {
                                // Hiển thị tối đa 5 nút phân trang
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
                                }
                                if (i === currentPage + 1 && currentPage < totalPage - 1) {
                                    return <Pagination.Ellipsis key="ellipsis-next" />;
                                }
                                if (i === 1 && currentPage > 3) {
                                    return <Pagination.Ellipsis key="ellipsis-prev" />;
                                }
                                return null;
                            })}

                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPage} />
                            <Pagination.Last onClick={() => handlePageChange(totalPage)} disabled={currentPage === totalPage} />
                        </Pagination>
                    </div>
                </>
            ) : (
                <Alert variant="info" className="text-center">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    Không tìm thấy dữ liệu vaccine.
                </Alert>
            )}

            {/* Modal thêm/sửa vaccine */}
            <Modal
                show={showAddUpdateModal}
                onHide={() => setShowAddUpdateModal(false)}
                centered
                size="lg"
                backdrop="static"
            >
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        <i className={isEditing ? "bi bi-pencil-square me-2" : "bi bi-plus-circle me-2"}></i>
                        {isEditing ? "Chỉnh sửa vaccine" : "Thêm vaccine mới"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Tabs defaultActiveKey="basic" className="mb-3">
                            <Tab eventKey="basic" title="Thông tin cơ bản">
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group controlId="name">
                                            <Form.Label>Tên Vaccine <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                isInvalid={!!errors.name}
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">{errors?.name}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="vaccineCode">
                                            <Form.Label>Mã Vaccine <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                isInvalid={!!errors.vaccineCode}
                                                type="text"
                                                name="vaccineCode"
                                                value={formData.vaccineCode}
                                                onChange={handleChange}
                                                required
                                                disabled={isEditing}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors?.vaccineCode}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="manufacturer">
                                            <Form.Label>Nhà sản xuất <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                isInvalid={!!errors.manufacturer}
                                                type="text"
                                                name="manufacturer"
                                                value={formData.manufacturer}
                                                onChange={handleChange}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">{errors?.manufacturer}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="vaccineType">
                                            <Form.Label>Loại Vaccine <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                value={formData.activated}
                                                onChange={(e) => setFormData((prev) => ({
                                                    ...prev,
                                                    activated: e.target.value === "true"
                                                }))}
                                            >
                                                <option value="true">Vaccine sống</option>
                                                <option value="false">Vaccine bất hoạt</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group controlId="description">
                                            <Form.Label>Mô tả <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                required={!isEditing}
                                                rows={3}
                                                isInvalid={!!errors.description}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors?.description}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="pricing" title="Giá & Thời hạn">
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group controlId="price">
                                            <Form.Label>Giá (VNĐ) <span className="text-danger">*</span></Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text><i className="bi bi-currency-dollar"></i></InputGroup.Text>
                                                <Form.Control
                                                    isInvalid={!!errors.price}
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    required
                                                    min={1}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors?.price}</Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="expiresInDays">
                                            <Form.Label>Hết hạn trong (ngày) <span className="text-danger">*</span></Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    isInvalid={!!errors.expiresInDays}
                                                    type="number"
                                                    name="expiresInDays"
                                                    value={formData.expiresInDays}
                                                    onChange={handleChange}
                                                    required
                                                    min={1}
                                                />
                                                <InputGroup.Text>ngày</InputGroup.Text>
                                                <Form.Control.Feedback type="invalid">{errors?.expiresInDays}</Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="ageRequirements" title="Độ tuổi">
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group controlId="minAge">
                                            <Form.Label>Tuổi nhỏ nhất có thể tiêm <span className="text-danger">*</span></Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    isInvalid={!!errors.minAge}
                                                    type="number"
                                                    name="minAge"
                                                    value={formData.minAge}
                                                    onChange={handleChange}
                                                    required
                                                    min={1}
                                                    max={100}
                                                />
                                                <InputGroup.Text>tuổi</InputGroup.Text>
                                                <Form.Control.Feedback type="invalid">{errors?.minAge}</Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="maxAge">
                                            <Form.Label>Tuổi lớn nhất có thể tiêm <span className="text-danger">*</span></Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    isInvalid={!!errors.maxAge}
                                                    type="number"
                                                    name="maxAge"
                                                    value={formData.maxAge}
                                                    onChange={handleChange}
                                                    required
                                                    min={1}
                                                    max={100}
                                                />
                                                <InputGroup.Text>tuổi</InputGroup.Text>
                                                <Form.Control.Feedback type="invalid">{errors?.maxAge}</Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="doseInfo" title="Liều lượng">
                                <Form.Group className="mb-3" controlId="dose">
                                    <Form.Label>Số liều tiêm <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        isInvalid={!!errors.dose}
                                        type="number"
                                        name="dose"
                                        value={formData.dose}
                                        onChange={handleDoseChange}
                                        required
                                        min={1}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors?.dose}</Form.Control.Feedback>
                                </Form.Group>

                                {formData.vaccineTimings.length > 0 && (
                                    <Card className="mb-3 border-primary">
                                        <Card.Header className="bg-primary text-white">
                                            Lịch tiêm
                                        </Card.Header>
                                        <Card.Body>
                                            {formData.vaccineTimings.map((timing, index) => (
                                                <Form.Group className="mb-3" key={index}>
                                                    <Form.Label>
                                                        <Badge bg="info" className="me-2">{timing.doseNo}</Badge>
                                                        Số ngày tiêm mũi {timing.doseNo} {timing.doseNo - 1 === 0 ? "sau ngày đăng kí" : `sau mũi tiêm số ${timing.doseNo - 1}`}
                                                    </Form.Label>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="number"
                                                            value={timing.daysAfterPreviousDose}
                                                            onChange={(e) => handleTimingChange(index, e.target.value)}
                                                            required
                                                            min={0}
                                                            isInvalid={!!errors[`timing_${index}`]}
                                                        />
                                                        <InputGroup.Text>ngày</InputGroup.Text>
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors[`timing_${index}`]}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                )}
                            </Tab>
                            <Tab eventKey="purposes" title="Mục đích & Ràng buộc">
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Chọn Mục Đích <span className="text-danger">*</span></Form.Label>
                                            <Card className={`bg-light p-2 ${errors.uses ? 'border-danger' : ''}`}>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {dataPurposesActive.map((purpose) => (
                                                        <Badge
                                                            key={purpose.id}
                                                            bg={formData.uses?.some((p) => p.id === purpose.id) ? "primary" : "secondary"}
                                                            className="p-2 cursor-pointer"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handlePurposeChange(purpose.id)}
                                                        >
                                                            {purpose.name}
                                                            {formData.uses?.some((p) => p.id === purpose.id) && (
                                                                <i className="bi bi-check-lg ms-1"></i>
                                                            )}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                {errors.uses && (
                                                    <div className="text-danger mt-2 small">
                                                        <i className="bi bi-exclamation-triangle me-1"></i>
                                                        {errors.uses}
                                                    </div>
                                                )}
                                            </Card>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Ràng buộc Vaccine</Form.Label>

                                            <Card className={`bg-light p-3 ${errors.toVaccineIntervals ? 'border-danger' : ''}`}>
                                                {errors.toVaccineIntervals && typeof errors.toVaccineIntervals === 'string' && (
                                                    <div className="text-danger mb-2 small">
                                                        <i className="bi bi-exclamation-triangle me-1"></i>
                                                        {errors.toVaccineIntervals}
                                                    </div>
                                                )}
                                                {formData.toVaccineIntervals?.length > 0 ? (
                                                    formData.toVaccineIntervals.map((constraint, index) => (
                                                        <div key={index} className="d-flex align-items-center gap-2 mb-3">
                                                            <div className="flex-grow-1">
                                                                <Form.Select
                                                                    value={constraint.id.toVaccineId || ""}
                                                                    onChange={(e) => {
                                                                        const selectedVaccine = dataVaccineActive.find(v => v.id == e.target.value);
                                                                        if (!selectedVaccine) return;

                                                                        const updatedConstraints = [...formData.toVaccineIntervals];
                                                                        updatedConstraints[index] = {
                                                                            ...updatedConstraints[index],
                                                                            id: { fromVaccineId: formData.id, toVaccineId: selectedVaccine.id },
                                                                            toVaccine: {
                                                                                id: selectedVaccine.id,
                                                                                deleted: selectedVaccine.deleted,
                                                                                name: selectedVaccine.name,
                                                                                vaccineCode: selectedVaccine.vaccineCode,
                                                                                activated: selectedVaccine.activated
                                                                            }
                                                                        };

                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            toVaccineIntervals: updatedConstraints
                                                                        }));
                                                                    }}
                                                                    className="mb-2"
                                                                    isInvalid={errors.toVaccineIntervals && errors.toVaccineIntervals[index]}
                                                                >
                                                                    <option value="" disabled>Chọn vaccine</option>
                                                                    {dataVaccineActive.map((vaccine) => (
                                                                        <option
                                                                            key={vaccine.id}
                                                                            value={vaccine.id}
                                                                            disabled={formData.toVaccineIntervals.some(c => c.id.toVaccineId == vaccine.id)}
                                                                            style={{ backgroundColor: formData.toVaccineIntervals.some(c => c.id.toVaccineId == vaccine.id) ? '#d3d3d3' : 'white' }}
                                                                        >
                                                                            {vaccine.name}
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                            </div>

                                                            <Badge bg={constraint.toVaccine && constraint.toVaccine.activated ? "success" : "warning"} className="px-2 py-1">
                                                                {constraint.toVaccine && constraint.toVaccine.activated !== undefined
                                                                    ? constraint.toVaccine.activated
                                                                        ? "Sống"
                                                                        : "Bất hoạt"
                                                                    : "Chọn vaccine"}
                                                            </Badge>

                                                            <InputGroup className="w-25">
                                                                <Form.Control
                                                                    type="number"
                                                                    value={constraint.daysBetween}
                                                                    onChange={(e) => {
                                                                        const updatedConstraints = [...formData.toVaccineIntervals];
                                                                        updatedConstraints[index].daysBetween = parseInt(e.target.value, 10);
                                                                        setFormData((prev) => ({ ...prev, toVaccineIntervals: updatedConstraints }));
                                                                    }}
                                                                    min={0}
                                                                    isInvalid={errors.toVaccineIntervals && errors.toVaccineIntervals[`days_${index}`]}
                                                                />
                                                                <InputGroup.Text>ngày</InputGroup.Text>
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.toVaccineIntervals && errors.toVaccineIntervals[`days_${index}`]}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>

                                                            <Button
                                                                variant="outline-danger"
                                                                onClick={() => handleRemoveConstraint(index)}
                                                                size="sm"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </Button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center text-muted p-3">
                                                        <i className="bi bi-info-circle me-2"></i>
                                                        Chưa có ràng buộc nào được thiết lập
                                                    </div>
                                                )}

                                                <div className="mt-2">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleAddConstraint("", 0)}
                                                        className="d-flex align-items-center mx-auto"
                                                    >
                                                        <i className="bi bi-plus-circle me-2"></i>
                                                        Thêm ràng buộc
                                                    </Button>
                                                </div>

                                                {errors.toVaccineIntervals && (
                                                    <div className="text-danger mt-2">{errors.toVaccineIntervals}</div>
                                                )}
                                            </Card>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => setShowAddUpdateModal(false)}>
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit">
                                {isEditing ? (
                                    <>
                                        <i className="bi bi-save me-2"></i>
                                        Cập nhật
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-circle me-2"></i>
                                        Thêm mới
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal chi tiết vaccine */}
            <Modal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                centered
                size="lg"
            >
                <Modal.Header closeButton className="bg-info text-white">
                    <Modal.Title>
                        <i className="bi bi-info-circle me-2"></i>
                        Chi tiết vaccine: {selectedVaccine?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedVaccine && (
                        <Card>
                            <Card.Body>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Card className="h-100 shadow-sm">
                                            <Card.Header className="bg-primary text-white">
                                                <i className="bi bi-card-list me-2"></i>
                                                Thông tin cơ bản
                                            </Card.Header>
                                            <Card.Body>
                                                <Table borderless size="sm">
                                                    <tbody>
                                                        <tr>
                                                            <td className="fw-bold">Tên:</td>
                                                            <td>{selectedVaccine.name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">Mã vaccine:</td>
                                                            <td>{selectedVaccine.vaccineCode}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">Nhà sản xuất:</td>
                                                            <td>{selectedVaccine.manufacturer}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">Loại vaccine:</td>
                                                            <td>
                                                                <Badge bg={selectedVaccine.activated ? "success" : "warning"}>
                                                                    {selectedVaccine.activated ? "Vaccine sống" : "Vaccine bất hoạt"}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">Độ tuổi:</td>
                                                            <td>Từ {selectedVaccine.minAge} đến {selectedVaccine.maxAge} tuổi</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">Số liều:</td>
                                                            <td>{selectedVaccine.dose}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">Ngày hết hạn:</td>
                                                            <td>{selectedVaccine.expiresInDays} ngày</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">Giá:</td>
                                                            <td>{Number(selectedVaccine.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'VNĐ')}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col md={6}>
                                        <Card className="h-100 shadow-sm">
                                            <Card.Header className="bg-info text-white">
                                                <i className="bi bi-journal-text me-2"></i>
                                                Mô tả
                                            </Card.Header>
                                            <Card.Body className="d-flex align-items-center">
                                                <p className="mb-0 text-muted">
                                                    {selectedVaccine.description ?
                                                        selectedVaccine.description :
                                                        <span className="fst-italic">Không có mô tả cho vaccine này</span>
                                                    }
                                                </p>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col md={12}>
                                        <Card className="shadow-sm">
                                            <Card.Header className="bg-success text-white">
                                                <i className="bi bi-calendar-check me-2"></i>
                                                Lịch tiêm
                                            </Card.Header>
                                            <Card.Body>
                                                {selectedVaccine.vaccineTimings && selectedVaccine.vaccineTimings.length > 0 ? (
                                                    <ListGroup>
                                                        {selectedVaccine.vaccineTimings.map((timing) => (
                                                            <ListGroup.Item key={timing.id} className="d-flex align-items-center">
                                                                <Badge bg="primary" className="me-3">{timing.doseNo}</Badge>
                                                                <span>
                                                                    Mũi tiêm số {timing.doseNo} cách {(timing.doseNo - 1) === 0 ? "sau" : "mũi tiêm số"} {(timing.doseNo - 1) === 0 ? "ngày đăng kí" : (timing.doseNo - 1)} là <strong className="text-primary">{timing.daysAfterPreviousDose} ngày</strong>
                                                                </span>
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                ) : (
                                                    <Alert variant="warning">Không có thông tin lịch tiêm</Alert>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col md={12}>
                                        <Card className="shadow-sm">
                                            <Card.Header className="bg-warning text-dark">
                                                <i className="bi bi-tag me-2"></i>
                                                Mục đích
                                            </Card.Header>
                                            <Card.Body>
                                                {selectedVaccine.uses && selectedVaccine.uses.length > 0 ? (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {selectedVaccine.uses.map((pur, index) => (
                                                            <Card key={pur.id} className="mb-2" style={{ width: '48%' }}>
                                                                <Card.Body>
                                                                    <h6 className="d-flex align-items-center">
                                                                        <Badge bg="info" className="me-2">{index + 1}</Badge>
                                                                        {pur.name}
                                                                        {pur.deleted && (
                                                                            <Badge bg="danger" className="ms-2">Không còn hiệu lực</Badge>
                                                                        )}
                                                                    </h6>
                                                                    <p className="text-muted small mb-0">{pur.description}</p>
                                                                </Card.Body>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Alert variant="warning">Không có thông tin mục đích</Alert>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Đóng
                    </Button>
                    <Button
                        variant="warning"
                        onClick={() => {
                            handleEdit(selectedVaccine);
                            setShowDetailModal(false);
                        }}
                    >
                        <i className="bi bi-pencil me-2"></i>
                        Chỉnh sửa
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default VaccineManagement;