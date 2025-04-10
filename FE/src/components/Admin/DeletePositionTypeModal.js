import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { deletePositionType } from '../../services/PositionType'; // Adjust the path
import { toast } from 'react-toastify';

function DeletePositionTypeModal({ show, handleClose, positionTypeToDelete, refreshPositionTypes }) {
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!positionTypeToDelete) return;

        setIsDeleting(true);
        setError('');
        try {
            await deletePositionType(positionTypeToDelete._id);
            toast.success(`Position type "${positionTypeToDelete.name}" deleted successfully!`);
            refreshPositionTypes();
            handleModalClose();
        } catch (err) {
            console.error('Error deleting position type:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to delete position type.';
            setError(errorMsg);
            toast.error(`Delete failed: ${errorMsg}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleModalClose = () => {
        setError('');
        setIsDeleting(false);
        handleClose();
    };

    if (!positionTypeToDelete) return null;

    return (
        <Modal show={show} onHide={handleModalClose} centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <p>Are you sure you want to delete position type:</p>
                <p>
                    <strong>{positionTypeToDelete.name}</strong>
                </p>
                {positionTypeToDelete.description && <p className="text-muted small">{positionTypeToDelete.description}</p>}
                <p className="text-danger mt-3">This action cannot be undone.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose} disabled={isDeleting}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeletePositionTypeModal;