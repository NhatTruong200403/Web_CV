// src/components/User/UserApplications.js
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Alert, Spinner, Card, Badge, Row, Col, Stack } from 'react-bootstrap';
import { getUserApplies } from '../../services/UserService';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaDollarSign, FaRegListAlt, FaRegFileAlt, FaCheckSquare } from "react-icons/fa";

// Helper function renderListItems (giữ nguyên)
const renderListItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        return <span className="text-muted small fst-italic">N/A</span>;
    }
    return (
        <ul className="list-unstyled mb-0 small">
            {items.map((item, index) => (
                <li key={index} className="mb-1"> - {item}</li>
            ))}
        </ul>
    );
};

function UserApplications() {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAppliedJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        // Không reset appliedJobs ở đây vội

        try {
            const userResponse = await getUserApplies();
            const jobObjects = userResponse.data?.appliJobs || []; // Lấy mảng job từ API

            if (!Array.isArray(jobObjects)) {
                 console.error("API /users/applies did not return an array in appliJobs:", userResponse.data);
                 throw new Error("Dữ liệu ứng tuyển không hợp lệ.");
            }

            // --- BƯỚC SỬA LỖI: Lọc bỏ các job trùng lặp dựa trên _id ---
            const uniqueJobObjects = Array.from(new Map(jobObjects.map(job => [job._id, job])).values());
            // Giải thích:
            // 1. jobObjects.map(job => [job._id, job]): Tạo một mảng các cặp [id, job object].
            // 2. new Map(...): Tạo một Map từ mảng cặp trên. Map tự động loại bỏ các key (ở đây là _id) trùng lặp, chỉ giữ lại entry cuối cùng cho mỗi key.
            // 3. .values(): Lấy tất cả các value (job object) từ Map.
            // 4. Array.from(...): Chuyển các value đó thành một mảng mới chứa các job object duy nhất.

            if (jobObjects.length !== uniqueJobObjects.length) {
                 console.warn("Detected and removed duplicate jobs from applied list."); // Log cảnh báo nếu phát hiện trùng lặp
            }

            // Cập nhật state với mảng job đã được lọc duy nhất
            setAppliedJobs(uniqueJobObjects);
            // --- KẾT THÚC BƯỚC SỬA LỖI ---

        } catch (err) {
            console.error("Error fetching user applications:", err);
            const errorMsg = err.response?.data?.message || err.message || "Không thể tải danh sách việc làm đã ứng tuyển.";
            setError(errorMsg);
            toast.error(`Lỗi: ${errorMsg}`);
            setAppliedJobs([]); // Reset về rỗng nếu có lỗi
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppliedJobs();
    }, [fetchAppliedJobs]);

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Việc làm đã ứng tuyển</h2>

            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status"><span className="visually-hidden">Đang tải...</span></Spinner>
                </div>
            )}

            {error && !loading && (
                <Alert variant="danger"><strong>Lỗi:</strong> {error}</Alert>
            )}

            {!loading && !error && (
                appliedJobs.length > 0 ? (
                    // Phần map để render danh sách (giữ nguyên)
                    <Row xs={1} md={1} lg={1} className="g-4">
                        {appliedJobs.map((job) => {
                            // --- Destructure dữ liệu từ job object ---
                            const {
                                _id, // Key sẽ được lấy từ đây
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

                            return (
                                // Sử dụng _id duy nhất làm key
                                <Col key={_id}>
                                    <Card className="shadow-sm h-100">
                                        {/* Card.Header */}
                                        <Card.Header className="bg-light border-bottom p-3">
                                            <Stack gap={1}>
                                                <Card.Title as="h5" className="mb-1">{title}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted small">
                                                    {companyId?.companyName || "N/A"}
                                                </Card.Subtitle>
                                                <div className='small'>
                                                    <FaMapMarkerAlt className="me-2 text-secondary" />{location}
                                                </div>
                                            </Stack>
                                        </Card.Header>

                                        {/* Card.Body */}
                                        <Card.Body className="text-start p-3">
                                            {/* Badges */}
                                            <Stack direction="horizontal" gap={2} className="flex-wrap mb-3 pb-2 border-bottom">
                                                {jobType?.name && <div className='small'><FaBriefcase className="me-1 text-primary" /><Badge bg="info">{jobType.name}</Badge></div>}
                                                {degree && <div className='small'><FaGraduationCap className="me-1 text-primary" /><Badge bg="secondary">{degree}</Badge></div>}
                                                {hasSalaryInfo && (
                                                    <div className='small'>
                                                        <FaDollarSign className="me-1 text-success" />
                                                        {salary.negotiable ? (
                                                            <Badge bg="success">
                                                                {salary.min || '?'} - {salary.max || '?'} VNĐ (Thỏa thuận)
                                                            </Badge>
                                                        ) : (
                                                            <Badge bg="success">
                                                                {salary.fixed ? `Từ ${salary.fixed} VNĐ` : 'Thương lượng'}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </Stack>

                                            {/* Details */}
                                            {details.length > 0 && (
                                                <div className="mb-3">
                                                    <h6 className="mb-1 fw-bold small"><FaRegFileAlt className="me-2 text-info" />Chi tiết</h6>
                                                    {renderListItems(details)}
                                                </div>
                                            )}

                                            {/* Descriptions */}
                                            {descriptions.length > 0 && (
                                                <div className="mb-3">
                                                    <h6 className="mb-1 fw-bold small"><FaRegListAlt className="me-2 text-info" />Mô tả công việc</h6>
                                                    {renderListItems(descriptions)}
                                                </div>
                                            )}

                                            {/* Requirements */}
                                            {requirements.length > 0 && (
                                                <div className="mb-3">
                                                    <h6 className="mb-1 fw-bold small"><FaCheckSquare className="me-2 text-info" />Yêu cầu</h6>
                                                    {renderListItems(requirements)}
                                                </div>
                                            )}

                                            {/* Benefits */}
                                            {benefits.length > 0 && (
                                                <div className="mb-2">
                                                    <h6 className="mb-1 fw-bold small"><FaCheckSquare className="me-2 text-info" />Quyền lợi</h6>
                                                    {renderListItems(benefits)}
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                ) : (
                    <Alert variant="info" className="text-center">Bạn chưa ứng tuyển vào công việc nào.</Alert>
                )
            )}
        </Container>
    );
}

export default UserApplications;