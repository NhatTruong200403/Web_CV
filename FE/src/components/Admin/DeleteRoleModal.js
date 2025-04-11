import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { deleteRole } from '../../services/RoleService';
import { toast } from 'react-toastify';

function DeleteRoleModal({ show, handleClose, roleToDelete, refreshRoles }) {
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!roleToDelete) return;

        setIsDeleting(true);
        setError('');
        try {
            await deleteRole(roleToDelete._id);
            toast.success(`Đã xóa vai trò "${roleToDelete.name}" thành công!`);
            refreshRoles();
            handleModalClose();
        } catch (err) {
             console.error("Error deleting role:", err);
             const errorMsg = err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi xóa vai trò.';
             setError(errorMsg);
             toast.error(`Xóa vai trò thất bại: ${errorMsg}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleModalClose = () => {
        setError('');
        setIsDeleting(false);
        handleClose();
    };

    if (!roleToDelete) return null;

    return (
        <Modal show={show} onHide={handleModalClose} centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Xác Nhận Xóa Vai Trò</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <p>Bạn có chắc chắn muốn xóa vai trò <strong>"{roleToDelete.name}"</strong> (ID: {roleToDelete._id}) không?</p>
                <p className="text-danger">Hành động này không thể hoàn tác.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose} disabled={isDeleting}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Đang xóa...' : 'Xóa Vai Trò'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteRoleModal;