import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../provider/AuthProvider';
import { getMe, updateUser, uploadAvatar, uploadUserCV, generateAndUploadCV } from '../../services/UserService';
import { toast } from 'react-toastify';

function UserProfile() {
    const { auth } = useAuth();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        fullName: '', 
        phone: '',   
        address: '',
        avatarUrl: '',
        cvUrl: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [cvFile, setCvFile] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingCv, setUploadingCv] = useState(false);
    const [generatingCv, setGeneratingCv] = useState(false);
    const [error, setError] = useState('');

    const fetchUser = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getMe();
            const userData = response.data;
            setUser(userData);
            setFormData({
                email: userData.email || '',
                username: userData.username || '',
                fullName: userData.fullName || '', 
                phone: userData.phonenumber || '', 
                address: userData.address || '',  
                avatarUrl: userData.avatarUrl || '/default-avatar.png',
                cvUrl: userData.cvFile || null 
            });
            setPreviewAvatar(userData.avatarUrl || '/default-avatar.png');
        } catch (err) {
            setError('Không thể tải dữ liệu người dùng.');
            console.error("Lỗi fetch user:", err);
            toast.error('Không thể tải dữ liệu người dùng.');
        } finally {
            setLoading(false);
        }
    }, []); // Dependency rỗng vì chỉ fetch khi mount hoặc khi fetchUser được gọi lại

    useEffect(() => {
        fetchUser();
    }, [fetchUser]); // Gọi fetchUser khi component mount

    // Hàm xử lý thay đổi input chung
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Hàm xử lý chọn file avatar
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra kích thước và loại file nếu cần
            setAvatarFile(file);
            setPreviewAvatar(URL.createObjectURL(file)); // Tạo preview tạm thời
        }
    };

    // Hàm xử lý chọn file CV
     const handleCvChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra loại file (chỉ chấp nhận PDF)
             if (file.type === "application/pdf") {
                setCvFile(file);
             } else {
                 toast.error("Vui lòng chỉ chọn file PDF.");
                 e.target.value = null; // Reset input file
             }
        }
    };

    // ===>>> THAY ĐỔI CHÍNH Ở ĐÂY <<<===
    // Hàm xử lý cập nhật thông tin Profile (PUT /users/:id)
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!user?._id) return;

        // Chỉ lấy các trường được phép cập nhật từ formData
        const updateData = {
            email: formData.email,
            phonenumber: formData.phone // Gửi giá trị của 'phone' dưới key 'phonenumber'
            // Không gửi username, fullName, address vì không có trong allowFields hoặc không nên sửa đổi
        };

        // Kiểm tra xem email hoặc phonenumber có thực sự thay đổi không
        if (updateData.email === user.email && updateData.phonenumber === user.phonenumber) {
            toast.info("Không có thông tin nào thay đổi.");
            return; // Không gọi API nếu không có gì thay đổi
        }


        setUpdatingProfile(true);
        try {
            // Gọi API updateUser với dữ liệu đã lọc
            await updateUser(user._id, updateData);
            toast.success('Cập nhật thông tin thành công!');
            // Fetch lại user data để cập nhật UI sau khi thành công
            fetchUser();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cập nhật thông tin thất bại.');
            console.error("Lỗi update profile:", err);
        } finally {
            setUpdatingProfile(false);
        }
    };
    // ===>>> KẾT THÚC THAY ĐỔI <<<===

    // Hàm xử lý tải lên Avatar (POST /users/uploadAvatar)
    const handleAvatarUpload = async () => {
        if (!avatarFile) return;
        setUploadingAvatar(true);
        try {
             const response = await uploadAvatar(avatarFile); // Gọi API upload
             toast.success('Cập nhật ảnh đại diện thành công!');
             // Fetch lại dữ liệu user để lấy avatarUrl mới nhất
             fetchUser();
             setAvatarFile(null); // Reset file đã chọn
        } catch (err) {
            toast.error(err.response?.data?.message || 'Tải lên ảnh đại diện thất bại.');
             console.error("Lỗi upload avatar:", err);
        } finally {
             setUploadingAvatar(false);
        }
    };

     // Hàm xử lý tải lên CV (POST /users/uploadCV)
     const handleCvUpload = async () => {
        if (!cvFile) return;
        setUploadingCv(true);
         try {
             const response = await uploadUserCV(cvFile); // Gọi API upload CV
             toast.success('Tải lên CV thành công!');
             // Fetch lại dữ liệu user để lấy cvUrl mới nhất
             fetchUser();
             setCvFile(null); // Reset file đã chọn
             // Reset input file để có thể chọn lại cùng file nếu muốn
             document.getElementById('formFileCv').value = null;
        } catch (err) {
             toast.error(err.response?.data?.message || 'Tải lên CV thất bại.');
             console.error("Lỗi upload CV:", err);
         } finally {
             setUploadingCv(false);
         }
     };

    if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!user) return <Alert variant="warning">Không tìm thấy dữ liệu người dùng.</Alert>;

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Thông tin cá nhân</h2>
            <Row>
                {/* Cột Avatar và CV */}
                <Col md={4} className="mb-3 mb-md-0">
                    {/* Card Avatar */}
                    <Card className="text-center mb-3">
                        <Card.Body>
                            <Image
                                src={previewAvatar}
                                roundedCircle
                                width={150}
                                height={150}
                                className="mb-3 border" // Thêm border nhẹ
                                alt="User Avatar"
                                // Xử lý lỗi nếu ảnh không load được
                                onError={(e) => { e.target.onerror = null; e.target.src="/default-avatar.png" }}
                            />
                            <Form.Group controlId="formFileAvatar" className="mb-2">
                                <Form.Label className="small">Thay đổi ảnh đại diện</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} size="sm" />
                            </Form.Group>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={handleAvatarUpload}
                                disabled={!avatarFile || uploadingAvatar}
                            >
                                {uploadingAvatar ? <Spinner as="span" animation="border" size="sm" /> : 'Tải lên ảnh'}
                            </Button>
                        </Card.Body>
                    </Card>

                     {/* Card CV */}
                     <Card>
                         <Card.Body>
                            <Card.Title>Hồ sơ CV</Card.Title>
                             {/* Hiển thị link CV hiện tại từ formData */}
                             {formData.cvUrl ? (
                                 <p className="small mb-2">
                                     <a href={formData.cvUrl} target="_blank" rel="noopener noreferrer">Xem CV hiện tại</a>
                                 </p>
                             ) : (
                                 <p className="small mb-2 text-muted">Bạn chưa có CV.</p>
                             )}
                             {/* Upload CV thủ công */}
                            <Form.Group controlId="formFileCv" className="mb-2">
                                 <Form.Label className="small">{formData.cvUrl ? 'Thay thế CV (PDF)' : 'Tải lên CV (PDF)'}</Form.Label>
                                 <Form.Control type="file" accept=".pdf" onChange={handleCvChange} size="sm" />
                            </Form.Group>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleCvUpload}
                                disabled={!cvFile || uploadingCv}
                                className="me-2"
                            >
                                {uploadingCv ? <Spinner as="span" animation="border" size="sm" /> : 'Tải lên CV'}
                            </Button>
                         </Card.Body>
                     </Card>
                </Col>

                {/* Cột thông tin chi tiết */}
                <Col md={8}>
                    <Card>
                        <Card.Header>Chỉnh sửa thông tin</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleProfileUpdate}>
                                <Form.Group className="mb-3" controlId="formUsername">
                                    <Form.Label>Tên đăng nhập</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        readOnly // Giữ readOnly
                                        disabled
                                        className="bg-light"
                                    />
                                    <Form.Text muted>Tên đăng nhập không thể thay đổi.</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                {/* Trường Số điện thoại */}
                                <Form.Group className="mb-3" controlId="formPhone">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="tel" // Dùng type tel
                                        name="phone" // Tên ở form là 'phone'
                                        placeholder="Nhập số điện thoại"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={updatingProfile}
                                >
                                    {updatingProfile ? <Spinner as="span" animation="border" size="sm" /> : 'Lưu thay đổi'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default UserProfile;