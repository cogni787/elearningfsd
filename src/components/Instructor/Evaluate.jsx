import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../context/UserContext';
import { Modal, Button } from 'react-bootstrap'; // Import Bootstrap Modal

const BASE_URL = 'http://localhost:20001/elearning/api/instructors';

const Evaluate = () => {
    const { submissionId } = useParams();
    const location = useLocation();
    const { assessmentId } = location.state || {}; // Retrieve assessmentId from state
    const { authToken,userId } = useUserContext();
    const [submissionDetails, setSubmissionDetails] = useState(null);
    const [error, setError] = useState(null);
    const [marks, setMarks] = useState('');
    const [isAssigned, setIsAssigned] = useState(false); // New state to track if marks are assigned
    const [modalMessage, setModalMessage] = useState(''); // State for modal message
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId ||!assessmentId) {
            navigate('/instructor');
            return;
        }
        axios
            .get(`${BASE_URL}/${userId}/assessment/${assessmentId}/submission/${submissionId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            .then(response => {
                setSubmissionDetails(response.data);
                console.log('Submission details fetched successfully:', response.data);
            })
            .catch(error => {
                console.error('Error fetching submission details:', error);
                setError('Failed to load submission details. Please try again later.');
            });
    }, [assessmentId, submissionId, authToken, userId,navigate]);

    const handleMarksSubmit = () => {
        if (marks <=0 || marks > submissionDetails.maxScore) {
            alert(`Marks must be from 1 to ${submissionDetails.maxScore}.`);
            return; // Prevent submission if validation fails
        }

        axios
            .put(`${BASE_URL}/${userId}/submission/${submissionId}/grade/${marks}`, null, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            .then(() => {
                setModalMessage('Marks assigned successfully!');
                setShowModal(true); // Show modal on success
                setIsAssigned(true); // Set the state to true after assigning marks
            })
            .catch(error => {
                console.error('Error assigning marks:', error);
                setModalMessage('Failed to assign marks. Please try again.');
                setShowModal(true); // Show modal on error
            });
    };

    return (
        <div className="evaluate container mt-5">
            <h1 className="text-center mb-4">Evaluate Submission-{submissionId}</h1>
            {error && <p className="text-danger text-center">{error}</p>}
            {submissionDetails ? (
                <div>
                        <h3>Questions and Answers</h3>
                        <p><strong>Question:</strong> {submissionDetails.question}</p>
                        <p><strong>Answer:</strong> {submissionDetails.answer}</p>
                        <div className="mt-3">
                            <input
                                type="number"
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                                placeholder="Enter marks"
                                min="0" // Set minimum score to 0
                                max={submissionDetails.maxScore} // Dynamically set maximum score
                                className="form-control d-inline-block w-auto"
                                disabled={isAssigned} // Disable the input if marks are assigned
                            />
                            <button
                                onClick={handleMarksSubmit}
                                className="btn btn-primary ml-2"
                                disabled={isAssigned} // Disable the button if marks are assigned
                            >
                                {isAssigned ? 'Assigned' : 'Assign Marks'} {/* Change button text */}
                            </button>
                        </div>
                </div>
            ) : (
                <p className="text-center">Loading...</p>
            )}
            <div className="text-center mt-4">
                <button onClick={() => navigate(-1)} className="btn btn-secondary">Back</button>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Evaluate;
