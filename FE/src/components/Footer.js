// src/components/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import styles from './Footer.module.css'; // Import CSS Module

function Footer() {
    const currentYear = new Date().getFullYear(); // Lấy năm hiện tại

    return (
        <footer className={`bg-light text-center text-lg-start text-muted ${styles.footer}`}>
            {/* Phần social media - có thể bỏ nếu không cần */}
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                <div className="me-5 d-none d-lg-block">
                    <span>Kết nối với chúng tôi trên mạng xã hội:</span>
                </div>
                <div>
                    <a href="#!" className="me-4 text-reset"><FaFacebook /></a>
                    <a href="#!" className="me-4 text-reset"><FaTwitter /></a>
                    <a href="#!" className="me-4 text-reset"><FaLinkedin /></a>
                    <a href="#!" className="me-4 text-reset"><FaGithub /></a>
                </div>
            </section>

            {/* Phần Links - có thể bỏ nếu không cần */}
            <section className="">
                <Container className="text-center text-md-start mt-5">
                    <Row className="mt-3">
                        <Col md="3" lg="4" xl="3" className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                JobBoard Inc.
                            </h6>
                            <p>
                                Nền tảng tìm kiếm việc làm hàng đầu, kết nối nhà tuyển dụng và ứng viên tiềm năng.
                            </p>
                        </Col>

                        <Col md="2" lg="2" xl="2" className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Sản phẩm</h6>
                            <p><a href="#!" className="text-reset">Việc làm IT</a></p>
                            <p><a href="#!" className="text-reset">Việc làm Marketing</a></p>
                            <p><a href="#!" className="text-reset">Việc làm bán thời gian</a></p>
                        </Col>

                        <Col md="3" lg="2" xl="2" className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Liên kết hữu ích</h6>
                            <p><a href="#!" className="text-reset">Câu hỏi thường gặp</a></p>
                            <p><a href="#!" className="text-reset">Trợ giúp</a></p>
                            <p><a href="#!" className="text-reset">Điều khoản sử dụng</a></p>
                        </Col>

                        <Col md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Liên hệ</h6>
                            <p>TP. Hồ Chí Minh, Việt Nam</p>
                            <p>info@jobboard.example.com</p>
                            <p>+ 01 234 567 88</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Phần Copyright */}
            <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                © {currentYear} Bản quyền thuộc về:
                <a className="text-reset fw-bold ms-1" href="/">JobBoard.com</a>
            </div>
        </footer>
    );
}

export default Footer;