// src/components/Admin/ManageJobTypes.js
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
// Thêm icon Edit, Trash
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
// Import service đầy đủ
import { getAllJobTypes, deleteJobType, updateJobType } from '../../services/JobTypeService';
import CreateJobTypeModal from './CreateJobTypeModal';
// Import modal mới
import UpdateJobTypeModal from './UpdateJobTypeModal';
import DeleteJobTypeModal from './DeleteJobTypeModal';
import { toast } from 'react-toastify';

function ManageJobTypes() {
    const [jobTypes, setJobTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false); // Thêm state update
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Thêm state delete

    // State để truyền dữ liệu vào Modals
    const [jobTypeToUpdate, setJobTypeToUpdate] = useState(null); // Thêm state jobtype đang sửa
    const [jobTypeToDelete, setJobTypeToDelete] = useState(null); // Thêm state jobtype đang xóa

    // Hàm fetch job types (giữ nguyên)
    const fetchJobTypes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllJobTypes();
            setJobTypes(response.data || []);
        } catch (err) {
            console.error("Error fetching job types:", err);
            const errorMsg = err.response?.data?.message || err.message || "Không thể tải danh sách loại công việc.";
            setError(errorMsg);
            toast.error(`Lỗi: ${errorMsg}`);
            setJobTypes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobTypes();
    }, [fetchJobTypes]);

    // ---- Hàm xử lý Modals ----
    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);

    // Thêm hàm cho Update Modal
    const handleShowUpdateModal = (jobType) => {
        setJobTypeToUpdate(jobType);
        setShowUpdateModal(true);
    };
    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setJobTypeToUpdate(null);
    };

     // Thêm hàm cho Delete Modal
    const handleShowDeleteModal = (jobType) => {
        setJobTypeToDelete(jobType);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setJobTypeToDelete(null);
    };
    // ---- Kết thúc hàm xử lý Modals ----

    return (
        <Container fluid className="mt-4">
            <Row className="mb-3 align-items-center">
                <Col>
                    <h2>Quản Lý Loại Công Việc</h2>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" onClick={handleShowCreateModal}>
                        <FaPlus className="me-1" /> Thêm Loại Mới
                    </Button>
                </Col>
            </Row>

            {/* Loading and Error States */}
            {loading && <div className="text-center my-5"><Spinner animation="border" /><p>Đang tải...</p></div>}
            {error && !loading && <Alert variant="danger"><strong>Lỗi:</strong> {error}</Alert>}

            {/* Job Types Table */}
            {!loading && !error && (
                 jobTypes.length > 0 ? (
                    <Table striped bordered hover responsive size="sm">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>ID</th>
                                <th>Tên Loại Công Việc</th>
                                <th>Mô tả</th>
                                <th>Hành Động</th> {/* Thêm lại cột Hành động */}
                            </tr>
                        </thead>
                        <tbody>
                            {jobTypes.map((jobType, index) => (
                                <tr key={jobType._id}>
                                    <td>{index + 1}</td>
                                    <td>{jobType._id}</td>
                                    <td>{jobType.name}</td>
                                    <td>{jobType.description || 'N/A'}</td>
                                    {/* Thêm cột Hành động */}
                                    <td>
                                         {/* Nút Edit */}
                                         <Button
                                            variant="outline-warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleShowUpdateModal(jobType)}
                                            title="Chỉnh sửa"
                                        >
                                            <FaEdit />
                                        </Button>
                                         {/* Nút Delete */}
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleShowDeleteModal(jobType)}
                                            title="Xóa"
                                            // Có thể disable nếu là các loại mặc định
                                            // disabled={['Full-time', 'Part-time'].includes(jobType.name)}
                                        >
                                            <FaTrashAlt />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                 ) : (
                    <Alert variant="info">Không có loại công việc nào để hiển thị.</Alert>
                 )
            )}

            {/* Modals */}
            <CreateJobTypeModal
                show={showCreateModal}
                handleClose={handleCloseCreateModal}
                refreshJobTypes={fetchJobTypes}
            />
            {/* Thêm Modal Update */}
             <UpdateJobTypeModal
                show={showUpdateModal}
                handleClose={handleCloseUpdateModal}
                jobTypeToUpdate={jobTypeToUpdate}
                refreshJobTypes={fetchJobTypes}
            />
             {/* Thêm Modal Delete */}
             <DeleteJobTypeModal
                show={showDeleteModal}
                handleClose={handleCloseDeleteModal}
                jobTypeToDelete={jobTypeToDelete}
                refreshJobTypes={fetchJobTypes}
            />

        </Container>
    );
}

export default ManageJobTypes;