import React, { useEffect, useState, useCallback } from "react";
import { getAllJobs } from "../../services/JobService";
import { Card, Col, Row, Spinner, Alert, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from 'react-icons/fa';
import JobDetail from "./JobDetail";
import CreateJobModal from "../User/CreateJobModal";
import { useAuth } from "../../provider/AuthProvider";
import JobListItem from "./JobListItem"; 
import styles from './JobList.module.css'; 
import { jwtDecode } from "jwt-decode";

function JobList() {
    const [allJobs, setAllJobs] = useState([]); 
    const [filteredJobs, setFilteredJobs] = useState([]); 
    const [selectedJob, setSelectedJob] = useState(null);
    const [showCreateJobModal, setShowCreateJobModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { auth } = useAuth();
    const [reload, setReload] = useState(false); 
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
            setAllJobs(response.data || []); 
            setFilteredJobs(response.data || []); 
            if (response.data && response.data.length > 0) {
            } else {
                setSelectedJob(null);
            }
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setError("Không thể tải danh sách công việc. Vui lòng thử lại sau.");
            setAllJobs([]);
            setFilteredJobs([]);
        } finally {
            setLoading(false);
        }
    }, []); 

    useEffect(() => {
        getJobs();
    }, [reload, getJobs]); 

    useEffect(() => {
        if (!searchTerm) {
            setFilteredJobs(allJobs);
        } else {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const filtered = allJobs.filter(job =>
                job.title?.toLowerCase().includes(lowerCaseSearchTerm) ||
                job.companyId?.companyName?.toLowerCase().includes(lowerCaseSearchTerm) ||
                job.location?.toLowerCase().includes(lowerCaseSearchTerm)
            );
            setFilteredJobs(filtered);
            if (selectedJob && !filtered.some(job => job._id === selectedJob._id)) {
            }
        }
    }, [searchTerm, allJobs, selectedJob]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectJob = (job) => {
        setSelectedJob(job);
    };

    const triggerReload = () => {
        setReload(prev => !prev);
        setSelectedJob(null);
    };

    return (
        <>
            {auth.role === "Company" && (
                <div className="mb-3 text-end">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateJobModal(true)}
                    >
                        + Đăng tin tuyển dụng
                    </button>
                    <CreateJobModal
                        show={showCreateJobModal}
                        handleClose={() => {
                            setShowCreateJobModal(false);
                            triggerReload();
                        }}
                    />
                </div>
            )}

            <Row>
                <Col md={5} lg={4} className={styles.jobListColumn}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <Form.Control
                            placeholder="Tìm kiếm theo tiêu đề, công ty, địa điểm..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>

                    {loading && (
                        <div className="text-center my-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            <p className="mt-2">Đang tải công việc...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <Alert variant="danger">{error}</Alert>
                    )}

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

                <Col md={7} lg={8} className={`mt-2 mt-md-0 ${styles.jobDetailColumn}`} style={{ position: 'sticky', top: '80px', height: 'calc(100vh)' }}>
                    <div className={styles.stickyDetail}>
                        {selectedJob ? (
                            <JobDetail
                                key={selectedJob._id}
                                jobId={selectedJob._id}
                                isPersonal={auth.role !== 'Company' || user._id != selectedJob._id}
                            />
                        ) : (
                            <Card className={`text-center p-5 ${styles.placeholderCard}`}>
                                <Card.Body>
                                    <img src="/placeholder-icon.svg" alt="Select a job" width="100" className="mb-3" />
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