import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { deleteJobType } from '../../services/JobTypeService';
import { toast } from 'react-toastify';

function DeleteJobTypeModal({ show, handleClose, jobTypeToDelete, refreshJobTypes }) {
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!jobTypeToDelete) return;

        setIsDeleting(true);
        setError('');
        try {
            await deleteJobType(jobTypeToDelete._id);
            toast.success(`Đã xóa loại công việc "${jobTypeToDelete.name}" thành công!`);
            refreshJobTypes();
            handleModalClose();
        } catch (err) {
             console.error("Error deleting job type:", err);
             const errorMsg = err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi xóa.';
            
             setError(errorMsg);
             toast.error(`Xóa thất bại: ${errorMsg}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleModalClose = () => {
        setError('');
        setIsDeleting(false);
        handleClose();
    };

    if (!jobTypeToDelete) return null;

    return (
        <Modal show={show} onHide={handleModalClose} centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Xác Nhận Xóa Loại Công Việc</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <p>Bạn có chắc chắn muốn xóa loại công việc:</p>
                 <p><strong>{jobTypeToDelete.name}</strong></p>
                 {jobTypeToDelete.description && <p className="text-muted small">{jobTypeToDelete.description}</p>}
                <p className="text-danger mt-3">Hành động này không thể hoàn tác.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose} disabled={isDeleting}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Đang xóa...' : 'Xác nhận Xóa'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteJobTypeModal;