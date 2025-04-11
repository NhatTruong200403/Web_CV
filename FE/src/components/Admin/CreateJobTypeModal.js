import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { createJobType } from '../../services/JobTypeService';
import { toast } from 'react-toastify';

function CreateJobTypeModal({ show, handleClose, refreshJobTypes }) {
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);
        setError('');

        try {
            await createJobType(formData);
            toast.success('Tạo loại công việc thành công!');
            refreshJobTypes();
            handleModalClose();
        } catch (err) {
            console.error("Error creating job type:", err);
            const errorMsg = err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi tạo loại công việc.';
             if (err.response?.status === 409 || errorMsg.includes("already exists")) {
                setError('Tên loại công việc này đã tồn tại.');
             } else {
                setError(errorMsg);
             }
            toast.error(`Tạo loại công việc thất bại: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setFormData({ name: '', description: '' });
        setError('');
        setIsSubmitting(false);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleModalClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Tạo Loại Công Việc Mới</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3" controlId="formJobTypeNameCreate"> {/* Đổi ID để tránh trùng lặp nếu có form khác */}
                        <Form.Label>Tên Loại Công Việc</Form.Label>
                        <Form.Control
                            type="text"
                            name="name" // Thêm name attribute
                            placeholder="Ví dụ: Full-time, Part-time, Internship"
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

                    <Form.Group className="mb-3" controlId="formJobTypeDescriptionCreate">
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

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting || !formData.name.trim()}>
                        {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default CreateJobTypeModal;