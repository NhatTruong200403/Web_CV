import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { signup } from '../services/UserService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function RegisterModal(props) {
    const { show, handleClose } = props;
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log(formData)
            const response = await signup(formData);
            toast.success("Đăng kí thành công")
            console.log("Đăng kí thành công:", response.data);
        } catch (error) {
            toast.error("Đăng kí thất bại")
            console.error("Lỗi đăng kí:", error.response?.data || error.message);
        }

    };
    const resetForm = () => {
        setFormData({
            email: "",
            username: "",
            password: ""
        });
    };
    useEffect(() => {
        if (!show)
            resetForm()
    }, [show])
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Register Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicUserName">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type='text'
                                name='username'
                                value={formData.userName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                name='password'
                                autoComplete="off"
                                value={formData.password}
                                onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RegisterModal;