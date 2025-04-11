import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaBriefcase, FaTags, FaUserShield } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function AdminDashboard({ children }) {

    const stats = {
        users: 150,
        jobs: 35,
        roles: 4,
        jobTypes: 8,
    };

    return (
        <Container fluid>
             <h2 className="mb-4">Admin Dashboard</h2>

             {/* Thẻ thống kê */ }
             <Row className="mb-4">
                 {/* Thẻ Roles */}
                <Col md={6} lg={3} className="mb-3">
                     <Card bg="primary" text="white" as={Link} to="/admin/roles" style={{ textDecoration: 'none' }}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                 <Card.Title as="h5">{stats.roles}</Card.Title>
                                 <Card.Text>Vai trò</Card.Text>
                            </div>
                             <FaUserShield size="2em" />
                        </Card.Body>
                     </Card>
                </Col>

                {/* Thẻ Job Postings */}
                <Col md={6} lg={3} className="mb-3">
                     <Card bg="success" text="white" as={Link} to="/admin/jobs" style={{ textDecoration: 'none' }}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                             <div>
                                 <Card.Title as="h5">{stats.jobs}</Card.Title>
                                 <Card.Text>Bài đăng</Card.Text>
                             </div>
                            <FaBriefcase size="2em" />
                        </Card.Body>
                     </Card>
                </Col>

                 {/* Thẻ Job Types */}
                <Col md={6} lg={3} className="mb-3">
                     <Card bg="warning" text="dark" as={Link} to="/admin/job-types" style={{ textDecoration: 'none' }}>
                         <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                 <Card.Title as="h5">{stats.jobTypes}</Card.Title>
                                 <Card.Text>Loại CV</Card.Text>
                             </div>
                             <FaTags size="2em" />
                         </Card.Body>
                     </Card>
                </Col>

            </Row>
             {children && <div className="mt-4">{children}</div>}

             {!children &&
                 <Card>
                     <Card.Body>
                         <Card.Text>Chào mừng đến trang quản trị!</Card.Text>
                     </Card.Body>
                 </Card>
             }

        </Container>
    );
}

export default AdminDashboard;