import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import {
    getAllPositionTypes,
    createPositionType,
    updatePositionType,
    deletePositionType,
} from '../../services/PositionType'; // Adjust the path as necessary
import CreatePositionTypeModal from './CreatePositionTypeModal';
import UpdatePositionTypeModal from './UpdatePositionTypeModal';
import DeletePositionTypeModal from './DeletePositionTypeModal';
import { toast } from 'react-toastify';

function ManagePositionTypes() {
    const [positionTypes, setPositionTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // State to pass data to Modals
    const [positionTypeToUpdate, setPositionTypeToUpdate] = useState(null);
    const [positionTypeToDelete, setPositionTypeToDelete] = useState(null);

    // Fetch position types
    const fetchPositionTypes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllPositionTypes();
            setPositionTypes(response.data || []);
        } catch (err) {
            console.error('Error fetching position types:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to load position types.';
            setError(errorMsg);
            toast.error(`Error: ${errorMsg}`);
            setPositionTypes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPositionTypes();
    }, [fetchPositionTypes]);

    // Modal Handlers
    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);

    const handleShowUpdateModal = (positionType) => {
        setPositionTypeToUpdate(positionType);
        setShowUpdateModal(true);
    };
    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setPositionTypeToUpdate(null);
    };

    const handleShowDeleteModal = (positionType) => {
        setPositionTypeToDelete(positionType);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setPositionTypeToDelete(null);
    };

    return (
        <Container fluid className="mt-4">
            <Row className="mb-3 align-items-center">
                <Col>
                    <h2>Manage Position Types</h2>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" onClick={handleShowCreateModal}>
                        <FaPlus className="me-1" /> Add New
                    </Button>
                </Col>
            </Row>

            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p>Loading position types...</p>
                </div>
            )}

            {error && !loading && <Alert variant="danger">Error: {error}</Alert>}

            {!loading && !error && (
                positionTypes.length > 0 ? (
                    <Table striped bordered hover responsive size="sm">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {positionTypes.map((positionType, index) => (
                                <tr key={positionType._id}>
                                    <td>{index + 1}</td>
                                    <td>{positionType._id}</td>
                                    <td>{positionType.name}</td>
                                    <td>{positionType.description || 'N/A'}</td>
                                    <td>
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleShowUpdateModal(positionType)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleShowDeleteModal(positionType)}
                                            title="Delete"
                                        >
                                            <FaTrashAlt />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <Alert variant="info">No position types found.</Alert>
                )
            )}

            {/* Modals */}
            <CreatePositionTypeModal
                show={showCreateModal}
                handleClose={handleCloseCreateModal}
                refreshPositionTypes={fetchPositionTypes}
            />
            <UpdatePositionTypeModal
                show={showUpdateModal}
                handleClose={handleCloseUpdateModal}
                positionTypeToUpdate={positionTypeToUpdate}
                refreshPositionTypes={fetchPositionTypes}
            />
            <DeletePositionTypeModal
                show={showDeleteModal}
                handleClose={handleCloseDeleteModal}
                positionTypeToDelete={positionTypeToDelete}
                refreshPositionTypes={fetchPositionTypes}
            />
        </Container>
    );
}

export default ManagePositionTypes;