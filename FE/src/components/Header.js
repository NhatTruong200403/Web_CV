import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import UpCompanyModal from './User/UpCompanyModal';
import { Link } from 'react-router-dom';

function Header() {
    var [showRegisterModal, setShowMRegisterModal] = useState(false)
    var [showLoginModal, setshowLoginModal] = useState(false);
    var [showUpCompanyModal, setshowUpCompanyModal] = useState(false);
    var [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);
    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
    };
    return (
        <Navbar expand="lg" className="bg-success navbar-dark">
            <Container>
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/">Home</Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown>

                    </Nav>

                    <Nav className="ms-auto">
                        {!isLoggedIn ? (
                            <>
                                <div>
                                    <button
                                        className="btn btn-success my-3"
                                        onClick={() => setshowLoginModal(true)}
                                    >
                                        Login

                                    </button >
                                    <LoginModal
                                        show={showLoginModal}
                                        handleClose={() => setshowLoginModal(false)}
                                    ></LoginModal>
                                </div >
                                <div>
                                    <button
                                        className="btn btn-success my-3"
                                        onClick={() => setShowMRegisterModal(true)}
                                    >
                                        Register

                                    </button >
                                    <RegisterModal
                                        show={showRegisterModal}
                                        handleClose={() => setShowMRegisterModal(false)}
                                    ></RegisterModal>
                                </div >
                            </>
                        ) : (
                            <>
                                <div>
                                    <button
                                        className="btn btn-success my-3"
                                        onClick={() => setshowUpCompanyModal(true)}
                                    >
                                        Up Company

                                    </button >
                                    <UpCompanyModal
                                        show={showUpCompanyModal}
                                        handleClose={() => setshowUpCompanyModal(false)}
                                    ></UpCompanyModal>
                                </div >
                                <div>
                                    <button
                                        className="btn btn-error my-3"
                                        onClick={handleLogout}
                                    >
                                        Logout

                                    </button >
                                </div >
                            </>
                        )}

                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;