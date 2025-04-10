import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { signup } from '../services/UserService';
import { toast } from 'react-toastify';

function RegisterModal(props) {
    const { show, handleClose } = props;
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: ""
    });
    const [errors, setErrors] = useState({});

    const resetFormAndErrors = () => {
        setFormData({
            email: "",
            username: "",
            password: ""
        });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});

        try {
            console.log("Submitting:", formData);
            const response = await signup(formData);
            toast.success("Đăng kí thành công!");
            console.log("Đăng kí thành công:", response.data);
            handleClose();

        } catch (error) {
            console.error("Lỗi đăng kí:", error.response?.data || error.message);

            const backendErrors = error.response?.data?.data;

            if (error.response && error.response.status === 404 && Array.isArray(backendErrors)) {
                const newErrors = {};
                backendErrors.forEach(err => {
                    if (err.path && err.msg) {
                        newErrors[err.path] = err.msg;
                    } else if (err.param && err.msg) {
                        newErrors[err.param] = err.msg;
                    }
                });
                setErrors(newErrors);
                toast.error("Thông tin không hợp lệ. Vui lòng kiểm tra lại.");
            } else {
                toast.error("Đăng kí thất bại. Vui lòng thử lại sau.");
            }
        }
    };

    // --- Reset Form When Modal Closes ---
    useEffect(() => {
        if (!show) {
            // Delay reset slightly to allow modal fade-out animation
            const timer = setTimeout(() => {
                resetFormAndErrors();
            }, 300); // Adjust timing if needed
            return () => clearTimeout(timer);
        }
    }, [show]);




    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}> {/* Prevent closing on backdrop click during submission */}
                <Modal.Header closeButton>
                    <Modal.Title>Register Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Use onSubmit on the Form element */}
                    <Form onSubmit={handleSubmit} noValidate>
                        {/* Email Field */}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email} // Show red border if error exists
                                required // Basic HTML5 validation (optional)
                            />
                            {/* Display backend validation error */}
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Username Field */}
                        <Form.Group className="mb-3" controlId="formBasicUsername"> {/* Corrected controlId */}
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type='text'
                                name='username'
                                value={formData.username} // Use the corrected variable
                                onChange={handleChange}
                                isInvalid={!!errors.username} // Show red border if error exists
                                required
                            />
                            {/* Display backend validation error */}
                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Password Field */}
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                name='password'
                                autoComplete="new-password" // More appropriate for registration
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password} // Show red border if error exists
                                required
                            />
                            {/* Display backend validation error */}
                            {/* Displaying long password requirements might need specific styling */}
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                            {/* Optionally add helper text for password requirements */}
                            {!errors.password && <Form.Text muted>
                                Ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký hiệu.
                            </Form.Text>}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {/* Trigger form submission via the button's onClick */}
                    <Button variant="primary" onClick={handleSubmit}>
                        Register
                        {/* Changed text from "Save Changes" */}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RegisterModal;