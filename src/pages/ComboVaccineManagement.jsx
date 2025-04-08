import { useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import {
    Button,
    Form,
    Container,
    Row,
    Pagination,
    Col,
    Modal,
    InputGroup,
    Card,
    Table,
    Badge,
    Spinner,
    Stack
} from "react-bootstrap";

import styles from "./ComboVaccineManagement.module.scss";
import { getCombos, deleteVaccineCombo, undeleteVaccineCombo, createCombo, updateCombo, searchCombos } from '../services/comboService';
import { UserContext } from '../App';
import { getVaccinesNoPaging } from '../services/vaccineService';
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

function ComboVaccineManagement() {
    const { user } = useContext(UserContext);

    const [dataCombos, setDataCombos] = useState([]);
    const [dataVaccines, setDataVaccines] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalElement, setTotalElement] = useState(0);
    const [itemsPerPage] = useState(5);

    const [filters, setFilters] = useState({
        name: '',
        price: '',
        minAge: '',
        maxAge: '',
        sortBy: ''
    });

    const [isSearching, setIsSearching] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        name: "",
        description: "",
        price: "",
        minAge: "",
        maxAge: "",
        vaccines: [],
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
    const [showDetailCombo, setShowDetailCombo] = useState(false);

    const [selectedVaccineCombo, setSelectedVaccineCombo] = useState(null);

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

    // Add a new improved function to check if the first vaccine in a block is about to be changed
    const isFirstVaccineInBlock = (index) => {
        if (index === 0) return true;

        const currentVaccineId = formData.vaccines[index]?.id?.vaccineId;
        const previousVaccineId = formData.vaccines[index - 1]?.id?.vaccineId;

        // This is a first vaccine if the previous one is different or this is not auto-added
        return currentVaccineId !== previousVaccineId || !formData.vaccines[index]?.isAutoAdded;
    };

    // Fetch vaccines data
    const fetchVaccines = async () => {
        try {
            const params = {
                status: 'active'
            };
            const resultVaccines = await getVaccinesNoPaging(user.accessToken, params);
            setDataVaccines(resultVaccines.data);
        } catch (error) {
            console.error("Có lỗi xảy ra khi tải danh sách vaccine:", error);
            toast.error("Không thể tải danh sách vaccine");
        }
    };

    // Fetch combos data
    const fetchCombos = async () => {
        setLoading(true);
        try {
            const params = {
                currentPage: currentPage,
                pageSize: itemsPerPage
            };

            const resultCombos = await getCombos(user.accessToken, params);
            setDataCombos(resultCombos.data);
            setTotalElement(resultCombos.totalElements);
            setTotalPage(resultCombos.totalPages);
            setCurrentPage(resultCombos.currentPage);
        } catch (error) {
            console.error("Có lỗi xảy ra khi tải gói tiêm:", error);
            toast.error("Không thể tải danh sách gói tiêm");
        } finally {
            setLoading(false);
        }
    };

    // Search combos
    const searchCombosData = async () => {
        setLoading(true);
        try {
            const resolvedFilters = {
                ...filters,
                currentPage: currentPage,
                pageSize: itemsPerPage,
            };

            const resultVaccineCombo = await searchCombos(user.accessToken, resolvedFilters);
            if (resultVaccineCombo.status === 200) {
                setDataCombos(resultVaccineCombo.data.data);
                setTotalElement(resultVaccineCombo.data.totalElements);
                setTotalPage(resultVaccineCombo.data.totalPages);
                setCurrentPage(resultVaccineCombo.data.currentPage);
            } else {
                setDataCombos([]);
                setTotalElement(0);
                setTotalPage(1);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi tìm kiếm gói tiêm:", error);
            toast.error("Không thể tìm kiếm gói tiêm");
            setDataCombos([]);
        } finally {
            setLoading(false);
        }
    };

    // Load vaccines on component mount
    useEffect(() => {
        fetchVaccines();
    }, []);

    // Load combos when page changes or search status changes
    useEffect(() => {
        if (isSearching) {
            searchCombosData();
        } else {
            fetchCombos();
        }
    }, [currentPage, isSearching, itemsPerPage]);

    // Update search status when filters change
    useEffect(() => {
        if (!filters.name && !filters.sortBy && !filters.price && !filters.minAge && !filters.maxAge) {
            setIsSearching(false);
        } else {
            setIsSearching(true);
        }
    }, [filters]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Tên gói tiêm không được để trống";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "Tên gói tiêm phải có ít nhất 3 ký tự";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Mô tả không được để trống";
        }

        if (!formData.price) {
            newErrors.price = "Giá không được để trống";
        } else if (parseFloat(formData.price) <= 0) {
            newErrors.price = "Giá phải lớn hơn 0";
        }

        if (!formData.minAge) {
            newErrors.minAge = "Độ tuổi tối thiểu không được để trống";
        } else if (parseFloat(formData.minAge) < 0) {
            newErrors.minAge = "Độ tuổi tối thiểu không được âm";
        }

        if (!formData.maxAge) {
            newErrors.maxAge = "Độ tuổi tối đa không được để trống";
        } else if (parseFloat(formData.maxAge) <= parseFloat(formData.minAge)) {
            newErrors.maxAge = "Độ tuổi tối đa phải lớn hơn độ tuổi tối thiểu";
        }

        if (formData.vaccines.length === 0) {
            newErrors.vaccines = "Phải chọn ít nhất một vaccine";
        }

        return newErrors;
    };

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

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear specific field error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const filteredFormData = {
            ...formData,
            vaccines: formData.vaccines.map(({ isAutoAdded, ...rest }) => rest),
        };

        if (isEditing) {
            handleUpdateVaccineCombo(filteredFormData, filteredFormData.id);
        } else {
            handleCreateVaccineCombo(filteredFormData);
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            name: "",
            description: "",
            price: "",
            minAge: "",
            maxAge: "",
            vaccines: [],
        });
        setErrors({});
    };

    const handleDetails = (vaccine) => {
        setSelectedVaccineCombo(vaccine);
        setShowDetailCombo(true);
    };

    const handleEdit = (combo) => {
        const updatedVaccines = combo?.vaccines.map((vaccine, index, array) => {
            const firstIndex = array.findIndex(v => v.vaccine.id === vaccine.vaccine.id);
            return {
                ...vaccine,
                isAutoAdded: index !== firstIndex
            };
        });

        setFormData({
            ...combo,
            vaccines: updatedVaccines
        });
        setIsEditing(true);
        setShowAddUpdateModal(true);
    };

    const handleAddNew = () => {
        resetForm();
        setIsEditing(false);
        setShowAddUpdateModal(true);
    };

    const handleClose = () => {
        setShowDetailCombo(false);
        setSelectedVaccineCombo(null);
    };

    const handleCreateVaccineCombo = async (params) => {
        try {
            const result = await createCombo(user.accessToken, params);

            if (result.status === "Success") {
                const data = result.data;
                toast.success(`Bạn đã tạo gói tiêm "${data.name}" thành công!`);

                setDataCombos(prevCombos => [
                    data,
                    ...prevCombos
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
            toast.error("Có lỗi xảy ra khi tạo gói tiêm!");
            console.error(error);
        }
    };

    const handleUpdateVaccineCombo = async (params, vaccineComboID) => {
        try {
            const result = await updateCombo(user.accessToken, params, vaccineComboID);

            if (result.status === "Success") {
                const data = result.data;
                toast.success(`Bạn đã cập nhật gói tiêm "${data.name}" thành công!`);

                setDataCombos(prevCombos =>
                    prevCombos.map(combo =>
                        combo.id === vaccineComboID ? { ...data } : combo
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
            toast.error("Có lỗi xảy ra khi cập nhật gói tiêm!");
            console.error(error);
        }
    };

    const handleRestoreVaccineCombo = async (vaccineComboID) => {
        try {
            const restoredVaccine = await undeleteVaccineCombo(user.accessToken, vaccineComboID);
            toast.success(`Bạn đã khôi phục gói tiêm "${restoredVaccine.name}" thành công!`);

            setDataCombos(prevVaccines =>
                prevVaccines.map(vaccine =>
                    vaccine.id === restoredVaccine.id ? { ...vaccine, deleted: false } : vaccine
                )
            );
        } catch (error) {
            console.error("Lỗi khi khôi phục gói tiêm:", error);
            toast.error("Có lỗi xảy ra khi khôi phục gói tiêm!");
        }
    };

    const handleDeleteVaccineCombo = async (vaccineComboID) => {
        try {
            const resultVaccines = await deleteVaccineCombo(user.accessToken, vaccineComboID);
            toast.success(`Bạn đã xóa gói tiêm "${resultVaccines.name}" thành công!`);

            setDataCombos(prevVaccines =>
                prevVaccines.map(vaccine =>
                    vaccine.id === resultVaccines.id ? { ...vaccine, deleted: true } : vaccine
                )
            );
        } catch (error) {
            console.error("Lỗi khi xóa gói tiêm:", error);
            toast.error("Có lỗi xảy ra khi xóa gói tiêm!");
        }
    };

    // Fix the handleVaccineChange function to properly handle auto-added doses
    const handleVaccineChange = (vaccineId, index) => {
        // Find the vaccine data from the available vaccines
        const vaccineData = dataVaccines.find(v => v.id == vaccineId) || {};
        const dose = vaccineData.dose || 1;

        // Find the block of vaccines that needs to be replaced
        // First determine if this is part of an existing block
        let blockStart = index;
        let blockLength = 1;

        // Find the start of the current block by checking previous entries
        while (blockStart > 0 &&
            formData.vaccines[blockStart - 1]?.isAutoAdded &&
            formData.vaccines[blockStart - 1]?.id?.vaccineId === formData.vaccines[blockStart]?.id?.vaccineId) {
            blockStart--;
        }

        // Find the length of the current block
        let currentVaccineId = formData.vaccines[blockStart]?.id?.vaccineId;
        if (currentVaccineId) {
            for (let i = blockStart; i < formData.vaccines.length; i++) {
                if (formData.vaccines[i]?.id?.vaccineId !== currentVaccineId) {
                    break;
                }
                blockLength = i - blockStart + 1;
            }
        }

        // Make a copy of the vaccines array
        let newVaccines = [...formData.vaccines];

        // Create the new vaccine entries
        const newEntries = [];
        for (let i = 0; i < dose; i++) {
            const timing = i > 0 ? vaccineData.vaccineTimings?.find(t => t.doseNo === i + 1) : null;
            newEntries.push({
                id: {
                    vaccineId: vaccineId,
                    orderInCombo: blockStart + i + 1, // Will be updated later
                    comboId: null
                },
                vaccine: vaccineData,
                combo: null,
                intervalDays: i > 0 ? (timing?.daysAfterPreviousDose || 1) : 1,
                isAutoAdded: i > 0 // First dose is not auto-added
            });
        }

        // Replace the old block with the new entries
        newVaccines.splice(blockStart, blockLength, ...newEntries);

        // Update the orderInCombo for all items
        newVaccines.forEach((v, i) => {
            v.id.orderInCombo = i + 1;
        });

        setFormData((prev) => ({ ...prev, vaccines: newVaccines }));

        // Clear vaccines error if it exists
        if (errors.vaccines) {
            setErrors(prev => ({ ...prev, vaccines: undefined }));
        }
    };


    const handleDaysAfterChange = (index, daysAfter) => {
        const newVaccines = [...formData.vaccines];
        newVaccines[index].intervalDays = daysAfter;
        setFormData((prev) => ({ ...prev, vaccines: newVaccines }));
    };

    const addNewVaccineField = () => {
        setFormData((prev) => ({
            ...prev,
            vaccines: [
                ...prev.vaccines,
                {
                    id: { vaccineId: '', comboId: null, orderInCombo: prev.vaccines.length + 1 },
                    vaccine: {},
                    combo: null,
                    intervalDays: 1
                }
            ]
        }));
    };

    // Fix the moveVaccine function to properly move entire vaccine blocks
    const moveVaccine = (fromIndex, direction) => {
        const newVaccines = [...formData.vaccines];

        // Find all the blocks of vaccines
        const vaccineBlocks = [];
        let currentBlock = null;

        for (let i = 0; i < newVaccines.length; i++) {
            const vaccine = newVaccines[i];
            const vaccineId = vaccine.id.vaccineId;

            if (!currentBlock || currentBlock.vaccineId !== vaccineId || !vaccine.isAutoAdded && i > 0) {
                if (currentBlock) vaccineBlocks.push(currentBlock);
                currentBlock = {
                    vaccineId: vaccineId,
                    doses: [vaccine],
                    doseCount: 1,
                    startIndex: i,
                };
            } else {
                currentBlock.doses.push(vaccine);
                currentBlock.doseCount++;
            }
        }

        if (currentBlock) vaccineBlocks.push(currentBlock);

        // Find which block contains our fromIndex
        const currentBlockIndex = vaccineBlocks.findIndex(block =>
            block.startIndex <= fromIndex &&
            block.startIndex + block.doseCount > fromIndex
        );

        if (currentBlockIndex < 0) return;

        const targetBlockIndex = currentBlockIndex + direction;

        if (targetBlockIndex < 0 || targetBlockIndex >= vaccineBlocks.length) return;

        // Swap the blocks
        const temp = vaccineBlocks[currentBlockIndex];
        vaccineBlocks[currentBlockIndex] = vaccineBlocks[targetBlockIndex];
        vaccineBlocks[targetBlockIndex] = temp;

        // Reconstruct the vaccines array
        const result = vaccineBlocks.flatMap(block => block.doses);

        // Update orderInCombo for all items
        result.forEach((v, i) => {
            v.id.orderInCombo = i + 1;
        });

        setFormData(prev => ({ ...prev, vaccines: result }));
    };

    // Fix the handleDeleteVaccine function to properly remove entire vaccine blocks
    const handleDeleteVaccine = (index) => {
        const newVaccines = [...formData.vaccines];

        // Find the start of the current block
        let blockStart = index;
        while (blockStart > 0 &&
            formData.vaccines[blockStart - 1]?.isAutoAdded &&
            formData.vaccines[blockStart - 1]?.id?.vaccineId === formData.vaccines[blockStart]?.id?.vaccineId) {
            blockStart--;
        }

        // Find the end of the current block
        let blockEnd = index;
        const currentVaccineId = formData.vaccines[index]?.id?.vaccineId;
        while (blockEnd < formData.vaccines.length - 1 &&
            formData.vaccines[blockEnd + 1]?.id?.vaccineId === currentVaccineId &&
            formData.vaccines[blockEnd + 1]?.isAutoAdded) {
            blockEnd++;
        }

        // Remove the entire block
        newVaccines.splice(blockStart, blockEnd - blockStart + 1);

        // Update the orderInCombo for all items
        newVaccines.forEach((v, i) => {
            v.id.orderInCombo = i + 1;
        });

        setFormData(prev => ({ ...prev, vaccines: newVaccines }));
    };

    const calculateTotalPrice = () => {
        return formData.vaccines.reduce((total, vaccines) => total + (vaccines.vaccine.price || 0), 0);
    };

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            price: calculateTotalPrice()
        }));
    }, [formData.vaccines]);

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
                    // Show first page, last page, and pages around current page
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
            <Card className="shadow-sm mb-4">
                <Card.Header className="bg-primary text-white">
                    <h2 className="text-center fw-bold m-0">
                        {isSearching ? "Tìm thấy" : "Danh sách"} {totalElement} gói tiêm chủng
                    </h2>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-4">
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tìm theo tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên gói tiêm..."
                                    value={filters.name}
                                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Lọc theo giá</Form.Label>
                                <Form.Select
                                    value={filters.price}
                                    onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="Thấp">Thấp</option>
                                    <option value="Trung bình">Trung bình</option>
                                    <option value="Cao">Cao</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tuổi tối thiểu</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập tuổi tối thiểu"
                                    value={filters.minAge}
                                    onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tuổi tối đa</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập tuổi tối đa"
                                    value={filters.maxAge}
                                    onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Card className="mt-2 mb-3">
                                <Card.Header className="bg-light">
                                    <strong>Sắp xếp theo</strong>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        {SortingOptions.map(option => (
                                            <Col key={option.id} md={3} className="mb-2">
                                                <Form.Check
                                                    type="checkbox"
                                                    id={`sort-${option.id}`}
                                                    label={option.label}
                                                    checked={filters.sortBy.split(",").includes(option.id)}
                                                    onChange={() => handleSortChange(option.id)}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end mb-3">
                        <Button variant="success" onClick={handleAddNew}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Thêm gói tiêm mới
                        </Button>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Đang tải dữ liệu...</p>
                        </div>
                    ) : dataCombos?.length === 0 ? (
                        <div className="text-center py-5">
                            <h4>Không có dữ liệu gói tiêm</h4>
                            <p className="text-muted">Vui lòng thêm gói tiêm mới hoặc thay đổi bộ lọc tìm kiếm</p>
                        </div>
                    ) : (
                        <Table striped bordered hover responsive className="align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-center" style={{ width: '5%' }}>#</th>
                                    <th style={{ width: '20%' }}>Tên gói tiêm</th>
                                    <th className="text-center" style={{ width: '10%' }}>Số mũi tiêm</th>
                                    <th className="text-center" style={{ width: '15%' }}>Giá</th>
                                    <th className="text-center" style={{ width: '15%' }}>Độ tuổi</th>
                                    <th className="text-center" style={{ width: '10%' }}>Trạng thái</th>
                                    <th className="text-center" style={{ width: '25%' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataCombos?.map((combo, index) => (
                                    <tr key={combo.id}>
                                        <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="fw-semibold">{combo.name}</td>
                                        <td className="text-center">{combo.totalQuantity} mũi</td>
                                        <td className="text-end">
                                            {Number(combo.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'VNĐ')}
                                        </td>
                                        <td className="text-center">{combo.minAge} - {combo.maxAge} tuổi</td>
                                        <td className="text-center">
                                            <Badge bg={combo.deleted ? "secondary" : "success"}>
                                                {combo.deleted ? "Đã xóa" : "Đang hoạt động"}
                                            </Badge>
                                        </td>
                                        <td className="text-center">
                                            <Stack direction="horizontal" gap={2} className="justify-content-center">
                                                <Button variant="info" size="sm" onClick={() => handleDetails(combo.vaccines)}>
                                                    <i className="bi bi-eye"></i>
                                                </Button>
                                                <Button variant="warning" size="sm" onClick={() => handleEdit(combo)}>
                                                    <i className="bi bi-pencil-square"></i>
                                                </Button>
                                                {combo.deleted ? (
                                                    <Button variant="success" size="sm" onClick={() => handleRestoreVaccineCombo(combo.id)}>
                                                        <i className="bi bi-arrow-clockwise"></i>
                                                    </Button>
                                                ) : (
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteVaccineCombo(combo.id)}>
                                                        <i className="bi bi-trash3"></i>
                                                    </Button>
                                                )}
                                            </Stack>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </Table>
                    )}

                    {renderPagination()}
                </Card.Body>
            </Card>

            {/* Modal thêm/sửa gói tiêm */}
            <Modal show={showAddUpdateModal} onHide={() => {
                setShowAddUpdateModal(false);
                resetForm();
            }} centered size="lg">
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>{isEditing ? "Chỉnh sửa gói tiêm" : "Thêm gói tiêm mới"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tên gói tiêm <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.name}
                                        placeholder="Nhập tên gói tiêm"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Giá <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        isInvalid={!!errors.price}
                                        disabled={formData.vaccines.length === 0}
                                        placeholder="Giá gói tiêm"
                                    />
                                    {formData.vaccines.length === 0 && (
                                        <Form.Text className="text-muted">
                                            Giá sẽ được tính tự động khi bạn chọn các vaccine
                                        </Form.Text>
                                    )}
                                    <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Độ tuổi tối thiểu <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="minAge"
                                        value={formData.minAge}
                                        onChange={handleChange}
                                        isInvalid={!!errors.minAge}
                                        placeholder="Nhập độ tuổi tối thiểu"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.minAge}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Độ tuổi tối đa <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="maxAge"
                                        value={formData.maxAge}
                                        onChange={handleChange}
                                        isInvalid={!!errors.maxAge}
                                        placeholder="Nhập độ tuổi tối đa"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.maxAge}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                isInvalid={!!errors.description}
                                placeholder="Nhập mô tả chi tiết về gói tiêm"
                            />
                            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                        </Form.Group>

                        <Card className="mb-3">
                            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                                <span>Danh sách vaccine trong gói <span className="text-danger">*</span></span>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={addNewVaccineField}
                                >
                                    <i className="bi bi-plus-circle me-1"></i>
                                    Thêm mũi tiêm
                                </Button>
                            </Card.Header>
                            <Card.Body className={errors.vaccines ? "border border-danger rounded" : ""}>
                                {errors.vaccines && (
                                    <div className="text-danger mb-3">{errors.vaccines}</div>
                                )}

                                {formData.vaccines.length === 0 && !isEditing && (
                                    <InputGroup className='mb-3'>
                                        <Form.Select
                                            value=""
                                            onChange={(e) => handleVaccineChange(e.target.value, 0)}
                                        >
                                            <option value=''>Chọn vaccine đầu tiên...</option>
                                            {dataVaccines?.map((v) => (
                                                <option key={v.id} value={v.id}>{v.name}</option>
                                            ))}
                                        </Form.Select>
                                        <InputGroup.Text>Thứ tự: 1</InputGroup.Text>
                                    </InputGroup>
                                )}

                                {formData.vaccines.map((vaccine, index) => (
                                    <div
                                        key={index}
                                        className={`mb-3 p-2 ${vaccine.isAutoAdded ? "bg-light" : "border rounded p-3"}`}
                                    >
                                        <InputGroup className={vaccine.isAutoAdded ? "opacity-75" : ""}>
                                            <InputGroup.Text className="bg-primary text-white">
                                                {index + 1}
                                            </InputGroup.Text>
                                            <Form.Select
                                                value={vaccine?.id?.vaccineId ?? ''}
                                                onChange={(e) => handleVaccineChange(e.target.value, index)}
                                                disabled={vaccine.isAutoAdded}
                                            >
                                                <option value=''>Chọn vaccine...</option>
                                                {dataVaccines?.map((v) => (
                                                    <option
                                                        key={v.id}
                                                        value={v.id}
                                                        disabled={formData.vaccines.some(
                                                            (selectedVaccine) =>
                                                                selectedVaccine?.id?.vaccineId == v.id &&
                                                                selectedVaccine.id.orderInCombo !== index + 1
                                                        )}
                                                    >
                                                        {v.name}
                                                    </option>
                                                ))}
                                            </Form.Select>

                                            {index > 0 && (
                                                <Stack direction="horizontal" gap={2} className="ms-2">
                                                    <InputGroup.Text>Số ngày cách mũi trước</InputGroup.Text>
                                                    <Form.Control
                                                        type='number'
                                                        min="1"
                                                        style={{ width: '100px' }}
                                                        value={vaccine?.intervalDays ?? ''}
                                                        onChange={(e) => handleDaysAfterChange(index, parseInt(e.target.value) || 1)}
                                                        disabled={vaccine.isAutoAdded}
                                                    />
                                                </Stack>
                                            )}
                                        </InputGroup>

                                        {!vaccine.isAutoAdded && (
                                            <div className="d-flex justify-content-end gap-2 mt-2">
                                                <Button
                                                    variant='outline-secondary'
                                                    size="sm"
                                                    disabled={index === 0}
                                                    onClick={() => moveVaccine(index, -1)}
                                                >
                                                    <i className="bi bi-arrow-up"></i> Lên
                                                </Button>

                                                <Button
                                                    variant='outline-secondary'
                                                    size="sm"
                                                    disabled={index === formData.vaccines.length - 1}
                                                    onClick={() => moveVaccine(index, 1)}
                                                >
                                                    <i className="bi bi-arrow-down"></i> Xuống
                                                </Button>

                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteVaccine(index)}
                                                >
                                                    <i className="bi bi-trash"></i> Xóa
                                                </Button>
                                            </div>
                                        )}

                                        {vaccine.isAutoAdded && (
                                            <div className="mt-2">
                                                <Badge bg="info">Tự động thêm theo liều lượng của vaccine</Badge>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>

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

            {/* Modal chi tiết gói tiêm */}
            <Modal show={showDetailCombo} onHide={handleClose} centered size="xl">
                <Modal.Header closeButton className="bg-info text-white">
                    <Modal.Title>Chi tiết gói tiêm chủng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={12} className="mb-3">
                            <div className="alert alert-info">
                                <i className="bi bi-info-circle-fill me-2"></i>
                                Gói tiêm bao gồm {selectedVaccineCombo?.length || 0} mũi tiêm theo thứ tự dưới đây
                            </div>
                        </Col>
                    </Row>

                    <Row className="row-cols-1 row-cols-md-2 g-4">
                        {selectedVaccineCombo?.map((vaccineCombo, index) => (
                            <Col key={index}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Header className={`${index === 0 ? 'bg-primary' : 'bg-info'} text-white`}>
                                        {index === 0 ? (
                                            <h5 className="mb-0">Mũi tiêm đầu tiên</h5>
                                        ) : (
                                            <h5 className="mb-0">
                                                Mũi tiêm số {vaccineCombo.id.orderInCombo} -
                                                Cách mũi trước {vaccineCombo.intervalDays} ngày
                                            </h5>
                                        )}
                                    </Card.Header>
                                    <Card.Body>
                                        <Table borderless size="sm">
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: '35%' }}>Tên vaccine:</th>
                                                    <td>{vaccineCombo?.vaccine.name}</td>
                                                </tr>
                                                <tr>
                                                    <th>Mã vaccine:</th>
                                                    <td>{vaccineCombo?.vaccine.vaccineCode}</td>
                                                </tr>
                                                <tr>
                                                    <th>Nhà sản xuất:</th>
                                                    <td>{vaccineCombo?.vaccine.manufacturer}</td>
                                                </tr>
                                                <tr>
                                                    <th>Mô tả:</th>
                                                    <td>{vaccineCombo?.vaccine.description}</td>
                                                </tr>
                                                <tr>
                                                    <th>Số liều cần tiêm:</th>
                                                    <td>{vaccineCombo?.vaccine.dose}</td>
                                                </tr>
                                                <tr>
                                                    <th>Độ tuổi:</th>
                                                    <td>{vaccineCombo?.vaccine.minAge} - {vaccineCombo?.vaccine.maxAge} tuổi</td>
                                                </tr>
                                                <tr>
                                                    <th>Ngày hết hạn:</th>
                                                    <td>{vaccineCombo?.vaccine.expiryDate}</td>
                                                </tr>
                                                <tr>
                                                    <th>Giá:</th>
                                                    <td className="fw-bold text-danger">
                                                        {Number(vaccineCombo?.vaccine.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'VNĐ')}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>

                                        {vaccineCombo?.vaccine.vaccineTimings?.length > 0 && (
                                            <div className="mt-3">
                                                <h6>Lịch tiêm:</h6>
                                                <ul className="list-group">
                                                    {vaccineCombo?.vaccine.vaccineTimings?.map((timing) => (
                                                        <li key={timing.id} className="list-group-item">
                                                            Mũi tiêm số {timing.doseNo} cách {(timing.doseNo - 1) === 0 ? "sau" : "mũi tiêm số"} {(timing.doseNo - 1) === 0 ? "ngày đăng ký" : (timing.doseNo - 1)} là {timing.daysAfterPreviousDose} ngày
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {vaccineCombo?.vaccine.uses?.length > 0 && (
                                            <div className="mt-3">
                                                <h6>Công dụng:</h6>
                                                <ul className="list-group">
                                                    {vaccineCombo?.vaccine.uses.map((use, idx) => (
                                                        <li key={use.id} className="list-group-item">
                                                            {use.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ComboVaccineManagement;