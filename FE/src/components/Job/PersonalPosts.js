import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import JobDetail from "./JobDetail";
import CreateJobModal from "../User/CreateJobModal";
import { useAuth } from "../../provider/AuthProvider";
import { getCompanyIdByUser } from "../../services/UserService";
import { getAllJobsByCompanyId } from "../../services/CompanyService";
import { JobContext } from "../context/JobContext";

function PersonalPosts() {
    var [jobs, setJobs] = useState([])
    var [selectedJob, setSelectedJob] = useState(null);
    var [showCreateJobModal, setshowCreateJobModal] = useState(false);
    var { auth } = useAuth();
    var [reload, setReload] = useState(false);
    var getJobs = async () => {
        try {
            var company = await getCompanyIdByUser();
            var response = await getAllJobsByCompanyId(company.data._id);
            setJobs(response.data);
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getJobs()
    }, [reload])
    const reloadJobs = () => setReload(prev => !prev);
    return (
        <>
            <JobContext.Provider value={{ reloadJobs }}>
                {auth.role === "Company" &&
                    <div>
                        <button
                            className="btn btn-success my-3"
                            onClick={() => setshowCreateJobModal(true)}
                        >
                            CreateJob

                        </button >
                        <CreateJobModal
                            show={showCreateJobModal}
                            handleClose={() => {
                                setshowCreateJobModal(false)
                                reloadJobs()
                            }}
                        ></CreateJobModal>
                    </div >
                }

                <Row >
                    {/* Cột bên trái: Danh sách công việc */}
                    <Col md={6}>
                        {jobs.map((job, index) => (
                            <div key={index} className="mt-2">
                                <Card style={{ width: '100%' }}>
                                    <Card.Body>
                                        <Card.Title>{job.title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{job.companyId.companyName}</Card.Subtitle>
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
                                <JobDetail
                                    jobId={selectedJob._id}
                                    reloadChange={reload}
                                />
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
            </JobContext.Provider>
        </>
    )
}
export default PersonalPosts