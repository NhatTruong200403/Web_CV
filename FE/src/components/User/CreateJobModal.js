import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getAllJobTypes } from "../../services/JobTypeService";
import { getAllPositionTypes } from "../../services/PositionType";
import { createJob } from "../../services/JobService";
import { getCompanyIdByUser } from "../../services/UserService";

function CreateJobModal(props) {
    var { show, handleClose } = props
    const [formData, setFormData] = useState({
        title: "",
        jobType: "",
        jobApplyPositionId: "",
        details: [""],
        benefits: [""],
        descriptions: [""],
        requirements: [""],
        location: "",
        degree: "",
        salary: {
            min: "",
            max: "",
            fixed: "",
            negotiable: false,
        },
        status: "pending",
    });
    const [jobTypes, setJobTypes] = useState([]);
    const [positionTypes, setPositionTypes] = useState([]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith("salary.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                salary: {
                    ...prev.salary,
                    [key]: type === "checkbox" ? checked : value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        var company = await getCompanyIdByUser();
        console.log(jobTypes)
        console.log(positionTypes)
        const newJob = {
            ...formData,
            companyId: company.data._id,
            jobTypeId: formData.jobType,
            jobApplyPositionId: formData.jobApplyPositionId
        };
        console.log("Submit Job:", newJob);
        var res = await createJob(newJob);
        console.log(res);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobTypesRes = await getAllJobTypes();
                setJobTypes(jobTypesRes.data);
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
                <Modal.Title>Đăng tin tuyển dụng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tiêu đề</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Vị trí ứng tuyển</Form.Label>
                        <Form.Select
                            name="jobApplyPositionId"
                            value={formData.jobApplyPositionId}
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
                            value={formData.jobType}
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
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Bằng cấp</Form.Label>
                        <Form.Control
                            type="text"
                            name="degree"
                            value={formData.degree}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Label className="mt-3">Mức lương</Form.Label>
                    <Form.Group className="mb-3 d-flex gap-2">
                        <Form.Control
                            type="number"
                            name="salary.min"
                            placeholder="Lương tối thiểu"
                            value={formData.salary.min}
                            onChange={handleChange}
                        />
                        <Form.Control
                            type="number"
                            name="salary.max"
                            placeholder="Lương tối đa"
                            value={formData.salary.max}
                            onChange={handleChange}
                        />
                        <Form.Control
                            type="number"
                            name="salary.fixed"
                            placeholder="Lương cố định"
                            value={formData.salary.fixed}
                            onChange={handleChange}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Thỏa thuận"
                            name="salary.negotiable"
                            checked={formData.salary.negotiable}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Chi tiết công việc</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="details"
                            rows={3}
                            value={formData.details[0]}
                            onChange={(e) =>
                                setFormData((prev) => ({
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
                            value={formData.benefits[0]}
                            onChange={(e) =>
                                setFormData((prev) => ({
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
                            value={formData.descriptions[0]}
                            onChange={(e) =>
                                setFormData((prev) => ({
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
                            value={formData.requirements[0]}
                            onChange={(e) =>
                                setFormData((prev) => ({
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
                    Đăng tin
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateJobModal;
