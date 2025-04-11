// src/components/Admin/UpdateRoleModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { updateRole } from '../../services/RoleService';
import { toast } from 'react-toastify';

function UpdateRoleModal({ show, handleClose, roleToUpdate, refreshRoles }) {
    const [roleName, setRoleName] = useState('');
    const [initialRoleName, setInitialRoleName] = useState(''); 
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (roleToUpdate) {
            setRoleName(roleToUpdate.name);
            setInitialRoleName(roleToUpdate.name);
            setError(''); // Reset lỗi khi mở modal
        }
    }, [roleToUpdate]);

    const handleInputChange = (event) => {
        setRoleName(event.target.value);
        if (error) setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!roleName.trim()) {
            setError('Tên vai trò không được để trống.');
            return;
        }
        if (roleName.trim() === initialRoleName) {
            handleModalClose();
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await updateRole(roleToUpdate._id, { name: roleName });
            toast.success('Cập nhật vai trò thành công!');
            refreshRoles();
            handleModalClose();
        } catch (err) {
            console.error("Error updating role:", err);
             const errorMsg = err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi cập nhật vai trò.';
             if (err.response?.status === 409) { 
                setError('Tên vai trò này đã tồn tại.');
             } else {
                setError(errorMsg);
             }
            toast.error(`Cập nhật vai trò thất bại: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setError('');
        setIsSubmitting(false);
        handleClose();
    };

    if (!roleToUpdate) return null;

    return (
        <Modal show={show} onHide={handleModalClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Cập Nhật Vai Trò</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3" controlId="formUpdateRoleName">
                        <Form.Label>Tên Vai Trò</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên vai trò"
                            value={roleName}
                            onChange={handleInputChange}
                            isInvalid={!!error && error !== 'Tên vai trò này đã tồn tại.'}
                            isValid={!error && roleName.trim() !== ''}
                            required
                            autoFocus
                        />
                         <Form.Control.Feedback type="invalid">
                           {error && error !== 'Tên vai trò này đã tồn tại.' ? error : 'Tên vai trò là bắt buộc.'}
                        </Form.Control.Feedback>
                         {error === 'Tên vai trò này đã tồn tại.' && <div className="text-danger small mt-1">{error}</div>}
                    </Form.Group>
                    <small className="text-muted">ID: {roleToUpdate._id}</small>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting || !roleName.trim() || roleName.trim() === initialRoleName}
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default UpdateRoleModal;