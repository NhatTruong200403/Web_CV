import { useEffect, useState } from "react";
import { geAllJobs } from "../../services/JobService";
import mockJobs from "../../mockData/mockJobs";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import JobDetail from "./JobDetail";

function JobList() {
    var [jobs, setJobs] = useState([])
    var [selectedJob, setSelectedJob] = useState(null);
    var getJobs = async () => {
        setJobs(mockJobs);
    }
    useEffect(() => {
        getJobs()
    }, [])
    return (
        <>
            <Row >
                {/* Cột bên trái: Danh sách công việc */}
                <Col md={6}>
                    {jobs.map((job, index) => (
                        <div key={index} className="mt-2">
                            <Card style={{ width: '100%' }}>
                                <Card.Body>
                                    <Card.Title>{job.title}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{job.companyId}</Card.Subtitle>
                                    <Card.Subtitle className="mb-2 text-muted">{job.location}</Card.Subtitle>
                                    {Object.keys(job.salary).length > 0 && (
                                        job.salary.negotiable ? (
                                            <Badge bg="secondary">
                                                {job.salary.min} - {job.salary.max} VNĐ a month
                                            </Badge>
                                        ) : (
                                            <Badge bg="secondary">From {job.salary.fixed} VNĐ a month</Badge>
                                        )
                                    )}
                                    {job.details.map((detail, i) => (
                                        <Card.Text key={i}>{detail}</Card.Text>
                                    ))}
                                    <Button variant="primary" onClick={() => setSelectedJob(job)}>
                                        Detail
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </Col>

                <Col md={6} className="mt-2"
                    style={{ position: 'sticky', top: '20px', height: 'calc(100vh - 20px)', overflowY: 'auto' }}>
                    {
                        selectedJob ? (
                            <JobDetail job={selectedJob} />
                        ) : (
                            <Card className="text-center p-4">
                                <Card.Body>
                                    <Card.Title>Chọn một công việc để xem chi tiết</Card.Title>
                                </Card.Body>
                            </Card >
                        )
                    }
                </Col >
            </Row >
        </>
    )
}
export default JobList