import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getAllRoles } from '../../services/RoleService';
import CreateRoleModal from './CreateRoleModal';
import UpdateRoleModal from './UpdateRoleModal';
import DeleteRoleModal from './DeleteRoleModal';
import { toast } from 'react-toastify';

function ManageRoles() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [roleToUpdate, setRoleToUpdate] = useState(null);
    const [roleToDelete, setRoleToDelete] = useState(null);

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllRoles();
            setRoles(response.data || []);
        } catch (err) {
            console.error("Error fetching roles:", err);
            const errorMsg = err.response?.data?.message || err.message || "Không thể tải danh sách vai trò.";
            setError(errorMsg);
            toast.error(`Lỗi: ${errorMsg}`);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleShowUpdateModal = (role) => {
        setRoleToUpdate(role);
        setShowUpdateModal(true);
    };
    const handleShowDeleteModal = (role) => {
        setRoleToDelete(role);
        setShowDeleteModal(true);
    };

    // Hàm đóng các modal
    const handleCloseCreateModal = () => setShowCreateModal(false);
    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setRoleToUpdate(null);
    };
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setRoleToDelete(null); 
    };


    return (
        <Container fluid className="mt-4">
            <Row className="mb-3 align-items-center">
                <Col>
                    <h2>Quản Lý Vai Trò Người Dùng</h2>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" onClick={handleShowCreateModal}>
                        <FaPlus className="me-1" /> Thêm Vai Trò Mới
                    </Button>
                </Col>
            </Row>

            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p>Đang tải dữ liệu...</p>
                </div>
            )}

            {error && !loading && (
                <Alert variant="danger">
                    <strong>Lỗi:</strong> {error}
                </Alert>
            )}

            {!loading && !error && (
                 roles.length > 0 ? (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>ID Vai Trò</th>
                                <th>Tên Vai Trò</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role, index) => (
                                <tr key={role._id}>
                                    <td>{index + 1}</td>
                                    <td>{role._id}</td>
                                    <td>{role.name}</td>
                                    <td>
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleShowUpdateModal(role)}
                                            title="Chỉnh sửa"
                                        >
                                            <FaEdit />
                                        </Button>
                                        {(role.name !== 'Admin' && role.name !== 'User' && role.name !== 'Company') && (
                                             <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleShowDeleteModal(role)}
                                                title="Xóa"
                                            >
                                                <FaTrash />
                                            </Button>
                                        )}

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                 ) : (
                    <Alert variant="info">Không có vai trò nào để hiển thị.</Alert>
                 )
            )}

            <CreateRoleModal
                show={showCreateModal}
                handleClose={handleCloseCreateModal}
                refreshRoles={fetchRoles}
            />
            <UpdateRoleModal
                show={showUpdateModal}
                handleClose={handleCloseUpdateModal}
                roleToUpdate={roleToUpdate}
                refreshRoles={fetchRoles}
            />
             <DeleteRoleModal
                show={showDeleteModal}
                handleClose={handleCloseDeleteModal}
                roleToDelete={roleToDelete}
                refreshRoles={fetchRoles}
            />
        </Container>
    );
}

export default ManageRoles;