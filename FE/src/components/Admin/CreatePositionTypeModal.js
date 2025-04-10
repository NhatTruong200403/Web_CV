import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { createPositionType } from '../../services/PositionType'; // Adjust the path
import { toast } from 'react-toastify';

function CreatePositionTypeModal({ show, handleClose, refreshPositionTypes }) {
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
            setError('Name is required.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            await createPositionType(formData);
            toast.success('Position type created successfully!');
            refreshPositionTypes();
            handleModalClose();
        } catch (err) {
            console.error('Error creating position type:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to create position type.';
            if (err.response?.status === 409 || errorMsg.includes('already exists')) {
                setError('Position type with this name already exists.');
            } else {
                setError(errorMsg);
            }
            toast.error(`Create failed: ${errorMsg}`);
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
                <Modal.Title>Create Position Type</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3" controlId="formPositionTypeNameCreate">
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

                    <Form.Group className="mb-3" controlId="formPositionTypeDescriptionCreate">
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting || !formData.name.trim()}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default CreatePositionTypeModal;