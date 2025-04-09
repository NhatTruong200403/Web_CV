import React, { useEffect, useState } from 'react';
import { Card, Badge, Stack, Button } from "react-bootstrap";
import { FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaDollarSign, FaRegListAlt, FaRegFileAlt, FaCheckSquare, FaExternalLinkAlt, FaBookmark } from "react-icons/fa";
import { getJobById } from '../../services/JobService';
import UpdateJobModal from '../User/UpdateJobModal';
import DeleteJobModal from '../User/DeleteJobModal';

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

function JobDetail({ jobId, isPersonal, reloadChange }) {
    const [job, setJob] = useState({});
    var [showUpdateJobModal, setShowUpdateJobModal] = useState(false);
    var [showDeleteJobModal, setShowDeleteJobModal] = useState(false);
    const getJob = async () => {
        if (jobId) {
            try {
                const response = await getJobById(jobId);
                setJob(response.data);
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        }

    };
    useEffect(() => {
        getJob();
    }, [jobId]);

    useEffect(() => {
        getJob();
    }, [reloadChange])

    if (!job) {
        return <p className="text-center">Loading job details...</p>;
    }

    const {
        title = "Unknown Title",
        companyId = {},
        details = [],
        benefits = [],
        descriptions = [],
        requirements = [],
        location = "Not specified",
        degree = "Not specified",
        salary = {},
        jobType = {},
    } = job;

    const hasSalaryInfo = salary && Object.keys(salary).length > 0;
    const scrollableBodyStyle = {
        maxHeight: '65vh',
        overflowY: 'auto',
        paddingRight: '15px'
    };

    return (
        <Card className="mb-3 job-posting-card shadow-sm w-100 d-flex flex-column">
            <Card.Header className="bg-light border-bottom p-3">
                <Stack gap={1}>
                    <Card.Title as="h4" className="mb-1">{title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {companyId?.companyName || "Unknown Company"}
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
                                    {salary.min} - {salary.max} VNĐ / month (Negotiable)
                                </Badge>
                            ) : (
                                <Badge bg="success">
                                    From {salary.fixed} VNĐ / month
                                </Badge>
                            )}
                        </div>
                    )}
                </Stack>

                {details.length > 0 && (
                    <div className="mb-4 border-bottom">
                        <h5 className="mb-2"><FaRegFileAlt className="me-2 text-info" />Details</h5>
                        {renderListItems(details)}
                    </div>
                )}

                {descriptions.length > 0 && (
                    <div className="mb-4 border-bottom">
                        <h5 className="mb-2"><FaRegListAlt className="me-2 text-info" />Job Description</h5>
                        {renderListItems(descriptions)}
                    </div>
                )}

                {requirements.length > 0 && (
                    <div className="mb-4 border-bottom">
                        <h5 className="mb-2"><FaCheckSquare className="me-2 text-info" />Requirements</h5>
                        {renderListItems(requirements)}
                    </div>
                )}

                {benefits.length > 0 && (
                    <div className="mb-4 border-bottom">
                        <h5 className="mb-2"><FaCheckSquare className="me-2 text-info" />Benefits</h5>
                        {renderListItems(benefits)}
                    </div>
                )}
            </Card.Body>

            <Card.Footer className="bg-light p-3 text-end mt-auto">
                {isPersonal
                    &&
                    <Stack direction="horizontal" gap={2} className="justify-content-end">
                        <Button variant="outline-secondary" size="sm">
                            <FaBookmark className="me-1" /> Save Job
                        </Button>
                        <Button variant="primary" size="sm">
                            <FaExternalLinkAlt className="me-1" /> Apply Now
                        </Button>
                    </Stack>
                }
                {!isPersonal
                    &&
                    <>
                        <div>
                            <button
                                className="btn btn-success my-3"
                                onClick={() => setShowUpdateJobModal(true)}
                            >
                                Update

                            </button >
                            <UpdateJobModal
                                show={showUpdateJobModal}
                                handleClose={() => {
                                    setShowUpdateJobModal(false)
                                }}
                                job={job}
                            ></UpdateJobModal>
                        </div >
                        <div>
                            <button
                                className="btn btn-success my-3"
                                onClick={() => setShowDeleteJobModal(true)}
                            >
                                Xóa

                            </button >
                            <DeleteJobModal
                                show={showDeleteJobModal}
                                handleClose={() => {
                                    setShowDeleteJobModal(false)
                                }}
                                id={job._id}
                            ></DeleteJobModal>
                        </div >
                    </>
                }
            </Card.Footer>
        </Card>
    );
}

export default JobDetail;
