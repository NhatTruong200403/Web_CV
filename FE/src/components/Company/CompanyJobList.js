// src/components/Company/CompanyJobList.js
import React, { useEffect, useState, useCallback } from "react";
// *** Import Container ***
import { Container, Badge, Button, Card, Col, Row, Spinner, Alert, Stack } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import JobDetail from "../Job/JobDetail";
// *** Corrected Paths: Point to ../User/ ***
import CreateJobModal from "../User/CreateJobModal";
import UpdateJobModal from "../User/UpdateJobModal";
import DeleteJobModal from "../User/DeleteJobModal";
import { useAuth } from "../../provider/AuthProvider";
import { getCompanyIdByUser } from "../../services/UserService";
import { getAllJobsByCompanyId } from "../../services/CompanyService";
// *** Make sure JobContext path is correct if used ***
import { JobContext, useJobContext } from "../context/JobContext";
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

    // Modal States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // State for forcing reload
    const [reload, setReload] = useState(false);

    // Get Company ID first
    useEffect(() => {
        const fetchCompanyId = async () => {
            try {
                const response = await getCompanyIdByUser();
                if (response.data?._id) {
                    setCompanyId(response.data._id);
                } else {
                    throw new Error("Company ID not found for this user.");
                }
            } catch (err) {
                console.error("Error fetching company ID:", err);
                setError(err.message || "Could not fetch company identifier.");
                setLoading(false);
            }
        };
        fetchCompanyId();
    }, []); // Runs once on mount

    // Fetch jobs once companyId is available or reload is triggered
    const fetchJobs = useCallback(async () => {
        if (!companyId) return; // Don't fetch if no company ID

        setLoading(true);
        setError(null);
        try {
            const response = await getAllJobsByCompanyId(companyId);
            // Sort jobs by creation date, newest first
            const sortedJobs = (response.data || []).sort((a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );
            setJobs(sortedJobs);

        } catch (err) {
            console.error("Error fetching company jobs:", err);
            setError(err.response?.data?.message || "Could not fetch job postings.");
            toast.error("Failed to load job postings.");
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, [companyId]); // Dependency on companyId

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs, reload]); // Fetch when companyId changes or reload is triggered

    // Handler to trigger reload from child modals
    const reloadJobsList = () => setReload(prev => !prev);

    // Modal handlers
    const handleShowCreate = () => setShowCreateModal(true);
    const handleCloseCreate = () => {
        setShowCreateModal(false);
        reloadJobsList(); // Reload after closing
    };

    const handleShowUpdate = (job) => {
        setJobToEdit(job);
        setShowUpdateModal(true);
    };
    const handleCloseUpdate = () => {
        setShowUpdateModal(false);
        setJobToEdit(null);
        reloadJobsList(); // Reload after closing
    };

    const handleShowDelete = (job) => {
        setJobToDelete(job);
        setShowDeleteModal(true);
    };
    const handleCloseDelete = () => {
        const deletedId = jobToDelete?._id; // Store id before resetting
        setShowDeleteModal(false);
        setJobToDelete(null);
        reloadJobsList(); // Reload after closing
        // If the deleted job was the one being viewed, clear the detail view
        if (selectedJobForDetail?._id === deletedId) {
            setSelectedJobForDetail(null);
        }
    };


    return (
        // Provide context for modals to trigger reload
        <JobContext.Provider value={{ reloadJobs: reloadJobsList }}>
            {/* *** Use the imported Container *** */}
            <Container fluid className="mt-4">
                <Row className="mb-3 align-items-center">
                    <Col>
                        <h2>Bài đăng cá nhân</h2>
                    </Col>
                    <Col xs="auto">
                        <Button variant="primary" onClick={handleShowCreate}>
                            + Tạo bài đăng mới
                        </Button>
                    </Col>
                </Row>

                {loading && <div className="text-center"><Spinner animation="border" /><p>Loading jobs...</p></div>}
                {error && !loading && <Alert variant="danger">{error}</Alert>}

                {!loading && !error && (
                    <Row>
                        {/* Left Column: Job List */}
                        <Col md={5} lg={4} style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                            {jobs.length > 0 ? jobs.map((job) => (
                                <Card
                                    key={job._id}
                                    className={`mb-2 ${selectedJobForDetail?._id === job._id ? 'border-primary shadow-sm' : 'border'}`} // Added shadow for selected
                                    style={{ cursor: 'pointer' }}
                                >
                                    {/* Wrap Card content in Stack for better layout */}
                                    <Stack gap={2}>
                                        <Card.Body onClick={() => setSelectedJobForDetail(job)} className="pb-1"> {/* Reduced bottom padding */}
                                            <Card.Title as="h6" className="mb-1">{job.title}</Card.Title>
                                            <Card.Subtitle className="mb-1 text-muted small">
                                                {job.location || 'N/A'}
                                                <Badge bg={job.status === 'approved' ? 'success' : job.status === 'rejected' ? 'danger' : 'warning'} className="ms-2 float-end">{job.status || 'pending'}</Badge>
                                            </Card.Subtitle>
                                            <div className="small text-muted">
                                                Ngày tạo: {job.createdAt ? format(new Date(job.createdAt), 'dd/MM/yyyy') : 'N/A'}
                                            </div>
                                        </Card.Body>
                                        <Card.Footer className="text-end bg-light pt-1 pb-1"> {/* Reduced padding */}
                                            <Button variant="outline-info" size="sm" className="me-2 py-0 px-1" title="View Details" onClick={() => setSelectedJobForDetail(job)}> {/* Smaller padding */}
                                                <FaEye />
                                            </Button>
                                            <Button variant="outline-warning" size="sm" className="me-2 py-0 px-1" title="Edit" onClick={() => handleShowUpdate(job)}>
                                                <FaEdit />
                                            </Button>
                                            <Button variant="outline-danger" size="sm" className="py-0 px-1" title="Delete" onClick={() => handleShowDelete(job)}>
                                                <FaTrashAlt />
                                            </Button>
                                        </Card.Footer>
                                    </Stack>
                                </Card>
                            )) : (
                                <Alert variant="info">You have not posted any jobs yet.</Alert>
                            )}
                        </Col>

                        {/* Right Column: Job Detail */}
                        <Col md={7} lg={8} style={{ position: 'sticky', top: '80px', height: 'calc(100vh)' }}>
                            {selectedJobForDetail ? (
                                <JobDetail
                                    key={selectedJobForDetail._id} // Re-render on change
                                    jobId={selectedJobForDetail._id}
                                    isPersonal={false} // Company view is not 'personal' user view
                                />
                            ) : (
                                !loading && jobs.length > 0 ? ( // Show placeholder only if not loading and jobs exist
                                    <Card className="h-100 d-flex justify-content-center align-items-center bg-light border-dashed">
                                        <Card.Body className="text-center text-muted">
                                            <FaEye size="2em" className="mb-2" />
                                            <p>Select a job posting from the list to view its details.</p>
                                        </Card.Body>
                                    </Card>
                                ) : null // Don't show placeholder if loading or no jobs
                            )}
                        </Col>
                    </Row>
                )}

                {/* Modals */}
                <CreateJobModal show={showCreateModal} handleClose={handleCloseCreate} />
                {jobToEdit && <UpdateJobModal show={showUpdateModal} handleClose={handleCloseUpdate} job={jobToEdit} />}
                {jobToDelete && <DeleteJobModal show={showDeleteModal} handleClose={handleCloseDelete} id={jobToDelete._id} />}

            </Container> {/* Close Container */}
        </JobContext.Provider>
    );
}

export default CompanyJobList;