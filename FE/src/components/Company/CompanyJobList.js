import React, { useEffect, useState, useCallback } from "react";
import { Container, Badge, Button, Card, Col, Row, Spinner, Alert, Stack } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaEye, FaUsers } from 'react-icons/fa';
import JobDetail from "../Job/JobDetail";
import CreateJobModal from "../User/CreateJobModal";
import UpdateJobModal from "../User/UpdateJobModal";
import DeleteJobModal from "../User/DeleteJobModal";
import { getCompanyIdByUser } from "../../services/UserService";
import { getAllJobsByCompanyId } from "../../services/CompanyService";
import { JobContext } from "../context/JobContext";
import ApplicantListView from './ApplicantListView';
import { toast } from "react-toastify";
import { format } from 'date-fns';

function CompanyJobList() {
    const [jobs, setJobs] = useState([]);
    const [companyId, setCompanyId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJobForDetail, setSelectedJobForDetail] = useState(null);
    const [jobToEdit, setJobToEdit] = useState(null);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchCompanyId = async () => {
            try {
                const response = await getCompanyIdByUser();
                if (response.data?._id) {
                    setCompanyId(response.data._id);
                } else {
                    throw new Error("Không tìm thấy thông tin công ty cho người dùng này.");
                }
            } catch (err) {
                console.error("Lỗi khi lấy Company ID:", err);
                setError(err.message || "Không thể xác định công ty.");
                setLoading(false);
            }
        };
        fetchCompanyId();
    }, []);

    const fetchJobs = useCallback(async () => {
        if (!companyId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await getAllJobsByCompanyId(companyId);
            const activeJobs = (response.data || []).filter(job => !job.isDeleted);
            const sortedJobs = activeJobs.sort((a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );
            setJobs(sortedJobs);

            if (selectedJobForDetail && !sortedJobs.some(job => job._id === selectedJobForDetail._id)) {
                setSelectedJobForDetail(null);
            }

        } catch (err) {
            console.error("Lỗi khi tải danh sách công việc:", err);
            const errorMsg = err.response?.data?.message || err.message || "Không thể tải danh sách bài đăng.";
            setError(errorMsg);
            toast.error(`Tải bài đăng thất bại: ${errorMsg}`);
            setJobs([]);
            setSelectedJobForDetail(null);
        } finally {
            setLoading(false);
        }
    }, [companyId, selectedJobForDetail]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs, reload]);

    const reloadJobsList = () => setReload(prev => !prev);

    const handleShowCreate = () => setShowCreateModal(true);
    const handleCloseCreate = () => {
        setShowCreateModal(false);
        reloadJobsList();
    };

    const handleShowUpdate = (job) => {
        setJobToEdit(job);
        setShowUpdateModal(true);
    };
    const handleCloseUpdate = () => {
        setShowUpdateModal(false);
        setJobToEdit(null);
        reloadJobsList();
    };

    const handleShowDelete = (job) => {
        setJobToDelete(job);
        setShowDeleteModal(true);
    };
    const handleCloseDelete = () => {
        const deletedId = jobToDelete?._id;
        setShowDeleteModal(false);
        setJobToDelete(null);
        reloadJobsList();
        if (selectedJobForDetail?._id === deletedId) {
            setSelectedJobForDetail(null);
        }
    };

    const handleSelectJob = (job) => {
         setSelectedJobForDetail(job);
    }

    const jobContextValue = { reloadJobs: reloadJobsList };

    return (
        <JobContext.Provider value={jobContextValue}>
            <Container fluid className="mt-4">
                <Row className="mb-3 align-items-center">
                    <Col>
                        <h2>Quản lý bài đăng tuyển dụng</h2>
                    </Col>
                    <Col xs="auto">
                        <Button variant="primary" onClick={handleShowCreate}>
                            + Tạo bài đăng mới
                        </Button>
                    </Col>
                </Row>

                {loading && (
                     <div className="text-center my-5">
                         <Spinner animation="border" variant="primary" />
                         <p className="mt-2 text-muted">Đang tải bài đăng...</p>
                    </div>
                 )}
                {error && !loading && <Alert variant="danger"><strong>Lỗi:</strong> {error}</Alert>}

                {!loading && !error && (
                    <Row>
                        <Col md={5} lg={4} style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', paddingRight: '15px' }}> {/* Giới hạn chiều cao và cho phép scroll */}
                            {jobs.length > 0 ? jobs.map((job) => (
                                <Card
                                    key={job._id}
                                    className={`mb-2 shadow-sm ${selectedJobForDetail?._id === job._id ? 'border-primary border-2' : 'border'}`} // Highlight job đang chọn
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSelectJob(job)}
                                >
                                    <Card.Body className="p-2">
                                        <Stack gap={1}>
                                            <Card.Title as="h6" className="mb-1 text-primary">{job.title}</Card.Title>
                                            <Card.Subtitle className="mb-1 text-muted small">
                                                {job.location || 'N/A'}
                                                <Badge
                                                    bg={job.status === 'approved' ? 'success' : job.status === 'rejected' ? 'danger' : 'warning'}
                                                    className="ms-2 float-end"
                                                >
                                                    {job.status || 'pending'}
                                                </Badge>
                                            </Card.Subtitle>
                                            <div className="small text-muted">
                                                Ngày tạo: {job.createdAt ? format(new Date(job.createdAt), 'dd/MM/yyyy') : 'N/A'}
                                            </div>
                                            {job.applicants && (
                                                <div className="small text-info">
                                                    <FaUsers className="me-1" /> {job.applicants.length} ứng viên
                                                </div>
                                            )}
                                        </Stack>
                                    </Card.Body>
                                    <Card.Footer className="text-end bg-light p-1">
                                        <Button variant="outline-warning" size="sm" className="me-1 py-0 px-1" title="Chỉnh sửa" onClick={(e) => { e.stopPropagation(); handleShowUpdate(job); }}>
                                            <FaEdit />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" className="py-0 px-1" title="Xóa" onClick={(e) => { e.stopPropagation(); handleShowDelete(job); }}>
                                            <FaTrashAlt />
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            )) : (
                                <Alert variant="info">Bạn chưa đăng bài tuyển dụng nào.</Alert>
                            )}
                        </Col>

                        <Col md={7} lg={8} style={{ position: 'sticky', top: '80px', height: 'calc(100vh - 90px)', overflowY: 'auto' }}>
                            {selectedJobForDetail ? (
                                <div>
                                    <JobDetail
                                        key={`detail-${selectedJobForDetail._id}`}
                                        jobId={selectedJobForDetail._id}
                                        isPersonal={false}
                                    />
                                    <ApplicantListView
                                         key={`applicants-${selectedJobForDetail._id}`}
                                         jobId={selectedJobForDetail._id}
                                     />
                                </div>
                            ) : (
                                !loading && jobs.length > 0 ? (
                                    <Card className="h-100 d-flex justify-content-center align-items-center bg-light border-dashed">
                                        <Card.Body className="text-center text-muted">
                                            <FaEye size="2em" className="mb-2" />
                                            <p>Chọn một bài đăng từ danh sách bên trái để xem chi tiết và danh sách ứng viên.</p>
                                        </Card.Body>
                                    </Card>
                                ) : null
                            )}
                        </Col>
                    </Row>
                )}

                <CreateJobModal show={showCreateModal} handleClose={handleCloseCreate} />
                {jobToEdit && <UpdateJobModal show={showUpdateModal} handleClose={handleCloseUpdate} job={jobToEdit} />}
                {jobToDelete && <DeleteJobModal show={showDeleteModal} handleClose={handleCloseDelete} id={jobToDelete._id} />}

            </Container>
        </JobContext.Provider>
    );
}

export default CompanyJobList;