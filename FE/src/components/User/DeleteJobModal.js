import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deletePost } from '../../services/JobService';
import { toast } from 'react-toastify';
import { useJobContext } from '../context/JobContext';

function DeleteJobModal(props) {
    var { show, handleClose, id } = props
    var { reloadJobs } = useJobContext()
    var handleDelete = async () => {
        try {
            var res = await deletePost(id);
            console.log(res.data);
            toast.success("Xóa thành công");
            reloadJobs();
            handleClose();
        }
        catch (error) {
            console.log(error);
            toast.error("Xóa thất bại");
        }
    }
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Bạn Có chắc muốn xóa bài đăng này</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteJobModal;