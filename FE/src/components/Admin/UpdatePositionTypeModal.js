import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { updatePositionType } from '../../services/PositionType';
import { toast } from 'react-toastify';

function UpdatePositionTypeModal({ show, handleClose, positionTypeToUpdate, refreshPositionTypes }) {
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [initialData, setInitialData] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (positionTypeToUpdate) {
            const data = {
                name: positionTypeToUpdate.name || '',
                description: positionTypeToUpdate.description || '',
            };
            setFormData(data);
            setInitialData(data);
            setError('');
        }
    }, [positionTypeToUpdate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name.trim()) {
            setError('Name is required.');
            return;
        }

        if (formData.name.trim() === initialData.name && formData.description === initialData.description) {
            handleModalClose();
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await updatePositionType(positionTypeToUpdate._id, formData);
            toast.success('Position type updated successfully!');
            refreshPositionTypes();
            handleModalClose();
        } catch (err) {
            console.error('Error updating position type:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to update position type.';
            if (err.response?.status === 409 || errorMsg.includes('already exists')) {
                setError('Position type with this name already exists.');
            } else {
                setError(errorMsg);
            }
            toast.error(`Update failed: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setError('');
        setIsSubmitting(false);
        handleClose();
    };

    if (!positionTypeToUpdate) return null;

    return (
        <Modal show={show} onHide={handleModalClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Update Position Type</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3" controlId="updatePositionTypeName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="e.g., Manager, Developer"
                            value={formData.name}
                            onChange={handleInputChange}
                            isInvalid={!!error}
                            required
                            autoFocus
                        />
                        <Form.Control.Feedback type="invalid">
                            {error || 'Name is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="updatePositionTypeDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            rows={2}
                            placeholder="Short description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <small className="text-muted">ID: {positionTypeToUpdate._id}</small>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={
                            isSubmitting ||
                            !formData.name.trim() ||
                            (formData.name.trim() === initialData.name && formData.description === initialData.description)
                        }
                    >
                        {isSubmitting ? 'Saving...' : 'Update'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default UpdatePositionTypeModal;