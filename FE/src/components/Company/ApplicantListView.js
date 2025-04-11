// src/components/Company/ApplicantListView.js
import React, { useState, useEffect, useCallback } from 'react';
import { ListGroup, Card, Spinner, Alert, Button, Image } from 'react-bootstrap';
import { FaEnvelope, FaUser, FaFilePdf } from 'react-icons/fa';
// Giả định bạn đã tạo hàm này trong CompanyService.js
import { getJobApplicants } from '../../services/CompanyService';
import { toast } from 'react-toastify';

/**
 * Component để hiển thị danh sách ứng viên cho một công việc cụ thể.
 * @param {object} props - Props của component.
 * @param {string} props.jobId - ID của công việc cần hiển thị ứng viên.
 */
function ApplicantListView({ jobId }) {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Hàm gọi API để lấy danh sách ứng viên.
     * Sử dụng useCallback để tránh tạo lại hàm này mỗi lần render trừ khi jobId thay đổi.
     */
    const fetchApplicants = useCallback(async () => {
        // Nếu không có jobId, không fetch và reset state
        if (!jobId) {
            setApplicants([]);
            setLoading(false);
            setError(null); // Cũng reset lỗi nếu jobId bị xóa
            return;
        }

        setLoading(true); // Bắt đầu loading
        setError(null); // Reset lỗi trước khi fetch

        try {
            // Gọi hàm service đã tạo trong CompanyService.js
            const response = await getJobApplicants(jobId);

            // Xử lý cấu trúc response trả về từ API
            let applicantData = [];
            // Kiểm tra các cấu trúc phổ biến mà API có thể trả về
            if (response && response.data && Array.isArray(response.data.applicants)) {
                // Cấu trúc: { success: true, data: { ..., applicants: [...] }, message: "..." }
                applicantData = response.data.applicants;
            } else if (response && Array.isArray(response.applicants)) {
                 // Cấu trúc: { success: true, applicants: [...], message: "..." } (Ít phổ biến hơn)
                 applicantData = response.applicants;
            } else if (Array.isArray(response)) {
                 // Cấu trúc: API chỉ trả về trực tiếp mảng [...] (Hiếm khi)
                 applicantData = response;
            } else if (response && response.data && Array.isArray(response.data)){
                // Cấu trúc: { success: true, data: [...], message: "..."} - Nếu data là mảng applicants trực tiếp
                applicantData = response.data;
            }
            else {
                 // Nếu không khớp cấu trúc nào hoặc response không hợp lệ
                 console.warn("Cấu trúc response không mong đợi từ API getJobApplicants:", response);
                 throw new Error("Dữ liệu ứng viên trả về không đúng định dạng.");
            }

            // Cập nhật state với dữ liệu ứng viên
            setApplicants(applicantData);

        } catch (err) {
            // Xử lý lỗi khi gọi API
            console.error(`Lỗi khi tải ứng viên cho công việc ${jobId}:`, err);
            // Lấy thông báo lỗi từ response hoặc thông báo mặc định
            const errorMsg = err.response?.data?.message || err.message || "Không thể tải danh sách ứng viên.";
            setError(errorMsg); // Lưu lỗi vào state
            toast.error(`Lỗi: ${errorMsg}`); // Hiển thị thông báo lỗi cho người dùng
            setApplicants([]); // Reset danh sách ứng viên về rỗng khi có lỗi
        } finally {
            // Kết thúc loading dù thành công hay thất bại
            setLoading(false);
        }
    }, [jobId]); // Dependency là jobId, fetch lại khi jobId thay đổi

    /**
     * Sử dụng useEffect để gọi hàm fetchApplicants khi component được mount
     * hoặc khi hàm fetchApplicants (thực chất là khi jobId) thay đổi.
     */
    useEffect(() => {
        fetchApplicants();
    }, [fetchApplicants]);

    // --- Render Trạng Thái Loading ---
    if (loading) {
        return (
            <div className="text-center my-4 p-3 border rounded bg-light">
                <Spinner animation="border" size="sm" variant="primary" className="me-2" />
                <span className="text-muted">Đang tải danh sách ứng viên...</span>
            </div>
        );
    }

    // --- Render Trạng Thái Lỗi ---
    if (error) {
        return <Alert variant="danger" className="mt-3"><strong>Lỗi:</strong> {error}</Alert>;
    }

    // --- Render Khi Không Có Ứng Viên ---
    if (applicants.length === 0) {
        return (
            <Alert variant="secondary" className="mt-3 text-center">
                Hiện chưa có ứng viên nào ứng tuyển cho công việc này.
            </Alert>
        );
    }

    // --- Render Danh Sách Ứng Viên ---
    return (
        <Card className="mt-3 shadow-sm">
            <Card.Header as="h6" className="bg-light">Danh sách ứng viên ({applicants.length})</Card.Header>
            <ListGroup variant="flush" style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Thêm scroll nếu danh sách quá dài */}
                {applicants.map((applicant) => (
                    <ListGroup.Item
                        key={applicant._id}
                        className="d-flex flex-column flex-md-row justify-content-between align-items-md-center"
                    >
                        {/* Thông tin ứng viên */}
                        <div className="me-md-3 mb-2 mb-md-0 flex-grow-1">
                            <div className="d-flex align-items-center mb-1">
                                <Image
                                    src={applicant.avatarUrl || '/default-avatar.png'} // Sử dụng ảnh mặc định nếu không có avatar
                                    roundedCircle
                                    width={35}
                                    height={35}
                                    className="me-2 border"
                                    alt={`Avatar of ${applicant.username}`}
                                    // Xử lý lỗi nếu ảnh không load được
                                    onError={(e) => { e.target.onerror = null; e.target.src="/default-avatar.png" }}
                                />
                                <div>
                                    <strong className="d-block">{applicant.username || 'N/A'}</strong>
                                    <small className="text-muted">
                                        <FaEnvelope className="me-1" />{applicant.email || 'N/A'}
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Nút xem CV */}
                        <div className="flex-shrink-0 text-center text-md-end">
                            {applicant.cvFile ? (
                                <Button
                                    variant="outline-info" // Màu xanh dương nhẹ nhàng hơn
                                    size="sm"
                                    href={applicant.cvFile}
                                    target="_blank" // Mở link CV trong tab mới
                                    rel="noopener noreferrer" // Quan trọng cho bảo mật và SEO khi dùng target="_blank"
                                    title={`Xem CV của ${applicant.username}`} // Thêm tooltip
                                >
                                    <FaFilePdf className="me-1" /> Xem CV
                                </Button>
                            ) : (
                                <span className="text-muted small fst-italic">Không có CV</span>
                            )}
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
}

export default ApplicantListView;