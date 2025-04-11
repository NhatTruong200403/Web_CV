import React, { useState, useEffect, useCallback } from 'react';
import { ListGroup, Card, Spinner, Alert, Button, Image } from 'react-bootstrap';
import { FaEnvelope, FaUser, FaFilePdf } from 'react-icons/fa';
import { getJobApplicants } from '../../services/CompanyService';
import { toast } from 'react-toastify';

function ApplicantListView({ jobId }) {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplicants = useCallback(async () => {
        if (!jobId) {
            setApplicants([]);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await getJobApplicants(jobId);

            let applicantData = [];
            if (response && response.data && Array.isArray(response.data.applicants)) {
                applicantData = response.data.applicants;
            } else if (response && Array.isArray(response.applicants)) {
                 applicantData = response.applicants;
            } else if (Array.isArray(response)) {
                 applicantData = response;
            } else if (response && response.data && Array.isArray(response.data)){
                applicantData = response.data;
            }
            else {
                 console.warn("Cấu trúc response không mong đợi từ API getJobApplicants:", response);
                 throw new Error("Dữ liệu ứng viên trả về không đúng định dạng.");
            }

            setApplicants(applicantData);

        } catch (err) {
            console.error(`Lỗi khi tải ứng viên cho công việc ${jobId}:`, err);
            const errorMsg = err.response?.data?.message || err.message || "Không thể tải danh sách ứng viên.";
            setError(errorMsg);
            toast.error(`Lỗi: ${errorMsg}`);
            setApplicants([]);
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        fetchApplicants();
    }, [fetchApplicants]);

    if (loading) {
        return (
            <div className="text-center my-4 p-3 border rounded bg-light">
                <Spinner animation="border" size="sm" variant="primary" className="me-2" />
                <span className="text-muted">Đang tải danh sách ứng viên...</span>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger" className="mt-3"><strong>Lỗi:</strong> {error}</Alert>;
    }

    if (applicants.length === 0) {
        return (
            <Alert variant="secondary" className="mt-3 text-center">
                Hiện chưa có ứng viên nào ứng tuyển cho công việc này.
            </Alert>
        );
    }

    return (
        <Card className="mt-3 shadow-sm">
            <Card.Header as="h6" className="bg-light">Danh sách ứng viên ({applicants.length})</Card.Header>
            <ListGroup variant="flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {applicants.map((applicant) => (
                    <ListGroup.Item
                        key={applicant._id}
                        className="d-flex flex-column flex-md-row justify-content-between align-items-md-center"
                    >
                        <div className="me-md-3 mb-2 mb-md-0 flex-grow-1">
                            <div className="d-flex align-items-center mb-1">
                                <Image
                                    src={applicant.avatarUrl || '/default-avatar.png'}
                                    roundedCircle
                                    width={35}
                                    height={35}
                                    className="me-2 border"
                                    alt={`Avatar of ${applicant.username}`}
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
                                    variant="outline-info"
                                    size="sm"
                                    href={applicant.cvFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Xem CV của ${applicant.username}`}
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