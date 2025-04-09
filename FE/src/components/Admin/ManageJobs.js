// src/components/Admin/ManageJobs.js
import React, { useState, useEffect, useCallback } from 'react';
// Thêm lại Modal, Button
import { Table, Button, Spinner, Alert, Container, Row, Col, Modal } from 'react-bootstrap';
// Thêm lại FaEye
import { FaEye } from 'react-icons/fa';
import { getAllJobs } from '../../services/JobService';
// Thêm lại JobDetail
import JobDetail from '../Job/JobDetail';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function ManageJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Thêm lại state cho Modal chi tiết
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // Hàm fetch jobs giữ nguyên
    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllJobs();
            const activeJobs = (response.data || []).filter(job => !job.isDeleted); // Vẫn chỉ hiện job active
            const sortedJobs = activeJobs.sort((a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );
            setJobs(sortedJobs);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            const errorMsg = err.response?.data?.message || err.message || "Không thể tải danh sách công việc.";
            setError(errorMsg);
            toast.error(`Lỗi: ${errorMsg}`);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch jobs khi mount
    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    // Bỏ useEffect lọc jobs nếu không có search/filter

    // ---- Thêm lại hàm xử lý Modal chi tiết ----
    const handleShowDetail = (job) => {
        setSelectedJob(job);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedJob(null);
    };
    // ---- Kết thúc hàm xử lý Modal ----

    return (
        <Container fluid className="mt-4">
            <Row className="mb-3 align-items-center">
                <Col>
                    <h2>Danh Sách Bài Đăng Tuyển Dụng</h2>
                </Col>
            </Row>

            {/* Loading and Error States */}
            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
                    <p>Đang tải dữ liệu...</p>
                </div>
            )}
            {error && !loading && (
                <Alert variant="danger"><strong>Lỗi:</strong> {error}</Alert>
            )}

            {/* Jobs Table */}
            {!loading && !error && (
                jobs.length > 0 ? (
                    <Table striped bordered hover responsive size="sm"> {/* Thêm lại responsive và size="sm" nếu muốn */}
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Tiêu đề</th>
                                <th>Công ty</th>
                                <th>Địa điểm</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th> {/* Thêm lại cột Hành động */}
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job, index) => (
                                <tr key={job._id}>
                                    <td>{index + 1}</td>
                                    <td>{job.title}</td>
                                    <td>{job.companyId?.companyName || 'N/A'}</td>
                                    <td>{job.location || 'N/A'}</td>
                                    <td>
                                        {job.createdAt ? format(new Date(job.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                                    </td>
                                    {/* Thêm lại cột Hành động */}
                                    <td>
                                        {/* Nút View Detail */}
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            title="Xem chi tiết"
                                            onClick={() => handleShowDetail(job)}
                                        >
                                            <FaEye />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                 ) : (
                     <Alert variant="info">Không có bài đăng nào để hiển thị.</Alert>
                 )
            )}

            {/* Thêm lại Modal Detail */}
             <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi Tiết Công Việc</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedJob && (
                        <JobDetail
                            key={selectedJob._id}
                            jobId={selectedJob._id}
                            isPersonal={false} // Admin view không phải là personal
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetailModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
             {/* Kết thúc Modal Detail */}

        </Container>
    );
}

export default ManageJobs;