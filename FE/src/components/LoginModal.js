import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { getMe, login } from '../services/UserService';
import { useAuth } from '../provider/AuthProvider';

function LoginModal(props) {
    const { show, handleClose } = props;
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const { saveToken } = useAuth();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleGGSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:3000/auth/google", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log(response);
        } catch (error) {
            console.error("Lỗi đăng nhập:", error.response?.data || error.message);
        }

    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log(formData);
            const response = await login(formData);
            const token = response.data;
            console.log(token);
            toast.success("Đăng nhập thành công");
            sessionStorage.setItem("token", token)
            const userInfo = await getMe();
            const role = userInfo.data.role.name;

            saveToken(token, role);

        } catch (error) {
            console.error("Lỗi đăng nhập:", error.response?.data || error.message);
            toast.error("Đăng nhập thất bại");
        }
    };
    const resetForm = () => {
        setFormData({
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
                    <Modal.Title>Login Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicUserName">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type='text'
                                name='username'
                                value={formData.username}
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
                    <div>
                        <button
                            className="btn btn-success my-3"
                            onClick={handleGGSubmit}
                        >
                            Đăng nhập google
                        </button >
                    </div >
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LoginModal;