// src/components/User/UserApplications.js
import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner, Card, ListGroup } from 'react-bootstrap';
import { getUserApplies } from '../../services/UserService'; // Assuming you have this service
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function UserApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplies = async () => {
            setLoading(true);
            setError(null);
            try {
                // --- Giả sử API trả về một mảng các đơn ứng tuyển ---
                // Ví dụ cấu trúc một đơn ứng tuyển trong mảng:
                // {
                //     _id: "apply_id_1",
                //     jobId: { _id: "job_id_1", title: "Software Engineer", companyId: { companyName: "Tech Corp" } },
                //     status: "Pending", // Hoặc "Approved", "Rejected"
                //     appliedAt: "2024-04-08T10:00:00.000Z"
                // }
                // ----------------------------------------------------

                // ==> Thay thế dòng này bằng cách gọi API thực tế nếu có <==
                // const response = await getUserApplies();
                // setApplications(response.data || []);

                // --- Dữ liệu mẫu để hiển thị ---
                const mockData = [
                     { _id: "apply_1", jobId: { _id: "job_1", title: "React Developer", companyId: { companyName: "ABC Solutions" } }, status: "Đang chờ", appliedAt: new Date() },
                     { _id: "apply_2", jobId: { _id: "job_2", title: "Backend Engineer", companyId: { companyName: "XYZ Tech" } }, status: "Đã duyệt", appliedAt: new Date(Date.now() - 86400000 * 2) }, // 2 ngày trước
                     { _id: "apply_3", jobId: { _id: "job_3", title: "UI/UX Designer", companyId: { companyName: "Creative Minds" } }, status: "Từ chối", appliedAt: new Date(Date.now() - 86400000 * 5) }, // 5 ngày trước
                 ];
                setApplications(mockData); // Sử dụng dữ liệu mẫu
                 // -------------------------------

            } catch (err) {
                console.error("Error fetching user applications:", err);
                const errorMsg = err.response?.data?.message || "Không thể tải danh sách việc làm đã ứng tuyển.";
                setError(errorMsg);
                toast.error(`Lỗi: ${errorMsg}`);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchApplies();
    }, []);

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'đang chờ': return 'warning';
            case 'đã duyệt': return 'success';
            case 'từ chối': return 'danger';
            default: return 'secondary';
        }
    }

    return (
        <Container>
            <h2 className="mb-4">Việc làm đã ứng tuyển</h2>

            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </Spinner>
                </div>
            )}

            {error && !loading && (
                <Alert variant="danger"><strong>Lỗi:</strong> {error}</Alert>
            )}

            {!loading && !error && (
                applications.length > 0 ? (
                    <Card>
                        <ListGroup variant="flush">
                            {applications.map((app) => (
                                <ListGroup.Item key={app._id} className="d-flex justify-content-between align-items-start flex-wrap">
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">{app.jobId?.title || 'N/A'}</div>
                                        <small className="text-muted">{app.jobId?.companyId?.companyName || 'N/A'}</small>
                                        <br />
                                        <small className="text-muted">
                                            Ngày ứng tuyển: {app.appliedAt ? format(new Date(app.appliedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                                        </small>
                                    </div>
                                    <span className={`badge bg-${getStatusVariant(app.status)} rounded-pill mt-2 mt-md-0`}>
                                        {app.status || 'N/A'}
                                    </span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                ) : (
                    <Alert variant="info">Bạn chưa ứng tuyển vào công việc nào.</Alert>
                )
            )}
        </Container>
    );
}

export default UserApplications;