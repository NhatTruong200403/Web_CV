// src/components/Admin/CreateRoleModal.js
import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { createRole } from '../../services/RoleService'; // Import service
import { toast } from 'react-toastify';

function CreateRoleModal({ show, handleClose, refreshRoles }) {
    const [roleName, setRoleName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (event) => {
        setRoleName(event.target.value);
        if (error) setError(''); // Xóa lỗi khi người dùng bắt đầu nhập lại
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!roleName.trim()) {
            setError('Tên vai trò không được để trống.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            await createRole({ name: roleName });
            toast.success('Tạo vai trò thành công!');
            refreshRoles(); // Gọi hàm để tải lại danh sách roles ở component cha
            handleModalClose(); // Đóng modal sau khi thành công
        } catch (err) {
            console.error("Error creating role:", err);
            const errorMsg = err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi tạo vai trò.';
             if (err.response?.status === 409) { // Conflict - Role name exists
                setError('Tên vai trò này đã tồn tại.');
             } else {
                setError(errorMsg); // Hiển thị lỗi chung
             }
            toast.error(`Tạo vai trò thất bại: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setRoleName(''); // Reset state khi đóng modal
        setError('');
        setIsSubmitting(false);
        handleClose(); // Gọi hàm đóng modal từ props
    };

    return (
        <Modal show={show} onHide={handleModalClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Tạo Vai Trò Mới</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3" controlId="formRoleName">
                        <Form.Label>Tên Vai Trò</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên vai trò (ví dụ: Editor, Viewer)"
                            value={roleName}
                            onChange={handleInputChange}
                            isInvalid={!!error && error !== 'Tên vai trò này đã tồn tại.'} // Đánh dấu lỗi nếu không phải lỗi trùng tên
                            isValid={!error && roleName.trim() !== ''}
                            required
                            autoFocus
                        />
                        <Form.Control.Feedback type="invalid">
                           {error && error !== 'Tên vai trò này đã tồn tại.' ? error : 'Tên vai trò là bắt buộc.'}
                        </Form.Control.Feedback>
                         {error === 'Tên vai trò này đã tồn tại.' && <div className="text-danger small mt-1">{error}</div>}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting || !roleName.trim()}>
                        {isSubmitting ? 'Đang lưu...' : 'Lưu Vai Trò'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default CreateRoleModal;