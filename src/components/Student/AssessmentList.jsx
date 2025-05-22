import { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../../context/UserContext";
import ViewScore from "./ViewScore"; // Import the new ViewScore component
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal

function AssessmentList() {
    const [assessments, setAssessments] = useState([]);
    const [selectedAssessment, setSelectedAssessment] = useState(null); // State to track selected assessment

    const { courseId, authToken, userId, setNumberOfAssessments } = useUserContext();
    const [viewSubmissions, setViewSubmissions] = useState(null); // State to track submissions for an assessment
    const navigate = useNavigate(); // Initialize navigate function
    const [modalMessage] = useState(""); // State for modal message
    const [showModal, setShowModal] = useState(false); // State to control modal visibility


    useEffect(() => {
        axios.get(`http://localhost:20001/elearning/api/students/${userId}/course/${courseId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then(response => {
                setAssessments(response.data);
                setNumberOfAssessments(response.data.length); 
                console.log(response.data)
            })
            .catch(error => {
                console.error("Error fetching assessments:", error);
            });
    }, [userId,courseId, authToken, setNumberOfAssessments]);

    const handleViewSubmissions = (assessmentId) => {
        axios.get(`http://localhost:20001/elearning/api/students/${userId}/assessment/${assessmentId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((response) => {
                setViewSubmissions(response.data);
                // Store the submissions
            })
            .catch((error) => {
                console.error("Error fetching submissions:", error);
            });
    };

    if (viewSubmissions) {
        return (
            <div className="container mt-4">
                <h2 className="text-center mb-4">Submissions</h2>
                <ul className="list-group">
                    {viewSubmissions.map((submission, index) => (
                        <li key={index} className="list-group-item">
                            <p>Submission No.: {index + 1}</p>
                            <button 
                                className="btn btn-primary"
                                onClick={() => navigate(`/view-score/${submission.submissionId}`)}
                            >
                                View
                            </button>
                        </li>
                    ))}
                </ul>
                <button 
                    className="btn btn-secondary mt-3"
                    onClick={() => setViewSubmissions(null)}
                >
                    Back to Assessments
                </button>
            </div>
        );
    }

    if (selectedAssessment) {
        return <Assessment assessment={selectedAssessment} />; // Render Assessment component if selected
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Assessment List</h1>
            <div className="row">
                {assessments.map((assessment, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h3 className="card-title">Assessment-{index}</h3>
                                <p className="card-text">Score: {assessment.maxScore}</p>
                                <div className="d-flex justify-content-between">
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => setSelectedAssessment(assessment)}
                                    >
                                        Take Assessment
                                    </button>
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleViewSubmissions(assessment.assessmentId)}
                                    >
                                        View Submissions
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
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
}

export default AssessmentList;

export function Assessment({ assessment }) {
    const { userId, authToken } = useUserContext(); // Access studentId and authToken from context
    const [answer, setAnswer] = useState(""); // State to track the answer
    const [submissionResponse, setSubmissionResponse] = useState(null); // State to track submission response
//const [isSubmitted, setIsSubmitted] = useState(false); // Track if the assessment is submitted
    const [viewScore, setViewScore] = useState(false); // Track if "View Scores" is clicked
    const [hasSubmission, setHasSubmission] = useState(false); // Track if there is at least one submission
    const [modalMessage, setModalMessage] = useState(""); // State for modal message
    const [showModal, setShowModal] = useState(false); // State to control modal visibility


    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionDTO = { answer };
        if(!userId ){
            return navigator('/student');
        }

        axios.post(
            `http://localhost:20001/elearning/api/students/${userId}/submitAssessments/${assessment.assessmentId}`,
            submissionDTO,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        )
            .then((response) => {
                setSubmissionResponse(response.data); // Store the response
 //               setIsSubmitted(true); // Mark as submitted
                setHasSubmission(true); // Update submission status
                setModalMessage("Submission successful!");
                setShowModal(true); // Show modal on success
            })
            .catch((error) => {
                console.error("Error submitting assessment:", error);
                setModalMessage("Submission failed. Please try again.");
                setShowModal(true); // Show modal on error
            });
    };

    if (viewScore) {
        return <ViewScore submissionId={submissionResponse?.submissionId} />; // Render ViewScore component
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Assessment Details</h2>
            <p><strong>Question:</strong> {assessment.question}</p>
            <p><strong>Max Score:</strong> {assessment.maxScore}</p>
            <form onSubmit={handleSubmit} className="mb-3">
                <div className="mb-3">
                    <label htmlFor="answer" className="form-label">Answer</label>
                    <textarea
                        id="answer"
                        name="answer"
                        className="form-control"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            {hasSubmission && (
                <button 
                    className="btn btn-secondary"
                    onClick={() => setViewScore(true)}
                >
                    View Scores
                </button>
            )}
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
}