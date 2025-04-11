import React, { useState } from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';

function ApplyConfirmModal({ show, handleClose, handleConfirm, jobTitle, companyName, isLoading, error }) {

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận Ứng tuyển</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger" className="small">{error}</Alert>}
                <p>Bạn có chắc chắn muốn ứng tuyển vào vị trí:</p>
                <p><strong>{jobTitle}</strong> tại <strong>{companyName}</strong>?</p>
                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-1"
                            />
                            Đang xử lý...
                        </>
                    ) : (
                        'Xác nhận Ứng tuyển'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ApplyConfirmModal;