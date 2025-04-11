import React from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/AuthProvider';
import { FaSignOutAlt, FaUsersCog, FaHome, FaBriefcase, FaTags } from 'react-icons/fa';

function AdminHeader() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Navbar expand="lg" bg="dark" variant="dark" sticky="top" className="shadow-sm">
            <Container fluid>
                <Navbar.Brand as={NavLink} to="/admin/home" className="fw-bold">
                     Admin Panel
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="admin-navbar-nav" />
                <Navbar.Collapse id="admin-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/admin/roles">
                            <FaUsersCog className="me-1" /> Quản Lý Roles
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/admin/jobs">
                            <FaBriefcase className="me-1" /> Quản Lý Bài Đăng
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/admin/job-types">
                            <FaTags className="me-1" /> Quản Lý Loại CV
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/admin/position-types">
                            <FaTags className="me-1" /> Quản Lý Loại Vị Trí
                        </Nav.Link>
                    </Nav>
                    {/* Nút Logout */}
                    <Nav className="ms-auto">
                         <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt className="me-1" /> Đăng xuất
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AdminHeader;