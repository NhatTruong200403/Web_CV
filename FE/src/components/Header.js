// src/components/Header.js

import React, { useState } from 'react';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
// Icons
import {
    FaSignInAlt, FaUserPlus, FaBuilding, FaPlusCircle, FaSignOutAlt,
    FaUserCircle, FaFileAlt, FaUserEdit, FaListAlt
} from 'react-icons/fa';
// Modals
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import UpCompanyModal from './User/UpCompanyModal';
import CreateJobModal from './User/CreateJobModal';
import { useAuth } from '../provider/AuthProvider';
import './Header.css'; // Import CSS

function Header() {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showUpCompanyModal, setShowUpCompanyModal] = useState(false);
    const [showCreateJobModal, setShowCreateJobModal] = useState(false);
    const navigate = useNavigate();
    const { logout, auth } = useAuth(); // Lấy auth để kiểm tra role và token

    const handleLogout = () => {
        logout();
        navigate("/"); // Chuyển hướng về trang chủ sau khi đăng xuất
    };

    // Hàm đóng tất cả modal
    const closeAllModals = () => {
        setShowRegisterModal(false);
        setShowLoginModal(false);
        setShowUpCompanyModal(false);
        setShowCreateJobModal(false);
    };

    return (
        <>
            <Navbar expand="lg" bg="success" variant="dark" sticky="top" className="shadow-sm">
                <Container>
                    {/* Brand/Logo */}
                    <Navbar.Brand as={NavLink} to="/" className="fw-bold">
                        JobBoard
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Navigation Links */}
                        <Nav className="me-auto">
                            {/* Sử dụng 'end' cho NavLink trang chủ để nó chỉ active khi đúng path '/' */}
                            <Nav.Link as={NavLink} to="/" end>
                                Trang chủ
                            </Nav.Link>
                            {/* Link ví dụ chỉ Company thấy */}
                            {/* {auth.isAuthenticated && auth.role === 'Company' && (
                                <Nav.Link as={NavLink} to="/company/dashboard">
                                    Company Dashboard
                                </Nav.Link>
                            )} */}
                        </Nav>

                        {/* User Authentication / Actions */}
                        <Nav className="ms-auto align-items-center">
                            {!auth.isAuthenticated ? (
                                // --- Chưa đăng nhập ---
                                <>
                                    <Button
                                        variant="outline-light"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => setShowLoginModal(true)}
                                    >
                                        <FaSignInAlt className="me-1" /> Đăng nhập
                                    </Button>
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onClick={() => setShowRegisterModal(true)}
                                    >
                                        <FaUserPlus className="me-1" /> Đăng ký
                                    </Button>
                                </>
                            ) : (
                                // --- Đã đăng nhập ---
                                <NavDropdown
                                    title={<><FaUserCircle className="me-1" /> {auth.role || 'Tài khoản'}</>} // Hiển thị Role hoặc chữ Tài khoản
                                    id="user-nav-dropdown"
                                    align="end" // Căn dropdown sang phải
                                >
                                    {/* Link chung cho User và Company */}
                                    {(auth.role === 'User' || auth.role === 'Company') && (
                                        <>
                                            <NavDropdown.Item as={NavLink} to="/profile">
                                                <FaUserEdit className="me-2" />Thông tin cá nhân
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={NavLink} to="/my-applications">
                                                <FaListAlt className="me-2" />Việc làm đã ứng tuyển
                                            </NavDropdown.Item>
                                        </>
                                    )}


                                    {/* Chỉ User thấy */}
                                    {auth.role === 'User' && (
                                        <NavDropdown.Item onClick={() => setShowUpCompanyModal(true)}>
                                            <FaBuilding className="me-2" /> Đăng ký công ty
                                        </NavDropdown.Item>
                                    )}

                                    {/* Chỉ Company thấy */}
                                    {auth.role === 'Company' && (
                                        <>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item onClick={() => setShowCreateJobModal(true)}>
                                                <FaPlusCircle className="me-2" /> Đăng tin mới
                                            </NavDropdown.Item>
                                            {/* Link đến trang quản lý job của company */}
                                            <NavDropdown.Item as={NavLink} to="/company/jobs">
                                                <FaFileAlt className="me-2" /> Quản lý tin đăng
                                            </NavDropdown.Item>
                                        </>
                                    )}

                                    {/* Tách biệt các mục */}
                                    {(auth.role === 'User' || auth.role === 'Company') && <NavDropdown.Divider />}

                                    {/* Nút đăng xuất */}
                                    <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                        <FaSignOutAlt className="me-2" /> Đăng xuất
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Modals */}
            {/* Render modal dựa trên trạng thái show */}
            <LoginModal show={showLoginModal} handleClose={closeAllModals} />
            <RegisterModal show={showRegisterModal} handleClose={closeAllModals} />
            {/* Chỉ render modal khi user có thể thực hiện hành động đó */}
            {auth.role === 'User' && <UpCompanyModal show={showUpCompanyModal} handleClose={closeAllModals} />}
            {auth.role === 'Company' && <CreateJobModal show={showCreateJobModal} handleClose={closeAllModals} />}
        </>
    );
}

export default Header;