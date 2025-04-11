// src/components/Admin/UpdateJobTypeModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { updateJobType } from '../../services/JobTypeService';
import { toast } from 'react-toastify';

function UpdateJobTypeModal({ show, handleClose, jobTypeToUpdate, refreshJobTypes }) {
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [initialData, setInitialData] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (jobTypeToUpdate) {
            const data = {
                name: jobTypeToUpdate.name || '',
                description: jobTypeToUpdate.description || ''
            };
            setFormData(data);
            setInitialData(data);
            setError('');
        }
    }, [jobTypeToUpdate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name.trim()) {
            setError('Tên loại công việc không được để trống.');
            return;
        }

        if (formData.name.trim() === initialData.name && formData.description === initialData.description) {
            handleModalClose(); 
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await updateJobType(jobTypeToUpdate._id, formData);
            toast.success('Cập nhật loại công việc thành công!');
            refreshJobTypes();
            handleModalClose();
        } catch (err) {
            console.error("Error updating job type:", err);
            const errorMsg = err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi cập nhật.';
             if (err.response?.status === 409 || errorMsg.includes("already exists")) {
                setError('Tên loại công việc này đã tồn tại.');
             } else {
                setError(errorMsg);
             }
            toast.error(`Cập nhật thất bại: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setError('');
        setIsSubmitting(false);
        handleClose();
    };

    if (!jobTypeToUpdate) return null;

    return (
        <Modal show={show} onHide={handleModalClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Cập Nhật Loại Công Việc</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3" controlId="updateJobTypeName">
                        <Form.Label>Tên Loại Công Việc</Form.Label>
                        <Form.Control
                            type="text"
                            name="name" // Thêm name attribute
                            placeholder="Ví dụ: Full-time, Part-time"
                            value={formData.name}
                            onChange={handleInputChange}
                            isInvalid={!!error}
                            required
                            autoFocus
                        />
                         <Form.Control.Feedback type="invalid">
                           {error ? error : 'Tên loại công việc là bắt buộc.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="updateJobTypeDescription">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            rows={2}
                            placeholder="Mô tả ngắn gọn (ví dụ: Làm việc toàn thời gian)"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                     <small className="text-muted">ID: {jobTypeToUpdate._id}</small>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={
                            isSubmitting ||
                            !formData.name.trim() ||
                            (formData.name.trim() === initialData.name && formData.description === initialData.description) // Disable nếu không đổi
                         }
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default UpdateJobTypeModal;