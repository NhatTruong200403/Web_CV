// src/components/User/ManageCv.js
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Accordion, InputGroup } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa'; // Import icons
// Bỏ import useAuth vì không dùng trực tiếp ở đây
import { getMe, uploadUserCV, generateCvFromData } from '../../services/UserService'; // Đảm bảo import đúng các hàm service
import { toast } from 'react-toastify';

// --- Mẫu dữ liệu cho các mục trong mảng (giữ nguyên) ---
const educationTemplate = { degree: '', school: '', year: '', gpa: '', relevantCourses: '' };
const experienceTemplate = { title: '', company: '', duration: '', description: '', technologies: '' };
const projectTemplate = { name: '', description: '', technologies: '', github: '' };
const certificationTemplate = { name: '', year: '', issuer: '' };
const languageTemplate = { language: '', level: '' };

function ManageCv() {
    const [user, setUser] = useState(null); // Vẫn giữ state user nếu cần dùng thông tin khác
    // --- State cho Upload CV ---
    const [currentCvUrl, setCurrentCvUrl] = useState(null); // State lưu URL CV hiện tại (nếu có)
    const [cvFile, setCvFile] = useState(null); // State lưu file CV người dùng chọn
    const [uploadingCv, setUploadingCv] = useState(false); // State báo đang upload
    const [loadingUser, setLoadingUser] = useState(true); // State loading dữ liệu user
    const [errorUser, setErrorUser] = useState(''); // State báo lỗi khi load user

    // State cho Form Generate CV (giữ nguyên từ code gốc của bạn)
    const initialCvFormData = {
        personalInfo: { name: '', email: '', phone: '', address: '', linkedin: '', github: '', portfolio: '' },
        education: [educationTemplate],
        experience: [experienceTemplate],
        projects: [projectTemplate],
        skills: '',
        certifications: [certificationTemplate],
        languages: [languageTemplate],
        hobbies: '',
    };
    const [cvFormData, setCvFormData] = useState(initialCvFormData);
    const [generatingCv, setGeneratingCv] = useState(false);
    const [generateError, setGenerateError] = useState('');

    // Hàm fetch user (lấy thông tin user và CV hiện tại) - Kết hợp logic của cả upload và generate
    const fetchUser = useCallback(async () => {
        setLoadingUser(true);
        setErrorUser('');
        try {
            const response = await getMe();
            const userData = response.data;
            setUser(userData); // Cập nhật state user
            setCurrentCvUrl(userData?.cvFile || null); // Lấy URL CV hiện tại

            // Đồng bộ personalInfo cho form generate CV khi fetch user
            setCvFormData(prev => ({
                ...prev,
                personalInfo: {
                    name: userData?.fullName || prev.personalInfo.name || '',
                    email: userData?.email || prev.personalInfo.email || '',
                    phone: userData?.phonenumber || prev.personalInfo.phone || '',
                    address: userData?.address || prev.personalInfo.address || '',
                    linkedin: prev.personalInfo.linkedin || '', // Giữ lại giá trị user đã nhập nếu có
                    github: prev.personalInfo.github || '',
                    portfolio: prev.personalInfo.portfolio || '',
                }
                // Giữ nguyên các phần khác (education, experience,...) để user không mất dữ liệu
            }));

        } catch (err) {
            setErrorUser('Không thể tải dữ liệu người dùng.');
            console.error("Lỗi fetch user:", err);
            toast.error('Không thể tải dữ liệu người dùng.'); // Thêm toast báo lỗi
        } finally {
            setLoadingUser(false);
        }
    }, []); // Dependency rỗng, gọi 1 lần khi mount hoặc gọi lại thủ công

    useEffect(() => {
        fetchUser();
    }, [fetchUser]); // Gọi fetchUser khi component mount

    // --- PHẦN XỬ LÝ UPLOAD CV (Code đã được chuẩn hóa) ---
    const handleCvFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setCvFile(file);
        } else if (file) {
            toast.error("Vui lòng chỉ chọn file PDF.");
            e.target.value = null;
            setCvFile(null);
        } else {
             setCvFile(null);
        }
    };

    const handleCvUpload = async () => {
        if (!cvFile) {
            toast.warn("Vui lòng chọn một file CV để tải lên.");
            return;
        }
        setUploadingCv(true);
        try {
            await uploadUserCV(cvFile);
            toast.success('Tải lên CV thành công!');
            fetchUser(); // Tải lại thông tin user (bao gồm CV mới)
            setCvFile(null);
            const fileInput = document.getElementById('formFileCvUpload'); // Lấy đúng ID của input
            if (fileInput) {
                fileInput.value = null; // Reset input file
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Tải lên CV thất bại. Vui lòng thử lại.');
            console.error("Lỗi upload CV:", err);
            // Không cần setErrorUser ở đây vì đây là lỗi upload, không phải lỗi load user
        } finally {
            setUploadingCv(false);
        }
    };
    // --- KẾT THÚC PHẦN XỬ LÝ UPLOAD CV ---


    // --- PHẦN XỬ LÝ FORM GENERATE CV (Giữ nguyên từ code gốc của bạn) ---
    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setCvFormData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [name]: value }
        }));
    };

    const handleArrayItemChange = (section, index, field, value) => {
        setCvFormData(prev => {
            const updatedSection = [...prev[section]];
            updatedSection[index] = { ...updatedSection[index], [field]: value };
            return { ...prev, [section]: updatedSection };
        });
    };

    const handleAddItem = (section, template) => {
        setCvFormData(prev => ({
            ...prev,
            [section]: [...prev[section], { ...template }]
        }));
    };

    const handleRemoveItem = (section, index) => {
        if (cvFormData[section].length <= 1) {
             toast.info(`Cần có ít nhất một mục ${section}.`);
             return;
        }
        setCvFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const handleCommaSeparatedChange = (e) => {
        const { name, value } = e.target;
        setCvFormData(prev => ({
             ...prev,
             [name]: value
        }));
    }

    const handleGenerateSubmit = async (e) => {
        e.preventDefault();
        setGeneratingCv(true);
        setGenerateError('');

        const dataToSend = {
            ...cvFormData,
            skills: cvFormData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
            hobbies: cvFormData.hobbies.split(',').map(hobby => hobby.trim()).filter(hobby => hobby),
            education: cvFormData.education.map(edu => ({
                ...edu,
                relevantCourses: edu.relevantCourses.split(',').map(course => course.trim()).filter(course => course)
            })),
            experience: cvFormData.experience.map(exp => ({
                ...exp,
                technologies: exp.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
            })),
            projects: cvFormData.projects.map(proj => ({
                ...proj,
                technologies: proj.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
            }))
        };

        console.log("Submitting CV Data:", dataToSend);

        try {
            // Lưu ý: Hàm generateCvFromData cần được implement ở UserService và backend
            const response = await generateCvFromData(dataToSend);
            toast.success('Gửi yêu cầu tạo CV thành công! CV mới sẽ được cập nhật.');
            fetchUser(); // Fetch lại user để thấy CV mới
            // Có thể không cần reset form ở đây
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Tạo CV từ form thất bại.';
            setGenerateError(errorMsg);
            toast.error(errorMsg);
            console.error("Lỗi generate CV from data:", err);
        } finally {
            setGeneratingCv(false);
        }
    };
    // --- KẾT THÚC PHẦN XỬ LÝ FORM GENERATE CV ---


    // --- RENDER ---
    if (loadingUser) return <div className="text-center my-5"><Spinner animation="border" /> <p>Đang tải dữ liệu...</p></div>;
    if (errorUser) return <Alert variant="danger">{errorUser}</Alert>;
    // Không cần kiểm tra !user nữa vì đã có loading/error state

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Quản lý Hồ sơ CV</h2>

            <Row>
                {/* --- Cột Upload CV --- */}
                <Col md={5} lg={4} className="mb-3 mb-md-0"> {/* Thêm class mb-md-0 để không có margin bottom trên màn lớn */}
                    <Card>
                        <Card.Header>Tải lên CV có sẵn</Card.Header>
                        <Card.Body>
                             {/* Hiển thị link hoặc thông báo dựa trên currentCvUrl */}
                             {currentCvUrl ? (
                                 <p className="small mb-2">
                                     <a href={currentCvUrl} target="_blank" rel="noopener noreferrer">Xem CV hiện tại</a>
                                 </p>
                             ) : (
                                 <p className="small mb-2 text-muted">Bạn chưa có CV nào được tải lên.</p>
                             )}
                             {/* Input chọn file */}
                             <Form.Group controlId="formFileCvUpload" className="mb-2"> {/* Đảm bảo ID khớp với logic reset */}
                                 <Form.Label className="small">{currentCvUrl ? 'Thay thế CV (PDF)' : 'Chọn file CV (PDF)'}</Form.Label>
                                 <Form.Control
                                     type="file"
                                     accept=".pdf"
                                     onChange={handleCvFileChange}
                                     size="sm"
                                     disabled={uploadingCv} // Disable khi đang upload
                                 />
                             </Form.Group>
                             {/* Nút tải lên */}
                            <Button
                                variant="primary" // Đổi màu nút nếu muốn
                                size="sm"
                                onClick={handleCvUpload}
                                disabled={!cvFile || uploadingCv} // Disable khi chưa chọn file hoặc đang upload
                            >
                                {uploadingCv ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        <span className="ms-1">Đang tải lên...</span>
                                    </>
                                ) : (
                                    'Tải lên'
                                )}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* --- Cột Tạo CV từ Form --- */}
                <Col md={7} lg={8}>
                    <Card>
                        <Card.Header>Tạo CV mới từ thông tin chi tiết</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleGenerateSubmit}>
                                {generateError && <Alert variant="danger" size="sm">{generateError}</Alert>}

                                <Accordion defaultActiveKey="0" alwaysOpen>
                                    {/* --- Personal Info --- */}
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Thông tin cá nhân</Accordion.Header>
                                        <Accordion.Body>
                                            <Form.Group className="mb-2" controlId="cvFormName">
                                                <Form.Label size="sm">Họ và tên</Form.Label>
                                                <Form.Control size="sm" type="text" name="name" value={cvFormData.personalInfo.name} onChange={handlePersonalInfoChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-2" controlId="cvFormEmail">
                                                <Form.Label size="sm">Email</Form.Label>
                                                <Form.Control size="sm" type="email" name="email" value={cvFormData.personalInfo.email} onChange={handlePersonalInfoChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-2" controlId="cvFormPhone">
                                                <Form.Label size="sm">Số điện thoại</Form.Label>
                                                <Form.Control size="sm" type="tel" name="phone" value={cvFormData.personalInfo.phone} onChange={handlePersonalInfoChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-2" controlId="cvFormAddress">
                                                <Form.Label size="sm">Địa chỉ</Form.Label>
                                                <Form.Control size="sm" type="text" name="address" value={cvFormData.personalInfo.address} onChange={handlePersonalInfoChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-2" controlId="cvFormLinkedin">
                                                <Form.Label size="sm">LinkedIn URL</Form.Label>
                                                <Form.Control size="sm" type="url" name="linkedin" placeholder="https://" value={cvFormData.personalInfo.linkedin} onChange={handlePersonalInfoChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-2" controlId="cvFormGithub">
                                                <Form.Label size="sm">Github URL</Form.Label>
                                                <Form.Control size="sm" type="url" name="github" placeholder="https://" value={cvFormData.personalInfo.github} onChange={handlePersonalInfoChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-2" controlId="cvFormPortfolio">
                                                <Form.Label size="sm">Portfolio URL</Form.Label>
                                                <Form.Control size="sm" type="url" name="portfolio" placeholder="https://" value={cvFormData.personalInfo.portfolio} onChange={handlePersonalInfoChange} />
                                            </Form.Group>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    {/* --- Education --- */}
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>Học vấn</Accordion.Header>
                                        <Accordion.Body>
                                            {cvFormData.education.map((edu, index) => (
                                                <div key={index} className="mb-3 p-2 border rounded position-relative"> {/* Thêm position-relative */}
                                                    {/* Nút xóa đặt ở góc trên bên phải */}
                                                    {cvFormData.education.length > 1 && (
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            className="position-absolute top-0 end-0 m-1 p-1" // Định vị nút xóa
                                                            style={{ lineHeight: '1', zIndex: 1 }} // Đảm bảo nút hiển thị đúng
                                                            onClick={() => handleRemoveItem('education', index)}
                                                            title="Xóa mục này"
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    )}
                                                    {/* <h6>Mục học vấn #{index + 1}</h6> */} {/* Có thể bỏ tiêu đề này */}
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Bằng cấp/Chuyên ngành</Form.Label>
                                                        <Form.Control size="sm" type="text" value={edu.degree} onChange={(e) => handleArrayItemChange('education', index, 'degree', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Trường học</Form.Label>
                                                        <Form.Control size="sm" type="text" value={edu.school} onChange={(e) => handleArrayItemChange('education', index, 'school', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Niên khóa (vd: 2015-2019)</Form.Label>
                                                        <Form.Control size="sm" type="text" value={edu.year} onChange={(e) => handleArrayItemChange('education', index, 'year', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">GPA (nếu có)</Form.Label>
                                                        <Form.Control size="sm" type="number" step="0.1" value={edu.gpa} onChange={(e) => handleArrayItemChange('education', index, 'gpa', e.target.value)} />
                                                    </Form.Group>
                                                     <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Môn học liên quan (phẩy để phân cách)</Form.Label>
                                                        <Form.Control as="textarea" rows={2} size="sm" value={edu.relevantCourses} onChange={(e) => handleArrayItemChange('education', index, 'relevantCourses', e.target.value)} />
                                                    </Form.Group>
                                                </div>
                                            ))}
                                            <Button variant="outline-primary" size="sm" onClick={() => handleAddItem('education', educationTemplate)}>
                                                <FaPlus className="me-1"/> Thêm mục học vấn
                                            </Button>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    {/* --- Experience --- */}
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>Kinh nghiệm làm việc</Accordion.Header>
                                        <Accordion.Body>
                                            {cvFormData.experience.map((exp, index) => (
                                                <div key={index} className="mb-3 p-2 border rounded position-relative">
                                                     {cvFormData.experience.length > 1 && (
                                                        <Button variant="outline-danger" size="sm" className="position-absolute top-0 end-0 m-1 p-1" style={{ lineHeight: '1', zIndex: 1 }} onClick={() => handleRemoveItem('experience', index)} title="Xóa mục này">
                                                            <FaTrash />
                                                        </Button>
                                                     )}
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Chức danh</Form.Label>
                                                        <Form.Control size="sm" type="text" value={exp.title} onChange={(e) => handleArrayItemChange('experience', index, 'title', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Công ty</Form.Label>
                                                        <Form.Control size="sm" type="text" value={exp.company} onChange={(e) => handleArrayItemChange('experience', index, 'company', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Thời gian (vd: 01/2020 - Hiện tại)</Form.Label>
                                                        <Form.Control size="sm" type="text" value={exp.duration} onChange={(e) => handleArrayItemChange('experience', index, 'duration', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Mô tả công việc</Form.Label>
                                                        <Form.Control as="textarea" rows={3} size="sm" value={exp.description} onChange={(e) => handleArrayItemChange('experience', index, 'description', e.target.value)} />
                                                    </Form.Group>
                                                     <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Công nghệ sử dụng (phẩy để phân cách)</Form.Label>
                                                        <Form.Control as="textarea" rows={2} size="sm" value={exp.technologies} onChange={(e) => handleArrayItemChange('experience', index, 'technologies', e.target.value)} />
                                                    </Form.Group>
                                                </div>
                                            ))}
                                            <Button variant="outline-primary" size="sm" onClick={() => handleAddItem('experience', experienceTemplate)}>
                                                <FaPlus className="me-1"/> Thêm kinh nghiệm
                                            </Button>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    {/* --- Projects --- */}
                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header>Dự án cá nhân</Accordion.Header>
                                        <Accordion.Body>
                                            {cvFormData.projects.map((proj, index) => (
                                                <div key={index} className="mb-3 p-2 border rounded position-relative">
                                                     {cvFormData.projects.length > 1 && (
                                                        <Button variant="outline-danger" size="sm" className="position-absolute top-0 end-0 m-1 p-1" style={{ lineHeight: '1', zIndex: 1 }} onClick={() => handleRemoveItem('projects', index)} title="Xóa mục này">
                                                            <FaTrash />
                                                        </Button>
                                                     )}
                                                     <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Tên dự án</Form.Label>
                                                        <Form.Control size="sm" type="text" value={proj.name} onChange={(e) => handleArrayItemChange('projects', index, 'name', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Mô tả dự án</Form.Label>
                                                        <Form.Control as="textarea" rows={3} size="sm" value={proj.description} onChange={(e) => handleArrayItemChange('projects', index, 'description', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Công nghệ sử dụng (phẩy để phân cách)</Form.Label>
                                                        <Form.Control as="textarea" rows={2} size="sm" value={proj.technologies} onChange={(e) => handleArrayItemChange('projects', index, 'technologies', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Link Github (nếu có)</Form.Label>
                                                        <Form.Control size="sm" type="url" placeholder="https://" value={proj.github} onChange={(e) => handleArrayItemChange('projects', index, 'github', e.target.value)} />
                                                    </Form.Group>
                                                </div>
                                            ))}
                                            <Button variant="outline-primary" size="sm" onClick={() => handleAddItem('projects', projectTemplate)}>
                                                <FaPlus className="me-1"/> Thêm dự án
                                            </Button>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    {/* --- Skills --- */}
                                    <Accordion.Item eventKey="4">
                                        <Accordion.Header>Kỹ năng</Accordion.Header>
                                        <Accordion.Body>
                                            <Form.Group className="mb-2" controlId="cvFormSkills">
                                                <Form.Label size="sm">Liệt kê kỹ năng (phẩy để phân cách)</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    size="sm"
                                                    name="skills"
                                                    placeholder="Ví dụ: JavaScript, React, Node.js, Giao tiếp tốt"
                                                    value={cvFormData.skills}
                                                    onChange={handleCommaSeparatedChange}
                                                />
                                            </Form.Group>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                     {/* --- Certifications --- */}
                                     <Accordion.Item eventKey="5">
                                        <Accordion.Header>Chứng chỉ</Accordion.Header>
                                        <Accordion.Body>
                                             {cvFormData.certifications.map((cert, index) => (
                                                 <div key={index} className="mb-3 p-2 border rounded position-relative">
                                                      {cvFormData.certifications.length > 1 && (
                                                         <Button variant="outline-danger" size="sm" className="position-absolute top-0 end-0 m-1 p-1" style={{ lineHeight: '1', zIndex: 1 }} onClick={() => handleRemoveItem('certifications', index)} title="Xóa mục này">
                                                             <FaTrash />
                                                         </Button>
                                                      )}
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Tên chứng chỉ</Form.Label>
                                                        <Form.Control size="sm" type="text" value={cert.name} onChange={(e) => handleArrayItemChange('certifications', index, 'name', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Năm cấp</Form.Label>
                                                        <Form.Control size="sm" type="text" value={cert.year} onChange={(e) => handleArrayItemChange('certifications', index, 'year', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Tổ chức cấp</Form.Label>
                                                        <Form.Control size="sm" type="text" value={cert.issuer} onChange={(e) => handleArrayItemChange('certifications', index, 'issuer', e.target.value)} />
                                                    </Form.Group>
                                                 </div>
                                             ))}
                                             <Button variant="outline-primary" size="sm" onClick={() => handleAddItem('certifications', certificationTemplate)}>
                                                 <FaPlus className="me-1"/> Thêm chứng chỉ
                                             </Button>
                                         </Accordion.Body>
                                     </Accordion.Item>

                                    {/* --- Languages --- */}
                                    <Accordion.Item eventKey="6">
                                        <Accordion.Header>Ngôn ngữ</Accordion.Header>
                                        <Accordion.Body>
                                            {cvFormData.languages.map((lang, index) => (
                                                 <div key={index} className="mb-3 p-2 border rounded position-relative">
                                                      {cvFormData.languages.length > 1 && (
                                                         <Button variant="outline-danger" size="sm" className="position-absolute top-0 end-0 m-1 p-1" style={{ lineHeight: '1', zIndex: 1 }} onClick={() => handleRemoveItem('languages', index)} title="Xóa mục này">
                                                             <FaTrash />
                                                         </Button>
                                                      )}
                                                     <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Tên ngôn ngữ</Form.Label>
                                                        <Form.Control size="sm" type="text" value={lang.language} onChange={(e) => handleArrayItemChange('languages', index, 'language', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label size="sm">Trình độ</Form.Label>
                                                        <Form.Control size="sm" type="text" placeholder="Ví dụ: Bản ngữ, Thành thạo, Cơ bản" value={lang.level} onChange={(e) => handleArrayItemChange('languages', index, 'level', e.target.value)} />
                                                    </Form.Group>
                                                 </div>
                                             ))}
                                             <Button variant="outline-primary" size="sm" onClick={() => handleAddItem('languages', languageTemplate)}>
                                                 <FaPlus className="me-1"/> Thêm ngôn ngữ
                                             </Button>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                     {/* --- Hobbies --- */}
                                    <Accordion.Item eventKey="7">
                                        <Accordion.Header>Sở thích</Accordion.Header>
                                        <Accordion.Body>
                                             <Form.Group className="mb-2" controlId="cvFormHobbies">
                                                <Form.Label size="sm">Liệt kê sở thích (phẩy để phân cách)</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    size="sm"
                                                    name="hobbies"
                                                     placeholder="Ví dụ: Đọc sách, Chơi thể thao, Du lịch"
                                                    value={cvFormData.hobbies}
                                                    onChange={handleCommaSeparatedChange}
                                                />
                                            </Form.Group>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                </Accordion>

                                <Button
                                    variant="success"
                                    type="submit"
                                    className="mt-3"
                                    disabled={generatingCv}
                                >
                                    {generatingCv ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" />
                                            <span className="ms-1">Đang tạo CV...</span>
                                        </>
                                    ) : (
                                        'Tạo và Lưu CV từ Form'
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ManageCv;