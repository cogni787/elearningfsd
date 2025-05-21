import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../../services/courseService';
import { enrollInCourse } from '../../services/enrollmentService';
import { useUserContext } from '../../context/UserContext';
import { Modal, Button } from 'react-bootstrap'; // Import Bootstrap Modal

function SearchCourse() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);
    const { userId, authToken ,userRole} = useUserContext();
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState(""); // State for modal message
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseData = await getCourseById(courseId);
                setCourse(courseData);
            } catch (err) {
                console.error('Error fetching course:', err);
                setError('Failed to fetch course. Please try again later.');
            }
        };
        fetchCourse();
    }, [courseId]);

    const handleEnroll = async () => {
        if (!userId || !authToken) {
            setModalMessage('You need to log in to enroll in a course.');
            setShowModal(true); // Show modal on error
            navigate('/login'); // Redirect to the login page
            return;
        }
        try {
            await enrollInCourse(userId, courseId, authToken);
            setModalMessage('Successfully enrolled in the course!');
            setShowModal(true); // Show modal on success
        } catch (err) {
            console.error('Error enrolling in course:', err);
            setModalMessage('Failed to enroll in the course. Please try again later.');
            setShowModal(true); // Show modal on error
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h1 className="card-title text-primary">{course.title}</h1>
                    <p className="card-text text-muted">{course.description}</p>
                    <p className="card-text"><strong>Instructor:</strong> {course.instructorName}</p>
                    {userRole !== "ROLE_INSTRUCTOR" && (
                        <button onClick={handleEnroll} className="btn btn-success">
                            Enroll
                        </button>
                    )}
                </div>
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

export default SearchCourse;
