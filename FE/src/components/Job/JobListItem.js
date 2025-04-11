import React from 'react';
import { Card, Badge, Button, Stack } from 'react-bootstrap';
import { FaMapMarkerAlt, FaBuilding, FaDollarSign } from 'react-icons/fa';
import styles from './JobListItem.module.css';

function JobListItem({ job, onSelectJob, isSelected }) {
    const {
        title = "Unknown Title",
        companyId = {},
        location = "Not specified",
        salary = {},
    } = job;

    const hasSalaryInfo = salary && Object.keys(salary).length > 0 && (salary.min || salary.max || salary.fixed);

    const handleSelect = () => {
        onSelectJob(job);
    };

    return (
        <Card
            className={`${styles.jobCard} mb-2 ${isSelected ? styles.selected : ''}`}
            onClick={handleSelect}
        >
            <Card.Body>
                <Stack gap={2}>
                    <Card.Title as="h6" className={styles.jobTitle}>{title}</Card.Title>
                    <div className="text-muted small">
                        <FaBuilding className="me-1" /> {companyId?.companyName || "Unknown Company"}
                    </div>
                    <div className="text-muted small">
                        <FaMapMarkerAlt className="me-1" /> {location}
                    </div>
                    {hasSalaryInfo && (
                        <div className="small">
                            <FaDollarSign className="me-1 text-success" />
                            {salary.negotiable ? (
                                <Badge bg="light" text="dark">
                                    {salary.min} - {salary.max} VNĐ (Thỏa thuận)
                                </Badge>
                            ) : (
                                <Badge bg="light" text="dark">
                                    {salary.fixed ? `Từ ${salary.fixed} VNĐ` : 'Thương lượng'}
                                </Badge>
                            )}
                        </div>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    );
}

export default JobListItem;