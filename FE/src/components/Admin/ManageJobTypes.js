import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { getAllJobTypes, deleteJobType, updateJobType } from '../../services/JobTypeService';
import CreateJobTypeModal from './CreateJobTypeModal';
import UpdateJobTypeModal from './UpdateJobTypeModal';
import DeleteJobTypeModal from './DeleteJobTypeModal';
import { toast } from 'react-toastify';

function ManageJobTypes() {
    const [jobTypes, setJobTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false); 
    const [showDeleteModal, setShowDeleteModal] = useState(false); 

    const [jobTypeToUpdate, setJobTypeToUpdate] = useState(null); 
    const [jobTypeToDelete, setJobTypeToDelete] = useState(null); 

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

    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);

    const handleShowUpdateModal = (jobType) => {
        setJobTypeToUpdate(jobType);
        setShowUpdateModal(true);
    };
    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setJobTypeToUpdate(null);
    };

    const handleShowDeleteModal = (jobType) => {
        setJobTypeToDelete(jobType);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setJobTypeToDelete(null);
    };

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

            {loading && <div className="text-center my-5"><Spinner animation="border" /><p>Đang tải...</p></div>}
            {error && !loading && <Alert variant="danger"><strong>Lỗi:</strong> {error}</Alert>}

            {!loading && !error && (
                 jobTypes.length > 0 ? (
                    <Table striped bordered hover responsive size="sm">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>ID</th>
                                <th>Tên Loại Công Việc</th>
                                <th>Mô tả</th>
                                <th>Hành Động</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {jobTypes.map((jobType, index) => (
                                <tr key={jobType._id}>
                                    <td>{index + 1}</td>
                                    <td>{jobType._id}</td>
                                    <td>{jobType.name}</td>
                                    <td>{jobType.description || 'N/A'}</td>
                                    <td>
                                         <Button
                                            variant="outline-warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleShowUpdateModal(jobType)}
                                            title="Chỉnh sửa"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleShowDeleteModal(jobType)}
                                            title="Xóa"
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

            <CreateJobTypeModal
                show={showCreateModal}
                handleClose={handleCloseCreateModal}
                refreshJobTypes={fetchJobTypes}
            />
             <UpdateJobTypeModal
                show={showUpdateModal}
                handleClose={handleCloseUpdateModal}
                jobTypeToUpdate={jobTypeToUpdate}
                refreshJobTypes={fetchJobTypes}
            />
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