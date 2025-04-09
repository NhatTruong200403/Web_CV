// src/components/Admin/ManageUsers.js
import React, { useState, useEffect, useCallback } from 'react';
// Add Button, Modal, FaTrashAlt
import { Container, Table, Spinner, Alert, Button, Modal } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa'; // Import icon
import axios from '../../services/custom-axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { deleteUser } from '../../services/UserService'; // Import the delete function

const getAllAdminUsers = () => {
    return axios.get('/users');
};

// New Delete Confirmation Modal Component (can be in the same file or separate)
function DeleteUserModal({ show, handleClose, userToDelete, refreshUsers }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await deleteUser(userToDelete._id);
            toast.success(`User "${userToDelete.username}" deleted successfully!`);
            refreshUsers(); // Refresh the user list
            handleClose(); // Close the modal
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error(err.response?.data?.message || 'Failed to delete user.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete user{' '}
                <strong>{userToDelete?.username}</strong> (ID: {userToDelete?._id})?
                This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isDeleting}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete User'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}


function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // State for delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = useCallback(async () => {
        // ... (fetchUsers logic remains the same)
        setLoading(true);
        setError(null);
        try {
            const response = await getAllAdminUsers();
            setUsers(response.data || []);
        } catch (err) {
            console.error("Error fetching users:", err);
            const errorMsg = err.response?.data?.message || err.message || "Failed to load users.";
            setError(errorMsg);
            toast.error(`Error: ${errorMsg}`);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Handlers for delete modal
    const handleShowDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };


    if (loading) return <div className="text-center"><Spinner animation="border" /> <p>Loading users...</p></div>;
    if (error) return <Alert variant="danger"><strong>Error:</strong> {error}</Alert>;

    return (
        <Container fluid className="mt-4">
            <h2>Manage Users</h2>
            {users.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created At</th>
                            <th>Actions</th> {/* Add Actions column */}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user._id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role?.name || 'N/A'}</td>
                                <td>
                                    {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                                </td>
                                <td>
                                    {/* Add Delete Button - Prevent deleting Admins? */}
                                    {user.role?.name !== 'Admin' && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleShowDeleteModal(user)}
                                            title="Delete User"
                                        >
                                            <FaTrashAlt />
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant="info">No users found.</Alert>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteUserModal
                show={showDeleteModal}
                handleClose={handleCloseDeleteModal}
                userToDelete={userToDelete}
                refreshUsers={fetchUsers} // Pass fetchUsers to refresh list after delete
            />
        </Container>
    );
}

export default ManageUsers;