import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { getCompanyIdByUser } from "../../services/UserService";
import { getAllJobTypes } from "../../services/JobTypeService";
import { getAllPositionTypes } from "../../services/PositionType";
import { updateJobInfo } from "../../services/JobService";
import { useJobContext } from "../context/JobContext";

function UpdateJobModal(props) {
    var { show, handleClose, job } = props;
    var { reloadJobs } = useJobContext()
    var [updateJob, setUpdateJob] = useState({
        ...job,
        salary: job?.salary || {
            min: "",
            max: "",
            fixed: "",
            negotiable: false
        },
        details: job?.details || [""],
        benefits: job?.benefits || [""],
        descriptions: job?.descriptions || [""],
        requirements: job?.requirements || [""]
    });
    const [jobTypes, setJobTypes] = useState([]);
    const [positionTypes, setPositionTypes] = useState([]);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith("salary.")) {
            const key = name.split(".")[1];
            setUpdateJob((prev) => ({
                ...prev,
                salary: {
                    ...prev.salary,
                    [key]: type === "checkbox" ? checked : value,
                },
            }));
        } else {
            setUpdateJob((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            var company = await getCompanyIdByUser();
            console.log(jobTypes)
            console.log(positionTypes)
            const newJob = {
                ...updateJob,
                companyId: company.data._id,
                jobTypeId: updateJob.jobType,
                jobApplyPositionId: updateJob.jobApplyPositionId
            };
            console.log("Submit Job:", newJob);
            var res = await updateJobInfo(job._id, newJob);
            console.log(res.data);
            reloadJobs();
            handleClose();
        }
        catch (error) {
            console.log(error);

        }
    };
    useEffect(() => {
        if (job) {
            setUpdateJob({
                ...job,
                title: job.title || "",
                salary: job.salary || {
                    min: "",
                    max: "",
                    fixed: "",
                    negotiable: false,
                },
                details: job.details || [""],
                benefits: job.benefits || [""],
                descriptions: job.descriptions || [""],
                requirements: job.requirements || [""],
                jobType: job.jobType || "",
                jobApplyPositionId: job.jobApplyPositionId || ""
            });
        }
    }, [job]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobTypesRes = await getAllJobTypes();
                setJobTypes(jobTypesRes.data);
                console.log(jobTypesRes.data)
                const positionTypesRes = await getAllPositionTypes();
                setPositionTypes(positionTypesRes.data);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật thông tin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tiêu đề</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={updateJob.title || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Vị trí ứng tuyển</Form.Label>
                        <Form.Select
                            name="jobApplyPositionId"
                            value={updateJob.jobApplyPositionId || ""}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn vị trí --</option>
                            {positionTypes.map((position) => (
                                <option key={position._id} value={position._id}>
                                    {position.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Loại công việc</Form.Label>
                        <Form.Select
                            name="jobType"
                            value={updateJob.jobType}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn loại công việc --</option>
                            {jobTypes.map((job) => (
                                <option key={job._id} value={job._id}>
                                    {job.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Địa điểm</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={updateJob.location}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Bằng cấp</Form.Label>
                        <Form.Control
                            type="text"
                            name="degree"
                            value={updateJob.degree}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Label className="mt-3">Mức lương</Form.Label>
                    <Form.Group className="mb-3 d-flex gap-2">
                        <Form.Control
                            type="number"
                            name="salary.min"
                            placeholder="Lương tối thiểu"
                            value={updateJob.salary.min}
                            onChange={handleChange}
                        />
                        <Form.Control
                            type="number"
                            name="salary.max"
                            placeholder="Lương tối đa"
                            value={updateJob.salary.max}
                            onChange={handleChange}
                        />
                        <Form.Control
                            type="number"
                            name="salary.fixed"
                            placeholder="Lương cố định"
                            value={updateJob.salary.fixed}
                            onChange={handleChange}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Thỏa thuận"
                            name="salary.negotiable"
                            checked={updateJob.salary.negotiable}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Chi tiết công việc</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="details"
                            rows={3}
                            value={updateJob.details?.[0] ?? ""}
                            onChange={(e) =>
                                setUpdateJob((prev) => ({
                                    ...prev,
                                    details: [e.target.value],
                                }))
                            }
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Quyền lợi</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="benefits"
                            rows={3}
                            value={updateJob.benefits?.[0] ?? ""}
                            onChange={(e) =>
                                setUpdateJob((prev) => ({
                                    ...prev,
                                    benefits: [e.target.value],
                                }))
                            }
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="descriptions"
                            rows={3}
                            value={updateJob.descriptions?.[0] ?? ""}
                            onChange={(e) =>
                                setUpdateJob((prev) => ({
                                    ...prev,
                                    descriptions: [e.target.value],
                                }))
                            }
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Yêu cầu</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="requirements"
                            rows={3}
                            value={updateJob.requirements?.[0] ?? ""}
                            onChange={(e) =>
                                setUpdateJob((prev) => ({
                                    ...prev,
                                    requirements: [e.target.value],
                                }))
                            }
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Cập nhật
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateJobModal