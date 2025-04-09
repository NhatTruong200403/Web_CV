import React, { useEffect, useState, useCallback } from "react";
import { getAllJobs } from "../../services/JobService";
import { Card, Col, Row, Spinner, Alert, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from 'react-icons/fa'; // Import icon search
import JobDetail from "./JobDetail";
import CreateJobModal from "../User/CreateJobModal"; // Giữ lại nếu cần
import { useAuth } from "../../provider/AuthProvider";
import JobListItem from "./JobListItem"; // Import component mới
import styles from './JobList.module.css'; // Import CSS Module cho JobList
import { jwtDecode } from "jwt-decode";

function JobList() {
    const [allJobs, setAllJobs] = useState([]); // Danh sách gốc từ API
    const [filteredJobs, setFilteredJobs] = useState([]); // Danh sách hiển thị sau khi lọc
    const [selectedJob, setSelectedJob] = useState(null);
    const [showCreateJobModal, setShowCreateJobModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { auth } = useAuth();
    const [reload, setReload] = useState(false); // State để trigger reload
    const token = localStorage.getItem('token');
    const user = ""
    if (token) {
        user = jwtDecode(token);
    }
    const getJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllJobs();
            setAllJobs(response.data || []); // Đảm bảo là mảng
            setFilteredJobs(response.data || []); // Khởi tạo filteredJobs
            // Tự động chọn job đầu tiên nếu có
            if (response.data && response.data.length > 0) {
                // setSelectedJob(response.data[0]); // Tạm thời bỏ tự chọn
            } else {
                setSelectedJob(null); // Reset nếu không có job
            }
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setError("Không thể tải danh sách công việc. Vui lòng thử lại sau.");
            setAllJobs([]);
            setFilteredJobs([]);
        } finally {
            setLoading(false);
        }
    }, []); // Dependencies rỗng vì chỉ fetch 1 lần hoặc khi reload

    useEffect(() => {
        getJobs();
    }, [reload, getJobs]); // Thêm getJobs vào dependency

    // Lọc công việc khi searchTerm hoặc allJobs thay đổi
    useEffect(() => {
        if (!searchTerm) {
            setFilteredJobs(allJobs);
        } else {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const filtered = allJobs.filter(job =>
                job.title?.toLowerCase().includes(lowerCaseSearchTerm) ||
                job.companyId?.companyName?.toLowerCase().includes(lowerCaseSearchTerm) ||
                job.location?.toLowerCase().includes(lowerCaseSearchTerm)
                // Thêm các trường muốn tìm kiếm khác nếu cần
            );
            setFilteredJobs(filtered);
            // Reset selected job nếu nó không còn trong danh sách lọc
            if (selectedJob && !filtered.some(job => job._id === selectedJob._id)) {
                // setSelectedJob(null); // Tạm thời bỏ reset để giữ job đang xem
            }
        }
    }, [searchTerm, allJobs, selectedJob]); // Thêm selectedJob vào dependency

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectJob = (job) => {
        setSelectedJob(job);
    };

    // Hàm để reload danh sách (ví dụ sau khi tạo job mới)
    const triggerReload = () => {
        setReload(prev => !prev);
        setSelectedJob(null); // Reset lựa chọn khi reload
    };

    return (
        <>
            {/* Nút Create Job (nếu là Company) - có thể đặt ở Header hoặc đây */}
            {auth.role === "Company" && (
                <div className="mb-3 text-end"> {/* Canh lề phải */}
                    <button
                        className="btn btn-primary" // Đổi màu nút
                        onClick={() => setShowCreateJobModal(true)}
                    >
                        + Đăng tin tuyển dụng
                    </button>
                    <CreateJobModal
                        show={showCreateJobModal}
                        handleClose={() => {
                            setShowCreateJobModal(false);
                            triggerReload(); // Reload danh sách sau khi đóng modal
                        }}
                    />
                </div>
            )}

            <Row>
                {/* Cột bên trái: Tìm kiếm và Danh sách công việc */}
                <Col md={5} lg={4} className={styles.jobListColumn}>
                    {/* Thanh tìm kiếm */}
                    <InputGroup className="mb-3">
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <Form.Control
                            placeholder="Tìm kiếm theo tiêu đề, công ty, địa điểm..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>

                    {/* Hiển thị Loading */}
                    {loading && (
                        <div className="text-center my-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            <p className="mt-2">Đang tải công việc...</p>
                        </div>
                    )}

                    {/* Hiển thị Lỗi */}
                    {error && !loading && (
                        <Alert variant="danger">{error}</Alert>
                    )}

                    {/* Hiển thị Danh sách công việc */}
                    {!loading && !error && (
                        <div className={styles.jobListContainer}>
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <JobListItem
                                        key={job._id}
                                        job={job}
                                        onSelectJob={handleSelectJob}
                                        isSelected={selectedJob?._id === job._id}
                                    />
                                ))
                            ) : (
                                <Alert variant="info" className="text-center">Không tìm thấy công việc phù hợp.</Alert>
                            )}
                        </div>
                    )}
                </Col>

                {/* Cột bên phải: Chi tiết công việc */}
                <Col md={7} lg={8} className={`mt-2 mt-md-0 ${styles.jobDetailColumn}`} style={{ position: 'sticky', top: '80px', height: 'calc(100vh)' }}>
                    <div className={styles.stickyDetail}> {/* Wrapper để làm sticky */}
                        {selectedJob ? (
                            <JobDetail
                                key={selectedJob._id} // Thêm key để re-render khi job thay đổi
                                jobId={selectedJob._id}
                                isPersonal={auth.role !== 'Company' || user._id != selectedJob._id} // Ví dụ: Nếu không phải company thì là personal view
                            // reloadChange prop không còn cần thiết nếu JobDetail tự fetch lại khi jobId đổi
                            />
                        ) : (
                            // Placeholder cải tiến khi không có job nào được chọn
                            <Card className={`text-center p-5 ${styles.placeholderCard}`}>
                                <Card.Body>
                                    <img src="/placeholder-icon.svg" alt="Select a job" width="100" className="mb-3" /> {/* Thay bằng icon phù hợp */}
                                    <Card.Title as="h5" className="text-muted">
                                        {loading ? 'Đang tải...' : 'Chọn một công việc để xem chi tiết'}
                                    </Card.Title>
                                    <Card.Text className="text-muted small">
                                        Duyệt danh sách bên trái và nhấp vào một công việc để xem thông tin đầy đủ tại đây.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        )}
                    </div>
                </Col>
            </Row >
        </>
    );
}

export default JobList;