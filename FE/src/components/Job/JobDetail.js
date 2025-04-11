import React, { useEffect, useState } from 'react';
import { Card, Badge, Stack, Button, Spinner, Alert } from "react-bootstrap";
import { FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaDollarSign, FaRegListAlt, FaRegFileAlt, FaCheckSquare, FaExternalLinkAlt, FaBookmark, FaCheckCircle } from "react-icons/fa"; // Thêm FaCheckCircle
import { getJobById, applyJob } from '../../services/JobService';
import { getUserApplies } from '../../services/UserService';
import UpdateJobModal from '../User/UpdateJobModal';
import DeleteJobModal from '../User/DeleteJobModal';
import ApplyConfirmModal from './ApplyConfirmModal';
import { toast } from 'react-toastify';
import { useAuth } from '../../provider/AuthProvider';

const renderListItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        return <p className="text-muted fst-italic">N/A</p>;
    }
    return (
        <ul className="list-unstyled mb-0">
            {items.map((item, index) => (
                <li key={index} className="mb-1"> - {item}</li>
            ))}
        </ul>
    );
};

function JobDetail({ jobId, isPersonal }) { 
    const [job, setJob] = useState({});
    const [loadingJob, setLoadingJob] = useState(true);
    const [showUpdateJobModal, setShowUpdateJobModal] = useState(false);
    const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);
    const [showApplyConfirmModal, setShowApplyConfirmModal] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [applyError, setApplyError] = useState('');
    const { auth } = useAuth();
    const [appliedJobIds, setAppliedJobIds] = useState([]); 
    const [loadingAppliedJobs, setLoadingAppliedJobs] = useState(true);

    const fetchJobDetails = async () => {
        if (!jobId) return;
        setLoadingJob(true);
        try {
            const response = await getJobById(jobId);
            setJob(response.data || {});
        } catch (error) {
            console.error("Error fetching job details:", error);
            setJob({});
            toast.error("Không thể tải chi tiết công việc.");
        } finally {
            setLoadingJob(false);
        }
    };

    const fetchAppliedJobs = async () => {
        if (auth.role !== 'User') { 
            setLoadingAppliedJobs(false);
            return;
        }
        setLoadingAppliedJobs(true);
        try {
            const response = await getUserApplies();
            setAppliedJobIds(response.data?.appliJobs || []);
        } catch (error) {
            console.error("Error fetching applied jobs:", error);
            setAppliedJobIds([]);
        } finally {
            setLoadingAppliedJobs(false);
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, [jobId]);

    useEffect(() => {
        fetchAppliedJobs();
    }, [auth.token]);

    // --- Xử lý Apply ---
    const handleShowApplyConfirm = () => {
        if (auth.role !== 'User') {
            toast.warn('Chỉ người dùng mới có thể ứng tuyển.');
            return;
        }
        setApplyError('');
        setShowApplyConfirmModal(true);
    };

    const handleConfirmApply = async () => {
        if (!job?._id) return;
        setIsApplying(true);
        setApplyError('');
        try {
            await applyJob(job._id);
            toast.success(`Ứng tuyển thành công vào vị trí "${job.title}"!`);
            setShowApplyConfirmModal(false);
            fetchAppliedJobs();
        } catch (err) {
            console.error("Error applying for job:", err);
            const errorMsg = err.response?.data?.message || 'Ứng tuyển thất bại. Vui lòng thử lại.';
            setApplyError(errorMsg);
            toast.error(`Ứng tuyển thất bại: ${errorMsg}`);
        } finally {
            setIsApplying(false);
        }
    };

    const handleCloseApplyConfirm = () => {
        setShowApplyConfirmModal(false);
    };

    // --- Loading States ---
    if (loadingJob || loadingAppliedJobs) {
        return (
            <Card className="text-center p-5 shadow-sm w-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
            </Card>
        );
    }
    if (!job?._id) {
        return (
            <Card className="text-center p-5 shadow-sm w-100">
                <Alert variant='warning'>Không tìm thấy thông tin công việc.</Alert>
            </Card>
        );
    }

    const {
        title = "N/A",
        companyId = {},
        details = [],
        benefits = [],
        descriptions = [],
        requirements = [],
        location = "N/A",
        degree = "N/A",
        salary = {},
        jobType = {},
    } = job;

    const hasSalaryInfo = salary && (salary.min || salary.max || salary.fixed);
    const hasApplied = appliedJobIds.includes(job._id);

    const scrollableBodyStyle = {
        maxHeight: 'calc(100vh - 250px)',
        overflowY: 'auto',
        paddingRight: '15px'
    };

    return (
        <>
            <Card className="mb-3 job-posting-card shadow-sm w-100 d-flex flex-column h-100">  
                <Card.Header className="bg-light border-bottom p-3">
                     <Stack gap={1}>
                        <Card.Title as="h4" className="mb-1">{title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            {companyId?.companyName || "N/A"}
                        </Card.Subtitle>
                        <div>
                            <FaMapMarkerAlt className="me-2 text-secondary" />{location}
                        </div>
                    </Stack>
                </Card.Header>
                <Card.Body className="text-start p-3 flex-grow-1" style={scrollableBodyStyle}>
                      <Stack direction="horizontal" gap={3} className="flex-wrap mb-4 pb-3 border-bottom">
                        <div>
                            <FaBriefcase className="me-2 text-primary" />
                            <strong>Type:</strong> <Badge bg="info">{jobType?.name || "N/A"}</Badge>
                        </div>
                        <div>
                            <FaGraduationCap className="me-2 text-primary" />
                            <strong>Degree:</strong> <Badge bg="secondary">{degree}</Badge>
                        </div>
                        {hasSalaryInfo && (
                            <div>
                                <FaDollarSign className="me-2 text-success" />
                                <strong>Salary:</strong>
                                {salary.negotiable ? (
                                    <Badge bg="success">
                                        {salary.min || '?'} - {salary.max || '?'} VNĐ / month (Negotiable)
                                    </Badge>
                                ) : (
                                    <Badge bg="success">
                                        {salary.fixed ? `From ${salary.fixed} VNĐ / month` : 'Negotiable'}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </Stack>

                    {details.length > 0 && (
                        <div className="mb-4">
                            <h5 className="mb-2"><FaRegFileAlt className="me-2 text-info" />Details</h5>
                            {renderListItems(details)}
                        </div>
                    )}

                    {descriptions.length > 0 && (
                        <div className="mb-4">
                            <h5 className="mb-2"><FaRegListAlt className="me-2 text-info" />Job Description</h5>
                            {renderListItems(descriptions)}
                        </div>
                    )}

                    {requirements.length > 0 && (
                        <div className="mb-4">
                            <h5 className="mb-2"><FaCheckSquare className="me-2 text-info" />Requirements</h5>
                            {renderListItems(requirements)}
                        </div>
                    )}

                     {benefits.length > 0 && (
                         <div className="mb-0">
                            <h5 className="mb-2"><FaCheckSquare className="me-2 text-info" />Benefits</h5>
                             {renderListItems(benefits)}
                         </div>
                    )}
                </Card.Body>

                {/* --- Card.Footer --- */}
                <Card.Footer className="bg-light p-3 text-end mt-auto">
                    {isPersonal && auth.role === 'User' && (
                        <Stack direction="horizontal" gap={2} className="justify-content-end">
                            {hasApplied ? (
                                <Button variant="success" size="sm" disabled>
                                    <FaCheckCircle className="me-1" /> Đã ứng tuyển
                                </Button>
                            ) : (
                                <Button variant="primary" size="sm" onClick={handleShowApplyConfirm}>
                                    <FaExternalLinkAlt className="me-1" /> Apply Now
                                </Button>
                            )}
                        </Stack>
                    )}
                    {!isPersonal && (
                         // ... code nút Update/Delete cho Company/Admin giữ nguyên ...
                         <Stack direction="horizontal" gap={2} className="justify-content-end">
                             <Button
                                 variant="outline-warning"
                                 size="sm"
                                onClick={() => setShowUpdateJobModal(true)}
                            >
                                Update
                            </Button>
                             <Button
                                 variant="outline-danger"
                                 size="sm"
                                 onClick={() => setShowDeleteJobModal(true)}
                            >
                                Delete
                            </Button>
                        </Stack>
                    )}
                </Card.Footer>
            </Card>

            <ApplyConfirmModal
                show={showApplyConfirmModal}
                handleClose={handleCloseApplyConfirm}
                handleConfirm={handleConfirmApply}
                jobTitle={job.title}
                companyName={job.companyId?.companyName}
                isLoading={isApplying}
                error={applyError}
            />
             {!isPersonal && (
                <>
                    <UpdateJobModal
                        show={showUpdateJobModal}
                        handleClose={() => {
                            setShowUpdateJobModal(false);
                            fetchJobDetails();
                        }}
                        job={job}
                    />
                    <DeleteJobModal
                        show={showDeleteJobModal}
                        handleClose={() => {
                            setShowDeleteJobModal(false);
                        }}
                        id={job._id}
                    />
                </>
            )}
        </>
    );
}

export default JobDetail;