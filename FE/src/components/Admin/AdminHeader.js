// src/components/Admin/AdminHeader.js
import React from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap'; // Thêm Button
import { NavLink, useNavigate } from 'react-router-dom'; // Thêm NavLink, useNavigate
import { useAuth } from '../../provider/AuthProvider';
import { FaSignOutAlt, FaUsersCog, FaHome, FaBriefcase, FaTags } from 'react-icons/fa';

function AdminHeader() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/"); // Chuyển về trang chủ sau khi logout
    };

    return (
        // Sử dụng variant và bg khác để phân biệt với Header thường
        <Navbar expand="lg" bg="dark" variant="dark" sticky="top" className="shadow-sm">
            <Container fluid> {/* Sử dụng fluid để rộng hơn */}
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
                        {/* Thêm các link admin khác */}
                         {/* <Nav.Link as={NavLink} to="/admin/users">Quản Lý Users</Nav.Link> */}
                         {/* <Nav.Link as={NavLink} to="/admin/jobs">Quản Lý Jobs</Nav.Link> */}
                    </Nav>
                    {/* Nút Logout */}
                    <Nav className="ms-auto">
                         <Button
                            variant="outline-danger" // Màu khác để nổi bật
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