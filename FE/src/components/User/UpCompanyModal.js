import { useEffect, useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { upCompany } from "../../services/UserService";

function UpCompanyModal(props) {
    var { show, handleClose } = props
    const [taxCode, setTaxCode] = useState();
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        description: "",
        websiteUrl: "",
        image: null
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevState => ({
                ...prevState,
                image: file
            }));

            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
        console.log(formData)
    };
    var registerCompany = async () => {
        try {
            var token = sessionStorage.getItem("token");
            console.log(token);
            var response = await upCompany(taxCode, formData);

            toast.success("submit thành công")
            console.log("submit thành công:", response.data);
        }
        catch (error) {
            console.log(error)
            toast.error("thất bại")
        }
    }
    const resetForm = () => {
        setTaxCode("");
        setPreviewImage(null);
        setFormData({
            description: "",
            websiteUrl: "",
            image: null
        });
    };
    useEffect(() => {
        if (!show)
            resetForm()
    }, [show])
    const handleSaveChanges = async () => {
        await registerCompany();
        handleClose();
    };
    return (
        <>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Register Company</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicTaxCode">
                            <Form.Label>Tax Code</Form.Label>
                            <Form.Control
                                type='text'
                                name='taxCode'
                                value={taxCode}
                                onChange={event => setTaxCode(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type='text'
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicURL">
                            <Form.Label>website URL</Form.Label>
                            <Form.Control
                                type='url'
                                name='websiteUrl'
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                placeholder="https://example.com" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        {previewImage && (
                            <div className="text-center mb-3">
                                <Image src={previewImage} alt="Preview" fluid thumbnail />
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UpCompanyModal;