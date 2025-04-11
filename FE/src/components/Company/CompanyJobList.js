// src/components/Company/CompanyJobList.js
import React, { useEffect, useState, useCallback } from "react";
import { Container, Badge, Button, Card, Col, Row, Spinner, Alert, Stack } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaEye, FaUsers } from 'react-icons/fa'; // Thêm FaUsers nếu muốn
import JobDetail from "../Job/JobDetail";
import CreateJobModal from "../User/CreateJobModal";
import UpdateJobModal from "../User/UpdateJobModal";
import DeleteJobModal from "../User/DeleteJobModal";
// import { useAuth } from "../../provider/AuthProvider"; // Không cần dùng trực tiếp ở đây
import { getCompanyIdByUser } from "../../services/UserService";
import { getAllJobsByCompanyId } from "../../services/CompanyService";
import { JobContext } from "../context/JobContext"; // Đã sửa lại useJobContext
import ApplicantListView from './ApplicantListView'; // <<-- Import component mới
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
    const [reload, setReload] = useState(false); // State để trigger fetch lại jobs

    // 1. Fetch Company ID của user đang đăng nhập
    useEffect(() => {
        const fetchCompanyId = async () => {
            // Không cần setLoading(true) ở đây vì fetchJobs sẽ làm
            try {
                const response = await getCompanyIdByUser();
                if (response.data?._id) {
                    setCompanyId(response.data._id);
                } else {
                    // Nếu không tìm thấy company ID, coi như lỗi và dừng lại
                    throw new Error("Không tìm thấy thông tin công ty cho người dùng này.");
                }
            } catch (err) {
                console.error("Lỗi khi lấy Company ID:", err);
                setError(err.message || "Không thể xác định công ty.");
                setLoading(false); // Dừng loading nếu lỗi ngay từ đầu
            }
        };
        fetchCompanyId();
    }, []); // Chỉ chạy 1 lần khi component mount

    // 2. Fetch Jobs của công ty đó, chỉ chạy khi companyId đã có
    const fetchJobs = useCallback(async () => {
        // Chỉ fetch khi có companyId
        if (!companyId) {
            setLoading(false); // Đảm bảo loading tắt nếu chưa có companyId
            return;
        }

        setLoading(true); // Bắt đầu loading jobs
        setError(null); // Reset lỗi trước khi fetch

        try {
            const response = await getAllJobsByCompanyId(companyId);
            // Lọc bỏ các job đã bị đánh dấu isDeleted (nếu có trường này)
            const activeJobs = (response.data || []).filter(job => !job.isDeleted);
            // Sắp xếp theo ngày tạo mới nhất lên đầu
            const sortedJobs = activeJobs.sort((a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );
            setJobs(sortedJobs);

            // Nếu job đang chọn bị xóa hoặc không còn trong danh sách mới, bỏ chọn nó
            if (selectedJobForDetail && !sortedJobs.some(job => job._id === selectedJobForDetail._id)) {
                setSelectedJobForDetail(null);
            }

        } catch (err) {
            console.error("Lỗi khi tải danh sách công việc:", err);
            const errorMsg = err.response?.data?.message || err.message || "Không thể tải danh sách bài đăng.";
            setError(errorMsg);
            toast.error(`Tải bài đăng thất bại: ${errorMsg}`);
            setJobs([]); // Reset jobs về rỗng nếu có lỗi
            setSelectedJobForDetail(null); // Bỏ chọn job nếu có lỗi
        } finally {
            setLoading(false); // Kết thúc loading
        }
    }, [companyId, selectedJobForDetail]); // Thêm selectedJobForDetail vào dependencies để xử lý trường hợp job bị xóa

    // Gọi fetchJobs khi companyId thay đổi hoặc khi reload=true
    useEffect(() => {
        fetchJobs();
    }, [fetchJobs, reload]); // Dependency là fetchJobs (thay đổi khi companyId đổi) và state `reload`

    // Hàm để trigger reload lại danh sách jobs từ các modal
    const reloadJobsList = () => setReload(prev => !prev);

    // --- Xử lý đóng/mở Modals ---
    const handleShowCreate = () => setShowCreateModal(true);
    const handleCloseCreate = () => {
        setShowCreateModal(false);
        reloadJobsList(); // Reload lại list sau khi tạo
    };

    const handleShowUpdate = (job) => {
        setJobToEdit(job);
        setShowUpdateModal(true);
    };
    const handleCloseUpdate = () => {
        setShowUpdateModal(false);
        setJobToEdit(null);
        reloadJobsList(); // Reload lại list sau khi cập nhật
    };

    const handleShowDelete = (job) => {
        setJobToDelete(job);
        setShowDeleteModal(true);
    };
    const handleCloseDelete = () => {
        const deletedId = jobToDelete?._id; // Lưu lại ID job vừa xóa
        setShowDeleteModal(false);
        setJobToDelete(null);
        reloadJobsList(); // Reload lại list sau khi xóa
        // Nếu job đang hiển thị chi tiết bị xóa, thì bỏ chọn nó
        if (selectedJobForDetail?._id === deletedId) {
            setSelectedJobForDetail(null);
        }
    };

    // --- Hàm chọn Job để xem chi tiết ---
    const handleSelectJob = (job) => {
         setSelectedJobForDetail(job);
    }

    // --- Cung cấp context cho các modal con ---
    const jobContextValue = { reloadJobs: reloadJobsList };

    // --- Render ---
    return (
        <JobContext.Provider value={jobContextValue}>
            <Container fluid className="mt-4">
                {/* --- Header và Nút Tạo Mới --- */}
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

                {/* --- Loading và Error States --- */}
                {loading && (
                     <div className="text-center my-5">
                         <Spinner animation="border" variant="primary" />
                         <p className="mt-2 text-muted">Đang tải bài đăng...</p>
                    </div>
                 )}
                {error && !loading && <Alert variant="danger"><strong>Lỗi:</strong> {error}</Alert>}

                {/* --- Layout Chính (Danh sách và Chi tiết) --- */}
                {!loading && !error && (
                    <Row>
                        {/* --- Cột Danh Sách Jobs --- */}
                        <Col md={5} lg={4} style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', paddingRight: '15px' }}> {/* Giới hạn chiều cao và cho phép scroll */}
                            {jobs.length > 0 ? jobs.map((job) => (
                                <Card
                                    key={job._id}
                                    className={`mb-2 shadow-sm ${selectedJobForDetail?._id === job._id ? 'border-primary border-2' : 'border'}`} // Highlight job đang chọn
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSelectJob(job)} // Chọn job khi click vào card
                                >
                                    <Card.Body className="p-2"> {/* Giảm padding */}
                                        <Stack gap={1}>
                                            <Card.Title as="h6" className="mb-1 text-primary">{job.title}</Card.Title>
                                            <Card.Subtitle className="mb-1 text-muted small">
                                                {job.location || 'N/A'}
                                                {/* Badge trạng thái */}
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
                                            {/* Thêm số lượng ứng viên nếu có */}
                                            {job.applicants && (
                                                <div className="small text-info">
                                                    <FaUsers className="me-1" /> {job.applicants.length} ứng viên
                                                </div>
                                            )}
                                        </Stack>
                                    </Card.Body>
                                    {/* --- Footer với các nút Actions --- */}
                                    <Card.Footer className="text-end bg-light p-1"> {/* Giảm padding */}
                                        {/* Nút Xem (có thể dùng lại click trên card) */}
                                        {/* <Button variant="outline-info" size="sm" className="me-1 py-0 px-1" title="Xem chi tiết" onClick={() => handleSelectJob(job)}> <FaEye /> </Button> */}
                                        <Button variant="outline-warning" size="sm" className="me-1 py-0 px-1" title="Chỉnh sửa" onClick={(e) => { e.stopPropagation(); handleShowUpdate(job); }}> {/* Ngăn click lan ra card */}
                                            <FaEdit />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" className="py-0 px-1" title="Xóa" onClick={(e) => { e.stopPropagation(); handleShowDelete(job); }}> {/* Ngăn click lan ra card */}
                                            <FaTrashAlt />
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            )) : (
                                // Thông báo khi không có job nào
                                <Alert variant="info">Bạn chưa đăng bài tuyển dụng nào.</Alert>
                            )}
                        </Col>

                        {/* --- Cột Chi Tiết Job và Danh sách Ứng Viên --- */}
                        <Col md={7} lg={8} style={{ position: 'sticky', top: '80px', height: 'calc(100vh - 90px)', overflowY: 'auto' }}> {/* Cho phép scroll nội bộ cột này */}
                            {selectedJobForDetail ? (
                                <div> {/* Bọc JobDetail và ApplicantListView */}
                                    {/* Component Chi Tiết Job */}
                                    <JobDetail
                                        key={`detail-${selectedJobForDetail._id}`} // Key thay đổi khi job đổi
                                        jobId={selectedJobForDetail._id}
                                        isPersonal={false} // Luôn là false trong view này của Company
                                    />
                                    {/* Component Danh Sách Ứng Viên */}
                                    <ApplicantListView
                                         key={`applicants-${selectedJobForDetail._id}`} // Key thay đổi khi job đổi
                                         jobId={selectedJobForDetail._id}
                                     />
                                </div>
                            ) : (
                                // Placeholder khi chưa chọn job nào (và có job trong danh sách)
                                !loading && jobs.length > 0 ? (
                                    <Card className="h-100 d-flex justify-content-center align-items-center bg-light border-dashed">
                                        <Card.Body className="text-center text-muted">
                                            <FaEye size="2em" className="mb-2" />
                                            <p>Chọn một bài đăng từ danh sách bên trái để xem chi tiết và danh sách ứng viên.</p>
                                        </Card.Body>
                                    </Card>
                                ) : null // Không hiển thị gì nếu đang loading hoặc không có job nào
                            )}
                        </Col>
                    </Row>
                )}

                {/* --- Modals --- */}
                <CreateJobModal show={showCreateModal} handleClose={handleCloseCreate} />
                {/* Chỉ render Update/Delete Modal khi có job tương ứng được chọn */}
                {jobToEdit && <UpdateJobModal show={showUpdateModal} handleClose={handleCloseUpdate} job={jobToEdit} />}
                {jobToDelete && <DeleteJobModal show={showDeleteModal} handleClose={handleCloseDelete} id={jobToDelete._id} />}

            </Container>
        </JobContext.Provider>
    );
}

export default CompanyJobList;